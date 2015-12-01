//Click event
function click(evt) {
	var canvas = document.getElementById("canvas");
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	var clickables = gaslab.clickables;

	for (var i = 0; i < clickables.length; i++) {
		if (clickables[i].mouseTest(x, y) && !clickables[i].disabled)
			clickables[i].onClick();
	}
	gaslab.render();
}

function mousePress(evt) {
    var canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var buttons = gaslab.buttons;

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].mouseTest(x, y) && !buttons[i].disabled)
            buttons[i].onMousePress();
    }
    gaslab.render();
}

function mouseRelease(evt) {
    var canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var buttons = gaslab.buttons;

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].mouseTest(x, y) && !buttons[i].disabled)
            buttons[i].onMouseRelease();
    }
    gaslab.render();
}

function mouseMove(evt) {
    var canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var buttons = gaslab.buttons;

    for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i].disabled) {
            if (buttons[i].mouseTest(x, y) && !buttons[i].mouseEntered)
                buttons[i].onMouseEnter();
            else if (!buttons[i].mouseTest(x, y) && buttons[i].mouseEntered)
                buttons[i].onMouseExit();
        }
    }
    gaslab.render();
}

//enter -> prgm.onMouseEnter
//exit -> prgm.onMouseExit
//pressed -> prgm.onMousePress -> test mouse press -> onMousePress
//released -> prgm.onMouseRelease -> test mouse release -> onMouseRelease
//dragged -> prgm.onMouseMove -> test mouse motion -> mouseEnter, mouseExit, mouseMove
//moved -> prgm.onMouseMove -> see 