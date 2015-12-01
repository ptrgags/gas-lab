var Clickable = function(x, y, image) { //, width, height, color) {
	this.x = x;
	this.y = y;
	this.image = image;
	this.width = this.image.width;
	this.height = this.image.height;
	this.disabled = false;
	this.disabledColor = "AAAAAA";
	
	//Action to be performed on click
	this.onClick = function() {};
	
	//Tests if the mouse is within the area
	this.mouseTest = function(x, y) {
		return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
	}
	
	//Render the clickable object on the canvas
	this.render = function(context) {
		if (!this.disabled)
			context.drawImage(this.image, this.x, this.y);
		else {
			var oldStyle = context.fillStyle;
			context.fillStyle = this.disabledColor;
			context.fillRect(this.x, this.y, this.width, this.height);
			context.fillStyle = oldStyle;
		}
	}
}