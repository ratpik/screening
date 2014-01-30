console.log('\'Allo \'Allo!');

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(12.964203, 77.595062),
    zoom: 4
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);


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

      var icons = {'hba1c' : a1cImg, 'glucose' : glucoseImg};

      $.each(results, function(index, visit){
        var latitude = visit["latitude"];
        var longitude = visit["longitude"];

        var loc = new google.maps.LatLng(latitude, longitude);

        var screenedFor = visit["screened"];

        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';

        var infowindow = new google.maps.InfoWindow({
                content: contentString 
            });

        var marker = new google.maps.Marker({
            position: loc,
            animation: google.maps.Animation.DROP,
            icon : icons[screenedFor],
            title: screenedFor
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        marker.setMap(map);
      });
      });
}

google.maps.event.addDomListener(window, 'load', initialize);


