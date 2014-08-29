var csrftoken = $.cookie('csrftoken');
var choices =
	'<div id="choices">'+
	'<div class="locationName"></div>'+
	'<div id="choiceContent">'+
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

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function calculate_score(locations) {
	return 100;
}

function update_infobox(update_type, location, date_visited) {
	if (update_type === 'cancel') {
		$('.left_side').html('');
		$('.info_title').html("Click on somewhere you've been!");
		$('.right_side').html('');
	} else {
		$('.left_side').html(choices);
		$('.info_title').html('');
		$('.locationName').html(location);
		$('#percentage').html("You've seen 16% of the world. date: " + date_visited);
		$('#badge').html('Rank: EXPLORER')
	}
};

function update(update_type, location, lived, date_visited) {
	$.ajax({
		url			: '/users/',
		type 		: 'POST',
		dataType	: 'JSON',
		data 		: {
			'location' 	  : location,
			'lived'    	  : lived,
			'update_type' : update_type
			'date_visited': date_visited
		},
		success 	: function(response) {
			// change the thing in the bottom
			console.log('success:');
			console.log(response);
			update_infobox(update_type, location, date_visited);
		},
		error 		: function(response) {
			console.log('error:');
			console.log(response);
		}
	});
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
	//

	map.data.loadGeoJson("/static/countries-hires.json", {idPropertyName: 'NAME'});
	map.data.loadGeoJson("/static/states.json", {idPropertyName: 'name'});

	var locations = $("#map-canvas").data("locations");
	var visits = $("#map-canvas").data("visits");
	// var infobox = $('#infobox');
	// var infowindow;
	var been = new Array();
	var lived = new Array();

	map.data.addListener('addfeature', function(event) {
		if (event.feature.getId() === "Zimbabwe") { // only prepopulate after every country has been added
			for (var i = 0; i < visits.length; i++) {
				var name = locations[i]['fields']['name'];
				var feature = map.data.getFeatureById(name);
				if (visits[i]['fields']['lived']) {
					lived.push(name);
					feature.setProperty('lived', true);
				} else {
					been.push(name);
					feature.setProperty('been', true);
					feature.setProperty('date_visited', visits[i]['fields']['date_visited']);
				}
			}
			// also get rid of loading animation here
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
			event.feature.setProperty('been', true);
			been.push(countryName);
			update('new', countryName, false, event.feature.getProperty('date_visited'));
		} else {
			update_infobox(countryName);
		}
		// var infobox = $('#infobox');
		// if (typeof infowindow !== 'undefined') {
		// 	infowindow.close();
		// }
		// var contentString =
		// 	'<div id="content">'+
		// 	'<h3 class="locationName">'+countryName+'</h3>'+
		// 	'<div id="bodyContent">'+
		// 	"<label class='choice' for='live'>"+
		// 	"<input id='live' type='radio' name='choice' value='#008C00' />"+
		// 	"<a class='Live'>◼ I've lived here.</a>"+
		// 	"</label><br>"+
		// 	"<label class='choice' for='been'>"+
		// 	"<input id='been' type='radio' name='choice' value='#003399' />"+
		// 	"<a class='Been'>◼ I've been here.</a>"+
		// 	"</label><br>"+
		// 	"<label class='choice' for='cancel'>"+
		// 	"<input id='cancel' type='radio' name='choice' value='#FFFFFF' />"+
		// 	"<a class='Cancel'>◻ Cancel</a>"+
		// 	"</label>"+
		// 	'</div>'+
		// 	"</div>";
		// infowindow = new google.maps.InfoWindow({
		// 	content: contentString,
		// 	position: pos
		// });
		map.panTo(pos);
		if (map.getZoom() < 4) {
			map.setZoom(4);
		}
		// console.log(infobox);
		// infobox.html(contentString);
		// infowindow.open(map);

		$(document).on('click', '#been', function(e) {
			var indlive = lived.indexOf(countryName);
			if (indlive > -1) {
				lived.splice(indlive, 1);
				event.feature.setProperty('lived', false);
			}
			if (been.indexOf(countryName) === -1) {
				been.push(countryName);
				event.feature.setProperty('been', true);
				update('change', countryName, false, 'none');
			}
			console.log('lived: ' + lived);
			console.log('been: ' + been);
		});
		$(document).on('click', '#live', function(e) {
			var indbeen = been.indexOf(countryName);
			if (indbeen > -1) {
				been.splice(indbeen, 1);
				event.feature.setProperty('been', false);
			}
			if (lived.indexOf(countryName) === -1) {
				lived.push(countryName);
				event.feature.setProperty('lived', true);
				update('change', countryName, true, 'none');
			}
			console.log('lived: ' + lived);
			console.log('been: ' + been);
		});
		$(document).on('click', '#cancel', function(e) {
			var indlive = lived.indexOf(countryName);
			var indbeen = been.indexOf(countryName);
			if (indlive > -1) {
				lived.splice(indlive, 1);
				event.feature.setProperty('lived', false);
			}
			if (indbeen > -1) {
				been.splice(indbeen, 1);
				event.feature.setProperty('been', false);
			}
			update('cancel', countryName, false, 'none');
			console.log('lived: ' + lived);
			console.log('been: ' + been);
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
	// var searchBox = new google.maps.places.SearchBox(
	// 	/** @type {HTMLInputElement} */(input));
	
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

// $(window).on('load', function() {
// 	$('.spinner').hide();
// });
google.maps.event.addDomListener(window, 'load', initialize);