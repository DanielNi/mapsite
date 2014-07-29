$(document).ready(function() {
	var map = kartograph.map('#map');
	map.loadMap('/static/world.svg', function() {
		map.addLayer('layer_0');
	});
});