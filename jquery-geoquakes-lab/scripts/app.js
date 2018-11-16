// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var sfMapOpt={center: {lat: 37.78, lng: -122.44},zoom: 3};
var timeArray= {
  time:[0.0,60.0,60.0,24.0,365.0],
  units:['s','min','hours','days','years']
};
var earthquakeIndicator= {
  red: 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0',
  yellow: 'https://storage.googleapis.com/support-kms-prod/SNP_2752063_en_v0',
  green: 'https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0',
}
var map, h1Placeholder;
var markers= [];

$(document).ready(function() {
  console.log("Let's get coding!");
  // CODE IN HERE!

  // get elasped time
  function elaspedTime(utcTime) {
    var diff= parseFloat(Date.now()-new Date(utcTime))/1000.0;
    var i=1;
    while (i<timeArray.time.length) {
      if (diff/timeArray.time[i]>1.0) { 
        diff/= timeArray.time[i++];
      } else {
        break;
      }
    }
    return [Math.round(diff,2),timeArray.units[i-1]];
  }

  // add marker to google map
  function addMarker(coordinates,title,icon) {
    return new google.maps.Marker({
      position: coordinates, map: map, 
      icon: icon, title: title
    });
  }

  function clearMarkers() {
    for (var i=1;i<markers.length;i++) {
      markers[i].setMap(null);
    }
    markers= [markers[0]];
  }

  // get earthquakes
  function getEarthQuakes(option) {

    $.ajax({
      method: 'GET', 
      url: weekly_quakes_endpoint.replace('week',option),
      success: function(response) {
        // clear existing info and markers
        $('#info').find('p').remove();
        clearMarkers();
        $('#info h1').html(`
        ${response.features.length} ${h1Placeholder.replace('week',option)}`).css('display','inline');
        // get each earthquake location info
        response.features.forEach(function(quake){
          var coordinates= {
            lng: quake.geometry.coordinates[0],
            lat: quake.geometry.coordinates[1]
          };
          var title= quake.properties.title;
          var magnitude= parseFloat(title.split(' - ')[0].split(' ')[1]);
          var icon;
          if (magnitude<=4.0) {
            icon= earthquakeIndicator.green;
          } else if (magnitude > 4.0 && magnitude <=5.0) {
            icon= earthquakeIndicator.yellow;
          } else {
            icon= earthquakeIndicator.red;
          }
          var timeDiff= elaspedTime(quake.properties.time);
          $('#info').append(`<p>${title} (${timeDiff[0]} ${timeDiff[1]} ago)</p>`);
          var currMarker= addMarker(coordinates,title,icon);
          markers.push(currMarker);
          currMarker.setMap(map);
          
        });
      },
      error: function(err1,err2,err3) {
        console.log(err1);
        console.log(err2);
        console.log(err3);
        return;
      }
    });

  }

  h1Placeholder= $('#info h1').html();

  // insert google map and center at SF
  map= new google.maps.Map(document.getElementById('map'), sfMapOpt);
  var sfMarker= addMarker(sfMapOpt.center,'San Francisco','');
  sfMarker.setMap(map);
  markers.push(sfMarker);

  //getEarthQuakes();

  $('#info').parent().prepend(`
  <form id='getData'>
    <h2> Get previous earthquake data </h2>
    <button id='btn-week' type='submit'>Past Week</button>
    <button id='btn-month' type='submit'>Past Month</button>
  </form>  
  `);

  $('#info h1').css('display','none');

  $('.row').on('click','div form button',function(e) {
    e.preventDefault();
    var option= $(this).attr('id').replace('btn-','');
    map.setCenter(sfMapOpt.center);
    map.setZoom(sfMapOpt.zoom);
    getEarthQuakes(option);
  });

  $('#info').on('click','p',function(){
    $(this).parent().find('.selected').removeClass('selected');
    $(this).addClass('selected');
    map.setCenter(markers[$(this).index()].position);
    map.setZoom(5);
  });

  $('.row').on('click','div form h2',function(e) {
    map.setCenter(markers[0].position);
    map.setZoom(sfMapOpt.zoom);
  });
  

});

