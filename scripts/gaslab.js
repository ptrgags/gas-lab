//Constants
var GAS_CONSTANT = .08206;
var TEMPERATURE_INCREMENT = 10.0;
var PRESSURE_INCREMENT = 0.500;
var GAS_INCREMENT = 0.0100;
var MAX_TEMPERATURE_STEPS = 20;
var MAX_WEIGHTS = 2;
var MAX_GAS_STEPS = 50;
var VOLUME_MAX = 5.00;
var VOLUME_MIN = 1.00;
var WEIGHT_X1 = 500;
var WEIGHT_X2 = 144;
var WEIGHT_Y1 = 480;
var WEIGHT_Y2 = 288;

//Variables
var pressure = 1.50;
var volume = 1.50;
var molecules = .100;
var temperature = 273;

var temperatureSteps = 7;
var weights = 0;
var gasSteps = 0;

var clickables = [];

var weightStack = [];
var chamberWeightStack = [];

var load = function() {

	var temperatureUp = new Clickable(32, 64, 32, 32, "#FF0000");
		temperatureUp.onClick = function() {
			increaseTemperature();
			temperatureUp.disabled = temperatureSteps === MAX_TEMPERATURE_STEPS;
			temperatureDown.disabled = temperatureSteps === 0;
			render();
		}
	var temperatureDown = new Clickable(32, 128, 32, 32, "#0000FF");
		temperatureDown.onClick = function() {
			decreaseTemperature();
			temperatureUp.disabled = temperatureSteps === MAX_TEMPERATURE_STEPS;
			temperatureDown.disabled = temperatureSteps === 0;
			render();
		}
	var gasRelease = new Clickable(80, 32, 16, 16, "#00FF00");
		gasRelease.disabled = true;
		gasRelease.onClick = function() {
			decreaseGas();
			gasTank.disabled = gasSteps === MAX_GAS_STEPS;
			gasRelease.disabled = gasSteps === 0;
			render();
		}
	var gasTank = new Clickable(320, 128, 64, 256, "#00FFFF");
		gasTank.onClick = function() {
			increaseGas();
			gasTank.disabled = gasSteps === MAX_GAS_STEPS;
			gasRelease.disabled = gasSteps === 0;
			render();
		}
	var resetButton = new Clickable(0, 0, 64, 32, "#FFFFFF");
		resetButton.onClick = function() {
			reset();
			render();
		}
	var weight1 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 48, 96, 48, "#999999");
		weight1.position = 0;
		weight1.onClick = function() {
			switchStack(weight1.position);
			render();
		}
	var weight2 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 97, 96, 48, "#999999");
		weight2.position = 0;
		weight2.onClick = function() {
			switchStack(weight2.position);
			render();
		}
	var weight3 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 146, 96, 48, "#999999");
		weight3.position = 0;
		weight3.onClick = function() {
			switchStack(weight3.position);
			render();
		}
	
	weightStack.push(weight1);
	weightStack.push(weight2);
	weightStack.push(weight3);
	
	canvas.addEventListener("click", click);
	
	clickables = [temperatureUp, temperatureDown, gasRelease, gasTank, resetButton, weight1, weight2, weight3];
	render();
}

//Render objects onto the screen
var render = function() {
	var canvas = getById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(128, 128, 128, 256);
	for (var i = 0; i < clickables.length; i++)
		clickables[i].render(context);
	context.fillText("P = " + pressure.toPrecision(3) + " atm", 400, 100);
	context.fillText("V = " + volume.toPrecision(3) + " L", 400, 110);
	context.fillText("n = " + molecules.toPrecision(3) + " mol", 400, 120);
	context.fillText("T = " + temperature.toPrecision(3) + " K", 400, 130);
}

//Increase the temperature one notch
var increaseTemperature = function() {
	temperatureSteps++;
	changeTemperature(TEMPERATURE_INCREMENT);
}

//Decrease the temperature one notch
var decreaseTemperature = function() {
	temperatureSteps--;
	changeTemperature(-TEMPERATURE_INCREMENT);
}

//Increase the amount of gas
var increaseGas = function() {
	gasSteps++;
	changeGasAmount(GAS_INCREMENT);
}

//Decrease the amount of gas
var decreaseGas = function() {
	gasSteps--;
	changeGasAmount(-GAS_INCREMENT);
}

//Add a weight to the plunger
var addWeight = function() {
	weights++;
	changePressure(PRESSURE_INCREMENT);
}

//Remove a weight from the plunger
var removeWeight = function() {
	weights--;
	changePressure(-PRESSURE_INCREMENT);
}

//Change the temperature
var changeTemperature = function(change) {
	var t1 = temperature;
	var t2 = temperature + change;
	var v1 = volume;
	var v2 = v1 * t2 / t1;
	var p1 = pressure;
	var p2 = pressure;
	
	if (v2 >= VOLUME_MAX) {
		v2 = VOLUME_MAX;
		p2 = molecules * GAS_CONSTANT * temperature / v2;
	}
	
	temperature = t2;
	volume = v2;
	pressure = p2;
}

//Change the number of moles of gas
var changeGasAmount = function(change) {
	var n1 = molecules;
	var n2 = molecules + change;
	var v1 = volume;
	var v2 = v1 * n2 / n1;
	var p1 = pressure;
	var p2 = pressure;
	
	if (v2 >= VOLUME_MAX) {
		v2 = VOLUME_MAX;
		p2 = molecules * GAS_CONSTANT * temperature / v2;
		//p2 = p1 * v1 / v2;
	}
	
	molecules = n2;
	volume = v2;
	pressure = p2;
}

//Change the pressure
var changePressure = function(change) {
	var p1 = pressure;
	var p2 = pressure + change;
	var v1 = volume;
	var v2 = p1 * v1 / p2;
	
	if (v2 <= VOLUME_MIN) {
		v2 = VOLUME_MIN;
		p2 = molecules * GAS_CONSTANT * temperature / v2;
	}
	
	pressure = p2;
	volume = v2;
}

//Reset the screen
var reset = function() {
	pressure = 1.50;
	volume = 1.50;
	molecules = .100;
	temperature = 273;
	
	temperatureSteps = 7;
	weights = 0;
	gasSteps = 0;
	load();
}

var switchStack = function(position) {
	if (position === 0) {
		var length = chamberWeightStack.length;
		var weight = weightStack.pop();
			weight.x = WEIGHT_X2;
			weight.y = WEIGHT_Y2 - 48 * (length + 1) - length;
			weight.position = 1;
		chamberWeightStack.push(weight);
		addWeight();
	}
	else {
		var length = weightStack.length;
		var weight = chamberWeightStack.pop();
			weight.x = WEIGHT_X1;
			weight.y = WEIGHT_Y1 - 48 * (length + 1) - length;
			weight.position = 0;
		weightStack.push(weight);
		removeWeight();
	}
}

/*
//Update the variables on the screen
var update = function() {
	
	var buttons = getByClass("temperatureButton");
		buttons[0].disabled = temperatureSteps === MAX_TEMPERATURE_STEPS;
		buttons[1].disabled = temperatureSteps === 0;
	buttons = getByClass("weightButton");
		buttons[0].disabled = weights === MAX_WEIGHTS;
		buttons[1].disabled = weights === 0;
	buttons = getByClass("gasButton");
		buttons[0].disabled = gasSteps === MAX_GAS_STEPS;
		buttons[1].disabled = gasSteps === 0;
}
*/