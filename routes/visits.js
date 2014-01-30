var mongo = require('mongodb');
 
var Server = mongo.Server,
        Db = mongo.Db,
            BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('visitsdb', server);
 
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'visitdb' database");
    db.collection('visits', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'visits' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving visit: ' + id);
  db.collection('visits', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  db.collection('visits', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addVisit = function(req, res) {
  var visit = req.body;
  
  //console.log('Request Headers ' + req.headers['Content-Type']);
  console.log('Request body' + visit);
  console.log('Adding visit: ' + JSON.stringify(visit));
  db.collection('visits', function(err, collection) {
    collection.insert(visit, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
}

exports.updateVisit = function(req, res) {
  var id = req.params.id;
  var visit = req.body;
  console.log('Updating visit: ' + id);
  console.log(JSON.stringify(visit));
  db.collection('visits', function(err, collection) {
    collection.update({'_id':new BSON.ObjectID(id)}, visit, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating visit: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(visit);
      }
    });
  });
}

exports.deleteVisit = function(req, res) {
  var id = req.params.id;
  console.log('Deleting visit: ' + id);
  db.collection('visits', function(err, collection) {
    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  });
}


//TODO: Should not exist in production
var populateDB = function(){
var visits = [
  {
    "name" : "p1",
    "date" : "2014-01-28",
    "screened": "glucose",
    "latitude" : "12.964203",
    "longitude" : "77.595062"
  },
  {
    "name" : "p2",
    "date" : "2014-01-28",
    "screened": "hba1c",
    "latitude" : "13.964203",
    "longitude" : "77.595062"
  }];

  db.collection('visits', function(err, collection) {
            collection.insert(visits, {safe:true}, function(err, result) {console.log(err); console.log('Error inserting visits to mongodb');});
                });
};

