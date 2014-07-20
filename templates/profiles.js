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

	var tableID = '1uKyspg-HkChMIntZ0N376lMpRzduIjr85UYPpQ';

	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'kml_4326',
			from: tableID,
				// where: "name = '"+countryName+"'"
			},
			styles: [{
				polygonOptions: {
					fillColor: "#FFFFFF",
					fillOpacity: 0
				}
			}]
		});
	layer.setMap(map);

		// var infobox = new InfoBox({
		// 	content: document.getElementById("infobox"),
		// 	disableAutoPan: false,
		// 	maxWidth: 0,
		// 	pixelOffset: new google.maps.Size(-140, 0),
		// 	boxStyle: {
		// 		background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
		// 		opacity: 0.75,
		// 		width: "280px"
		// 	},
		// 	closeBoxMargin: "12px 4px 2px 2px",
		// 	closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		// 	infoBoxClearance: new google.maps.Size(1, 1)
		// });

var infowindow;
var visited = new Array();
var lived = new Array();

google.maps.event.addListener(layer,'click',function(e) {
	if (typeof infowindow !== 'undefined') {
		infowindow.close();
	}
	var color = '#003399'
	infowindow = new google.maps.InfoWindow();
	var countryName = e.row['name'].value;
			// var contentString = document.getElementById("infowindow");
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

			// var geocoder = new google.maps.Geocoder();
		 //    geocoder.geocode( { 'address': countryName}, function(results, status) {
		 //    	var swlat = results[0].geometry.viewport.getSouthWest().lat();
		 //    	var swlng = results[0].geometry.viewport.getSouthWest().lng();
		 //    	var nelat = results[0].geometry.viewport.getNorthEast().lat();
		 //    	var nelng = results[0].geometry.viewport.getNorthEast().lng();
		 //      if (status == google.maps.GeocoderStatus.OK) {
		 //        map.setCenter(results[0].geometry.location);
		 //        map.fitBounds(results[0].geometry.viewport);
		 //      }
		 //    });

infowindow.setContent(contentString);
infowindow.setPosition(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
map.setCenter(infowindow.getPosition());
if (map.getZoom() < 4) {
	map.setZoom(4);
}
infowindow.open(map);
			// var country = new google.maps.FusionTablesLayer({
			// 	query: {
			// 		select: 'kml_4326',
			// 		from: tableID,
			// 		where: "name = '"+countryName+"'"
			// 	},
			// 	styles: [{
			// 		polygonOptions: {
			// 			fillColor: color,
			// 			fillOpacity: 0.5
			// 		}
			// 	}]
			// });
			// country.setMap(map);
			layer.set("styles", [{
				polygonOptions: {
					fillColor: '#FFFFFF',
					fillOpacity: 0
				}
			},	{
				where: "name = '"+countryName+"'",
				polygonOptions: {
					fillColor: color, 
					fillOpacity: 0.5, 
				}
			}
			]);
			google.maps.event.addDomListener(document.getElementById('been'), 'click', function() {
				color = this.value;
				if (visited.indexOf(countryName) === -1) {
					visited.push(countryName);
				}
				layer.set("styles", [{
					polygonOptions: {
						fillColor: '#FFFFFF',
						fillOpacity: 0
					}
				},	{
					where: "name = '"+countryName+"'", 
					polygonOptions: {
						fillColor: color, 
						fillOpacity: 0.5, 
					}
				}
				]);
			});
			google.maps.event.addDomListener(document.getElementById('live'), 'click', function() {
				color = this.value;
				if (lived.indexOf(countryName) === -1) {
					lived.push(countryName);
				}
				layer.set("styles", [{
					polygonOptions: {
						fillColor: '#FFFFFF',
						fillOpacity: 0
					}
				},	{
					where: "name = '"+countryName+"'", 
					polygonOptions: {
						fillColor: color, 
						fillOpacity: 0.5, 
					}
				}
				]);
			});
			google.maps.event.addDomListener(document.getElementById('cancel'), 'click', function() {
				color = this.value;
				layer.set("styles", [{
					polygonOptions: {
						fillColor: '#FFFFFF',
						fillOpacity: 0
					}
				},	{
					where: "name = '"+countryName+"'", 
					polygonOptions: {
						fillColor: color, 
						fillOpacity: 0.5, 
					}
				}
				]);
			});
		});
}
google.maps.event.addDomListener(window, 'load', initialize);