var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

function radiusSize(mag){
    return mag*3
};

function chooseColor(mag){
    if (mag>5.5){
        return"#B5051D"
    }
    else if (mag>5.0){
        return"#ED6811"
    }
    else if (mag>4.5){
        return "#F8970A"
    }
    else if (mag>4.0){
        return "#F8E20A"
    }
    else if (mag>3.5){
        return "#EAF904"
    }
    else if (mag>3.0){
        return"#6104F9"
    }
    else if (mag>2.5){
        return"#049CF9"
    }
    else if (mag>2.0){
        return"#04F2F9"
    }
    else if (mag>1.5){
        return"#38F904"
    }
    else{
        return"#04F961"
    }
}


d3.json(queryUrl, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature,layer){
        layer.bindPopup(`<h4> ${feature.properties.title} <hr> ${new Date(feature.properties.time)}`);
    }
    var earthquakes=L.geoJSON(earthquakeData, {
        pointToLayer:function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: radiusSize(feature.properties.mag),
                color:"black",
                weight:0.4,
                fillOpacity:0.8,
                fillColor: chooseColor(feature.properties.mag)
            })
        },
        onEachFeature:onEachFeature
    });
    createMap(earthquakes);
}

var tectPlates= L.layerGroup();
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json", function(data){
    L.geoJSON(data,{
        color:"#FF69B4",
        fillOpacity:0.1,
        weight:2
        }
       
    ).addTo(tectPlates)
    
})

function createMap(earthquakes){
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});


var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});
var baseMaps={
    "Satellite": satellite,
    "Light": light,
    "Outdoor":outdoors
};

var overlayMaps={
    "Earthquakes":earthquakes,
    "Tectonic Plates": tectPlates
};

var myMap = L.map("map", {
    center: [
      33.09, -75.71
    ],
    zoom: 3,
    layers: [satellite, earthquakes]
  });
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap)
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var mags = [1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0];
    var labels = [];

    // Add min & max
    var legendInfo = "<h2>Earthquake Magnitude</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + mags[0] + "</div>" +
        "<div class=\"middle\">" + mags[5] + "</div>"+
        "<div class=\"max\">" + mags[mags.length - 1]+"+" + "</div>" +
      "</div>";


    div.innerHTML = legendInfo;

    mags.forEach(function(mag, index) {
      labels.push("<li style=\"background-color: " + chooseColor(mags[index]) + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;

  };

  legend.addTo(myMap);

};

 



