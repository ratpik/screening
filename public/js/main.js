console.log('\'Allo \'Allo!');

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(12.964203, 77.595062),
    zoom: 4
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);


  getVisits(map);


}


function getVisits(map){

  $.getJSON('/visits/', function(results){

      var a1cImg = {
            url: 'img/a1c.png',
            size: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 20)
        };
      var glucoseImg = {
            url: 'img/glucose.png',
            size: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 20)
        };
      
      var hbImg = {
            url: 'img/hb.png',
            size: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 20)
        };

      var icons = {'hba1c' : a1cImg, 'glucose' : glucoseImg, 'hb' : hbImg};

      $.each(results, function(index, visit){
        var latitude = visit["latitude"];
        var longitude = visit["longitude"];

        var loc = new google.maps.LatLng(latitude, longitude);

        var screenedFor = visit["screened"];

        var contentString = 'Patient id ' + Math.floor((Math.random()*100000000)+1);

        var infowindow = new google.maps.InfoWindow({
                content: contentString 
            });

        var rand = Math.floor((Math.random()*100)+1);
        console.log(rand)
        //TODO: Include Market with label js
        //http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.8/docs/examples.html
        if(rand%2 == 0){
          var marker = new google.maps.Marker({
              position: loc,
              animation: google.maps.Animation.DROP,
              icon : icons[screenedFor],
              title: screenedFor,
              labelContent: "At risk",
              labelAnchor: new google.maps.Point(22, 0),
              labelClass: "labels", // the CSS class for the label
              labelStyle: {opacity: 0.75}
          });
        }else{
          var marker = new google.maps.Marker({
              position: loc,
              animation: google.maps.Animation.DROP,
              icon : icons[screenedFor],
              title: screenedFor
          });
        }
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        marker.setMap(map);
      });
      });

}

google.maps.event.addDomListener(window, 'load', initialize);

$('#refreshBtn').click(function(e){
  initialize()      
});

