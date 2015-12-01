var Button = function (x, y, sprSheet, enabled) {
    Clickable.call(this, x, y, sprSheet);

    //Constants
    this.FRAME_DISABLED = 1;
    this.FRAME_NORMAL = 0;
    this.FRAME_HOVER = 2;
    this.FRAME_PRESSED = 3;

    //Fields
    this.frame = this.FRAME_NORMAL;
    this.hovering = false;
    this.disabled = !enabled;
    this.pressed = false;
    this.width = sprSheet.width / 4
    this.mouseEntered = false;

    //Methods
    this.onMouseEnter = function () {
        if (!this.disabled) {
            this.hovering = true;
            this.updateFrame();
            this.mouseEntered = true;
        }
    }

    this.onMouseExit = function () {
        if (!this.disabled) {
            this.hovering = false;
            this.pressed = false;
            this.updateFrame();
            this.mouseEntered = false;
        }
    }

    this.onMousePress = function () {
        if (!this.disabled) {
            this.pressed = true;
            this.updateFrame();
        }
    }

    this.onMouseRelease = function () {
        if (!this.disabled) {
            this.pressed = false;
            this.updateFrame();
            this.onClick();
        }
    }

    this.render = function (context) {
        context.drawImage(this.image, this.width * this.frame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    this.updateFrame = function () {
        if (this.disabled)
            this.frame = this.FRAME_DISABLED;
        else if (this.pressed)
            this.frame = this.FRAME_PRESSED;
        else if (this.hovering)
            this.frame = this.FRAME_HOVER;
        else
            this.frame = this.FRAME_NORMAL;
    }

    //Initialization code
    this.updateFrame();
}
Button.prototype = new Clickable(0, 0, new Image());