//Get an element by ID
function getById(id) {
	return document.getElementById(id);
}

//Get elements by class name
function getByClass(className) {
	return document.getElementsByClassName(className);
}

//Click event
function click(evt) {
	var canvas = document.getElementById("canvas");
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	
	for (var i = 0; i < clickables.length; i++) {
		if (clickables[i].mouseTest(x, y) && !clickables[i].disabled)
			clickables[i].onClick();
	}
}