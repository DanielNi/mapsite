// $(document).ready(function() {
// 	var map = kartograph.map('#map');
// 	map.loadMap('/static/world.svg', function() {
// 		map.addLayer('layer_0');
// 	});
// });


function initialize() {
	var styles = [
	{
		featureType: "administrative.country",
		stylers: [
		{ visibility: "on" }
		]
	},{
		featureType: "administrative.province",
		stylers: [
		{ visibility: "on" }
		]
	},{
		featureType: "landscape",
		stylers: [
		{ visibility: "off" }
		]
	},{
		featureType: "poi",
		stylers: [
		{ visibility: "off" }
		]
	},{
		featureType: "road",
		stylers: [
		{ visibility: "off" }
		]
	}
	]
	var mapOptions = {
		zoom: 2,
		center: new google.maps.LatLng(25, 0),
		mapTypeControl: false,
		streetViewControl: false,
		minZoom: 2,
		maxZoom: 6,
		panControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		styles: styles
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);


	// DATA LAYERS STUFF
	// ========================================================================
	//
	//
	//

	map.data.loadGeoJson("/static/countries-hires.json");

	var locations = $("#map-canvas").data("locations");
	var visits = $("#map-canvas").data("visits");
	var infowindow;
	var been = new Array();
	var lived = new Array();
	for (var i = 0; i < visits.length; i++) {
		if (visits[i]['fields']['lived']) {
			been.push(locations[i]['fields']['name']);

		} else {
			lived.push(locations[i]['fields']['name']);
		}
	}

	console.log(been);
	console.log(lived);
	// need to figure out a way to get the appropriate feature and set their properties when i only have the names of the countries...
	// seems like the only way to get a feature is getFeatureById

	map.data.setStyle(function(feature) {
		var color = 'white';
		var opacity = 0;
		if (feature.getProperty('been')) {
			color = '#003399';
			opacity = 0.5;
		} else if (feature.getProperty('lived')) {
			color = '#008C00';
			opacity = 0.5;
		}
		return ({
			fillColor: color,
			fillOpacity: opacity,
			strokeWeight: 1
		});
	});

	map.data.addListener('click', function(event) {
		var countryName = event.feature.getProperty('NAME');
		if (!event.feature.getProperty('been') && !event.feature.getProperty('lived')) {
			event.feature.setProperty('been', true);
			been.push(countryName);
		}
		if (typeof infowindow !== 'undefined') {
			infowindow.close();
		}
		var contentString =
			'<div id="content">'+
			'<h3 class="firstHeading">'+countryName+'</h3>'+
			'<div id="bodyContent">'+
			"<label class='choice' for='live'>"+
			"<input id='live' type='radio' name='choice' value='#008C00' />"+
			"<a class='Live'>◼ I've lived here.</a>"+
			"</label><br>"+
			"<label class='choice' for='been'>"+
			"<input id='been' type='radio' name='choice' value='#003399' />"+
			"<a class='Been'>◼ I've been here.</a>"+
			"</label><br>"+
			"<label class='choice' for='cancel'>"+
			"<input id='cancel' type='radio' name='choice' value='#FFFFFF' />"+
			"<a class='Cancel'>◻ Cancel</a>"+
			"</label>"+
			'</div>'+
			"</div>";
		infowindow = new google.maps.InfoWindow({
			content: contentString,
			position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
		});
		map.panTo(infowindow.getPosition());
		if (map.getZoom() < 4) {
			map.setZoom(4);
		}
		infowindow.open(map);

		google.maps.event.addListener(infowindow, 'domready', function() {
			document.getElementById('been').addEventListener('click', function(e) {
				var indlive = lived.indexOf(countryName);
				if (indlive > -1) {
					lived.splice(indlive, 1);
				}
				if (been.indexOf(countryName) === -1) {
					been.push(countryName);
				}
				event.feature.setProperty('lived', false);
				event.feature.setProperty('been', true);
				console.log("been: " + been);
				console.log("lived: " + lived);
			});
			document.getElementById('live').addEventListener('click', function(e) {
				var indbeen = been.indexOf(countryName);
				if (indbeen > -1) {
					been.splice(indbeen, 1);
				}
				if (lived.indexOf(countryName) === -1) {
					lived.push(countryName);
				}
				event.feature.setProperty('been', false);
				event.feature.setProperty('lived', true);
				console.log("been: " + been);
				console.log("lived: " + lived);
			});
			document.getElementById('cancel').addEventListener('click', function(e) {
				var indlive = lived.indexOf(countryName);
				var indbeen = been.indexOf(countryName);
				if (indlive > -1) {
					lived.splice(indlive, 1);
				}
				if (indbeen > -1) {
					been.splice(indbeen, 1);
				}
				event.feature.setProperty('been', false);
				event.feature.setProperty('lived', false);
				console.log("been: " + been);
				console.log("lived: " + lived);
			});
		});
	});

	map.data.addListener('mouseover', function(event) {
		map.data.revertStyle();
		map.data.overrideStyle(event.feature, {strokeWeight: 2.5});
	});

	map.data.addListener('mouseout', function(event) {
		map.data.revertStyle();
	});

	var input = document.getElementById('search');
	var options = {
		types: ['(regions)']
	};
	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(input);
	// var searchBox = new google.maps.places.SearchBox(
	// 	/** @type {HTMLInputElement} */(input));
}
	
google.maps.event.addDomListener(window, 'load', initialize);