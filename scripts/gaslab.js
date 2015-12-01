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

//Variables
var pressure = 1.50;
var volume = 1.50;
var molecules = .100;
var temperature = 273;

var temperatureSteps = 7;
var weights = 0;
var gasSteps = 0;

//Update the variables on the screen
var update = function() {
	var span = Sizzle("#pressure")[0];
		span.innerHTML = pressure.toPrecision(3);
	span = Sizzle("#volume")[0];
		span.innerHTML = volume.toPrecision(3);
	span = Sizzle("#molecules")[0];
		span.innerHTML = molecules.toPrecision(3);
	span = Sizzle("#temperature")[0];
		span.innerHTML = temperature.toPrecision(3);
	span = Sizzle("#constant")[0];
		span.innerHTML = GAS_CONSTANT.toPrecision(3);
	span = Sizzle("#leftHalf")[0];
		span.innerHTML = (pressure * volume).toPrecision(3);
	span = Sizzle("#rightHalf")[0];
		span.innerHTML = (molecules * GAS_CONSTANT * temperature).toPrecision(3);
	
	var buttons = Sizzle("button#temperatureButton");
		buttons[0].disabled = temperatureSteps === MAX_TEMPERATURE_STEPS;
		buttons[1].disabled = temperatureSteps === 0;
	buttons = Sizzle("button#weightButton");
		buttons[0].disabled = weights === MAX_WEIGHTS;
		buttons[1].disabled = weights === 0;
	buttons = Sizzle("button#gasButton");
		buttons[0].disabled = gasSteps === MAX_GAS_STEPS;
		buttons[1].disabled = gasSteps === 0;
}

var reset = function() {
	pressure = 1.50;
	volume = 1.50;
	molecules = .100;
	temperature = 273;
	
	temperatureSteps = 7;
	weights = 0;
	gasSteps = 0;
	update();
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
		//p2 = p1 * v1 / v2;
	}
	
	temperature = t2;
	volume = v2;
	pressure = p2;
	update();
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
		//p2 = p1 * v1 / v2;
	}
	
	pressure = p2;
	volume = v2;
	update();
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
	update();
}