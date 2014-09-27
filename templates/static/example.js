var choices =
	'<div class="locationName"></div>'+
	'<div id="choiceContent">'+
	"<label class='choice' for='live'>"+
	"<input id='live' type='radio' name='choice' />"+
	"<a class='Live'>◼ I've lived here.</a>"+
	"</label><br>"+
	"<label class='choice' for='been'>"+
	"<input id='been' type='radio' name='choice' />"+
	"<a class='Been'>◼ I've been here.</a>"+
	"</label><br>"+
	"<label class='choice' for='cancel'>"+
	"<input id='cancel' type='radio' name='choice' />"+
	"<a class='Cancel'>◻ Cancel</a>"+
	"</label>"+
	'</div>';

function set_date(date_visited) {
	var datepicker =
		'<div id="question">When were you here?</div>'+
		'<form id="date_form">'+
		'<input type="date" id="date"';
	if (date_visited) {
		datepicker += 'value=' + date_visited;
	}
	datepicker += '>'+
		'</input>'+
		'<input type="submit" value="Save">'+
		'</form>';
	$('#datepicker').html(datepicker);
}

function calculate_rank(score) {
	if (score < 5) {
		return 'SIGHTSEER';
	} else if (score < 10) {
		return 'EXPLORER';
	} else if (score < 15) {
		return 'ADVENTURER';
	} else if (score < 25) {
		return 'JOURNEYER';
	} else if (score < 50) {
		return 'VOYAGER';
	} else {
		return 'GLOBETROTTER';
	}
}

function update_infobox(update_type, location, date_visited) {
	if (update_type === 'cancel') {
		$('#message').show();
		$('#choices').hide();
		$('#datepicker').hide();
	} else {
		$('#message').hide();
		$('#choices').css("display", "table-cell").html(choices);
		$('#datepicker').css("display", "table-cell");
		// set_date(date_visited);
		$('.locationName').html(location);
	}
}

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
	},{
		featureType: "administrative",
		elementType: "geometry.fill",
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

	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
		document.getElementById('infobox'));


	// DATA LAYERS STUFF
	// ========================================================================
	//
	//

	map.data.loadGeoJson("/static/countries-hires.json", {idPropertyName: 'NAME'});
	map.data.loadGeoJson("/static/states.json", {idPropertyName: 'name'});

	// var locations = ['Texas'];
	var visits = [['Texas', false], ['China', true], ['New York', true], ['Ontario', false],
				  ['Egypt', false], ['France', false], ['Norway', false], ['Argentina', false],
				  ['South Africa', true], ['Illinois', true], ['India', false], ['Indonesia', false],
				  ['United Arab Emirates', false], ['Germany', true], ['Mexico', false], ['New Zealand', false],
				  ['Washington', false], ['Venezuela', false], ['Pennsylvania', false], ['Florida', false]];
	console.log('hi');
	console.log(visits);


	map.data.addListener('addfeature', function(event) {
		if (event.feature.getId() === "Zimbabwe") { // only prepopulate after every country has been added
			for (var i = 0; i < visits.length; i++) {
				var name = visits[i][0];
				console.log(name);
				var feature = map.data.getFeatureById(name);
				if (visits[i][1]) {
					feature.setProperty('lived', true);
				} else {
					feature.setProperty('been', true);
					// feature.setProperty('date_visited', visits[i]['fields']['date_visited']);
				}
			}
			update_infobox('cancel', '', false);
		}
	});

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
		var pos = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
		var countryName = event.feature.getId();
		if (!event.feature.getProperty('been') && !event.feature.getProperty('lived')) {
			update_infobox('new', countryName, false);
		} else {
			update_infobox('none', countryName, event.feature.getProperty('date_visited'));
		}

		map.panTo(pos);
		if (map.getZoom() < 4) {
			map.setZoom(4);
		}
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
	
	var autocomplete = new google.maps.places.Autocomplete(input, options);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	    var place = autocomplete.getPlace();

	    if (!place.geometry) {
	    	return;
	    }
	    if (place.geometry.viewport) {
	    	map.fitBounds(place.geometry.viewport);
	    } else {
	    	map.panTo(place.geometry.location);
	    	if (map.getZoom() < 4)
		    	map.setZoom(4);
		}
	});
	google.maps.event.addListenerOnce(map, 'idle', function(){
    	$('.spinner').hide();
	});
}

google.maps.event.addDomListener(window, 'load', initialize);