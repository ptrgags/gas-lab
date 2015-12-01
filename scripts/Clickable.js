var Clickable = function(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
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
		var oldStyle = context.fillStyle;
		context.fillStyle = this.disabled ? this.disabledColor : this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle = oldStyle;
	}
}