//Get an element by ID
var getById = function(id) {
	return document.getElementById(id);
}

//Get elements by class name
var getByClass = function(className) {
	return document.getElementsByClassName(className);
}

//Click event
var click = function(evt) {
	var canvas = document.getElementById("canvas");
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	
	for (var i = 0; i < clickables.length; i++) {
		if (clickables[i].mouseTest(x, y) && !clickables[i].disabled)
			clickables[i].onClick();
	}
}