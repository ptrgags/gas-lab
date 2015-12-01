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
var WEIGHT_X2 = 128;
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
var controls = {};

//Load the gas lab
function load() {
	getById("loading").innerHTML = "";
	createClickables();
	createWeights();
	render();
	canvas.addEventListener("click", click);
}

//Create clickables on the screen
function createClickables() {
	var temperatureUp = new Clickable(32, 304, images["redButton"]);
		temperatureUp.onClick = function() {
			increaseTemperature();
			updateControls();
			render();
		}
		clickables.push(temperatureUp);
	var temperatureDown = new Clickable(32, 368, images["blueButton"]);
		temperatureDown.onClick = function() {
			decreaseTemperature();
			updateControls();
			render();
		}
		clickables.push(temperatureDown);
	var gasRelease = new Clickable(160, 0, images["greenButton"]);
		gasRelease.disabled = true;
		gasRelease.onClick = function() {
			decreaseGas();
			updateControls();
			render();
		}
		clickables.push(gasRelease);
	var gasTank = new Clickable(352, 0, images["gasTank"]);
		gasTank.onClick = function() {
			increaseGas();
			updateControls();
			render();
		}
		clickables.push(gasTank);
	var resetButton = new Clickable(0, 0, images["greenButtonOff"]);
		resetButton.onClick = function() {
			reset();
			render();
		} 
		clickables.push(resetButton);
	controls = {
		temperatureUp : temperatureUp,
		temperatureDown : temperatureDown,
		gasRelease : gasRelease,
		gasTank : gasTank,
		resetButton : resetButton
	};
}

//Create weights on the screen
function createWeights() {
	var weight1 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 48, images["weight"]);
		weight1.position = 0;
		weight1.onClick = function() {
			switchStack(weight1.position);
			render();
		}
		weightStack.push(weight1);
		clickables.push(weight1);
	var weight2 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 96, images["weight"]);
		weight2.position = 0;
		weight2.onClick = function() {
			switchStack(weight2.position);
			render();
		}
		weightStack.push(weight2);
		clickables.push(weight2);
	var weight3 = new Clickable(WEIGHT_X1, WEIGHT_Y1 - 144, images["weight"]);
		weight3.position = 0;
		weight3.onClick = function() {
			switchStack(weight3.position);
			render();
		}
		weightStack.push(weight3);
		clickables.push(weight3);
}

//Render objects on the screen
function render() {
	var canvas = getById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(images["canisterBack"], 96, 0);
	for (var i = 0; i < clickables.length; i++)
		clickables[i].render(context);
	context.drawImage(images["canisterFront"], 96, 0);
	displayVariables(context, 480, 100);
}

//Display variables on the screen
function displayVariables(context, x, y) {
	context.fillRect(x - 4, y - 10 - 4, 100, 50);
	context.fillStyle = "#FFFFFF";
		context.fillText("P = " + pressure.toPrecision(3) + " atm", x, y);
		context.fillText("V = " + volume.toPrecision(3) + " L", x, y + 10);
		context.fillText("n = " + molecules.toPrecision(3) + " mol", x, y + 10 * 2);
		context.fillText("T = " + temperature.toPrecision(3) + " K", x, y + 10 * 3);
	context.fillStyle = "#000000";
}

//Increase the temperature one notch
function increaseTemperature() {
	temperatureSteps++;
	changeTemperature(TEMPERATURE_INCREMENT);
}

//Decrease the temperature one notch
function decreaseTemperature() {
	temperatureSteps--;
	changeTemperature(-TEMPERATURE_INCREMENT);
}

//Increase the amount of gas
function increaseGas() {
	gasSteps++;
	changeGasAmount(GAS_INCREMENT);
}

//Decrease the amount of gas
function decreaseGas() {
	gasSteps--;
	changeGasAmount(-GAS_INCREMENT);
}

//Add a weight to the plunger
function addWeight() {
	weights++;
	changePressure(PRESSURE_INCREMENT);
}

//Remove a weight from the plunger
function removeWeight() {
	weights--;
	changePressure(-PRESSURE_INCREMENT);
}

//Change the temperature
function changeTemperature(change) {
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
function changeGasAmount(change) {
	var n1 = molecules;
	var n2 = molecules + change;
	var v1 = volume;
	var v2 = v1 * n2 / n1;
	var p1 = pressure;
	var p2 = pressure;
	
	if (v2 >= VOLUME_MAX) {
		v2 = VOLUME_MAX;
		p2 = molecules * GAS_CONSTANT * temperature / v2;
	}
	
	molecules = n2;
	volume = v2;
	pressure = p2;
}

//Change the pressure
function changePressure(change) {
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
function reset() {
	updateControls();
	resetWeights();
	
	pressure = 1.50;
	volume = 1.50;
	molecules = .100;
	temperature = 273;
	
	temperatureSteps = 7;
	weights = 0;
	gasSteps = 0;
}

//update controls
function updateControls() {
	controls.temperatureUp.disabled = temperatureSteps === MAX_TEMPERATURE_STEPS;
	controls.temperatureDown.disabled = temperatureSteps === 0;
	controls.gasTank.disabled = gasSteps === MAX_GAS_STEPS;
	controls.gasRelease.disabled = gasSteps === 0;
}

//Reset weight positions
function resetWeights() {
	while (chamberWeightStack.length > 0)
		switchStack(1);
}

//Switch weights from stack to stack
function switchStack(position) {
	if (position === 0) {
		var length = chamberWeightStack.length;
		var weight = weightStack.pop();
			weight.x = WEIGHT_X2;
			weight.y = WEIGHT_Y2 - 48 * (length + 1);
			weight.position = 1;
		chamberWeightStack.push(weight);
		addWeight();
	}
	else {
		var length = weightStack.length;
		var weight = chamberWeightStack.pop();
			weight.x = WEIGHT_X1;
			weight.y = WEIGHT_Y1 - 48 * (length + 1);
			weight.position = 0;
		weightStack.push(weight);
		removeWeight();
	}
}