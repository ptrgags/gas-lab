var images = {};

function loadImage(id, onload) {
	var image = new Image();
		image.src = "images/" + id + ".png";
		image.onload = onload;
	images[id] = image;
	
}