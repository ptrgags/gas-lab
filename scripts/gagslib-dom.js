var gagslib = gagslib || {};
gagslib.dom = {};

//Get element by id
gagslib.dom.getById = function(id) {
	return document.getElementById(id);
}

//Get elements by class name
gagslib.dom.getByClass = function(className) {
	return document.getElementsByClassName(className);
}

//Open link in a new window
gagslib.dom.popup = function(url, title, width, height) {
	window.open(url, title, "width=" + width + ", height=" + height);
}