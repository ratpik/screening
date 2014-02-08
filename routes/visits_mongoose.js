var mongoose = require('mongoose');
 
var uristring = process.env.MONGOLAB_URI ||
                process.env.MONGOHQ_URL ||
                  'mongodb://localhost:27017/visitsdb';

// Makes connection asynchronously.  Mongoose will queue up database
// // operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});


var visitSchema = new mongoose.Schema({
    bio: {
      id: {type: String, trim: true},
      phoneNumber: { type: String, trim: true }
    },
    location : {
      latitude: {type: Number},
      longitude: {type: Number}
    },
    parameters: {
      hba1c : {type: Number},
      glucose : {type: Number},
      hemoglobin : {type: Number},
      cholestrol : {type: Number}

    }

});

//The collection
var Visit = mongoose.model('visits', visitSchema);

exports.findById = function(req, res) {
  var id = req.params.id;
  Visit
    .findOne({'_id': id})
    .exec(function(err, visit){
      res.send(visit);
    });
};

exports.findAll = function(req, res) {
  Visit
    .find({})
    .exec(function(err, visits){
      res.send(visits)
    });
};

exports.addVisit = function(req, res) {
  var visit = new Visit(req.body);

  visit.save(function(err){
    if(err){
      console.log('Error while saving visit')
        res.send({'error':'An error has occurred'});
    }else{
        console.log('Successfully saved ' + visit );
        res.send({'success' : true});
    }

  });
}

exports.updateVisit = function(req, res) {
  var id = req.params.id;
  var visit = new Visit(req.body);
  console.log('Updating visit: ' + id);
  console.log(JSON.stringify(visit));
    Visit.update({'_id':id}, visit, {upsert: true}, function(err) {
      if (err) {
        console.log('Error updating visit: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('document(s) updated');
        res.send(visit);
      }
    });
}

exports.deleteVisit = function(req, res) {
  var id = req.params.id;
  console.log('Deleting visit: ' + id);
  var query = Visit.remove({'_id': id}, function(err){
      if (err) {
        console.log('Error deleting visit: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('document(s) delete');
        res.send(id);
      }
    });
};
