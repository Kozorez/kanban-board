var express = require('express');
var mongodb = require('mongodb');
var bson = require("bson").BSON;
var bodyParser = require("body-parser");

var app = express();

var MongoClient = mongodb.MongoClient;
var db;

app.use(bodyParser.json());
app.use(express.static('public'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json");
  next();
});

app.get('/users/:userId/projects/', function (req, res) {
  var userId = new bson.ObjectID(req.params.userId);

  db.collection("projects").find({ user_id: userId }).toArray(function(err, projects) {
    if (err) {
      res.status(404);
      res.end();
    }

    res.status(200);
    res.write(JSON.stringify(projects));
    res.end();
  });
});

app.post('/projects/', function (req, res) {
  var postData = req.body;
  postData.user_id = new bson.ObjectID(postData.user_id);
  delete postData.tasks;

  db.collection("projects").insert(postData, function(err, project) {
    if (err) {
      res.status(404);
      res.end();
    }

    res.status(201);
    res.location("/projects/" + project.ops[0]._id.toString());
    res.write(project.ops[0]._id.toString());
    res.end();
  });
});

app.get('/projects/:projectId', function (req, res) {
  var projectId = new bson.ObjectID(req.params.projectId);

  db.collection("projects").findOne({ _id: projectId }, function(err, project) {
    if (err) {
      res.status(404);
      res.end();
    }

    db.collection("tasks").find({ project_id: projectId }).toArray(function(err, tasks) {
      if (err) {
        res.status(404);
        res.end();
      }

      project.tasks = [];

      for (var j = 0; j < tasks.length; j++) {
        if (tasks[j].project_id.equals(project._id)) {
          project.tasks.push(tasks[j]);
        }
      }

      res.status(200);
      res.write(JSON.stringify(project));
      res.end();
    });
  });
});

app.put('/projects/:projectId', function (req, res) {
  var putData = req.body;

  db.collection("projects").update({ _id: new bson.ObjectID(putData._id) }, { $set: { name: putData.name,
                                                                                      desc: putData.desc } } );

  res.status(200);
  res.end();
});

app.delete('/projects/:projectId', function (req, res) {
  var projectId = new bson.ObjectID(req.params.projectId);

  db.collection("projects").remove({ _id: new bson.ObjectID(projectId) });

  db.collection("tasks").remove({ project_id: new bson.ObjectID(projectId) });

  res.status(204);
  res.end();
});

app.post('/tasks/', function (req, res) {
  var postData = req.body;
  postData.project_id = new bson.ObjectID(postData.project_id);
  postData.date = new Date(postData.date);

  db.collection("tasks").insert(postData, function(err, task) {
    if (err) {
      res.status(404);
      res.end();
    }

    res.status(201);
    res.location("/tasks/" + task.ops[0]._id.toString());
    res.write(task.ops[0]._id.toString());
    res.end();
  });
});

app.put('/tasks/:taskId', function (req, res) {
  var putData = req.body;

  db.collection("tasks").update({ _id: new bson.ObjectID(putData._id) }, { $set: { stage: putData.stage,
                                                                                   desc: putData.desc,
                                                                                   type: putData.type,
                                                                                   priority: putData.priority,
                                                                                   date: putData.date } } );

  res.status(200);
  res.end();
});

app.delete('/tasks/:taskId', function (req, res) {
  var taskId = new bson.ObjectID(req.params.taskId);

  db.collection("tasks").remove({ _id: new bson.ObjectID(taskId) });

  res.status(204);
  res.end();
});

app.post('/login/', function (req, res) {
  var postData = req.body;

  db.collection("users").findOne({ username: postData.username, password: postData.password }, function(err, user) {
    if (err) {
      res.status(404);
      res.end();
    }

    if (user) {
      res.status(200);
      res.write(JSON.stringify({ response: user._id }));
      res.end();
    } else {
      res.status(200);
      res.write(JSON.stringify({ response: "null" }));
      res.end();
    }
  });
});

app.post('/register/', function (req, res) {
  var postData = req.body;

  db.collection("users").findOne({ username: postData.username }, function(err, user) {
    if (err) {
      res.status(404);
      res.end();
    }

    if (user) {
      res.status(200);
      res.write(JSON.stringify({ response: "null" }));
      res.end();
    } else {
      db.collection("users").insert({ username: postData.username, password: postData.password }, function(err, user) {
        if (err) {
          res.status(404);
          res.end();
        }

        res.status(200);
        res.write(JSON.stringify({ response: "ok" }));
        res.end();
      });
    }
  });
});


MongoClient.connect("mongodb://localhost:27017/kanban_board", function(err, database) {
  if (err) throw err;

  db = database;

  app.listen(3000, function () {
    console.log('Server listening on port 3000...');
  });
});
