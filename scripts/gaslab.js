//Variables/Constants
var gasLab = {
    COLOR_WHITE: "#FFFFFF",
    //Dimensions
    STAGE_HEIGHT: 480,
    STAGE_WIDTH: 640,
    //h in m
    MIN_HEIGHT: 1,
    MAX_HEIGHT: 10,
    STEP_HEIGHT: 1,
    //T in K
    MIN_TEMP: 290,
    MAX_TEMP: 400,
    STEP_TEMP: 10,
    //n in mol
    MIN_MOLS: 0.1,
    MAX_MOLS: 1.0,
    STEP_MOLS: 0.1,
    //Volume in L
    MAX_VOLUME: 10000,
    //Pressure in atm
    MAX_PRESSURE: 0.033,

    PX_PER_METER: 40, //4 px per meter
    GAS_CONSTANT: 0.08206,
    MIN_OPACITY: 0.1,
    OPACITY_GRADIENT: 0.9,
    COLOR_GRADIENT: 255,

    //Variables
    height: 10,
    volume: 10000,
    molecules: 0.1,
    temperature: 290,
    pressure: this.molecules * this.GAS_CONSTANT * this.temperature / this.volume
};

//Functions
gasLab.setHeight = function (height) {
    gasLab.height = height;
    gasLab.volume = height * 1000;
    gasLab.calcPressure();
};

gasLab.setMolecules = function (molecules) {
    var oldMolecules = gasLab.molecules;
    gasLab.molecules = molecules;
    gasLab.calcVolume(molecules > oldMolecules);
};

gasLab.setTemperature = function (temperature) {
    var oldTemp = gasLab.temperature;
    gasLab.temperature = temperature;
    gasLab.calcVolume(temperature > oldTemp);
};

gasLab.calcPressure = function () {
    gasLab.pressure = gasLab.molecules * gasLab.GAS_CONSTANT
        * gasLab.temperature / gasLab.volume;
};

gasLab.getPV = function () {
    return gasLab.pressure * gasLab.volume;
};

gasLab.getNRT = function () {
    return gasLab.molecules * gasLab.GAS_CONSTANT * gasLab.temperature;
};

gasLab.getR = function() {
	return gasLab.pressure * gasLab.volume / gasLab.molecules / gasLab.temperature;
};

gasLab.calcVolume = function (increasing) {
    gasLab.volume = gasLab.molecules * gasLab.GAS_CONSTANT
        * gasLab.temperature / gasLab.pressure;

    if (gasLab.volume > gasLab.MAX_VOLUME) {
        gasLab.volume = gasLab.MAX_VOLUME;
        gasLab.calcPressure();
    }
    gasLab.calcHeight();
};

gasLab.calcHeight = function () {
    gasLab.height = gasLab.volume / 1000;
    $("#height").val(gasLab.height.toFixed(0));
};

var init = function () {
    //Grab the stage
    var stage = new createjs.Stage("stage");
    gasLab.stage = stage;

    var chamber = new Chamber();
    gasLab.chamber = chamber;

    var piston = new Piston();
    gasLab.piston = piston;

    var volTracker = new VolumeTracker();
    gasLab.volTracker = volTracker;

    var gas = new Gas();
    gasLab.gas = gas;

    var gauges = new Gauges();
    gasLab.gauges = gauges;

    var flames = new Flames();
    gasLab.flames = flames;

    changeHeight();
    gasLab.calcPressure();
    stage.update();
};

var update = function () {
    $("#volumeOut").html(gasLab.volume.toExponential(4));
    $("#pressureOut").html(gasLab.pressure.toExponential(4));
    $("#moleculesOut").html(gasLab.molecules.toExponential(4));
    $("#temperatureOut").html(gasLab.temperature.toExponential(4));
    //$("#leftOut").html(gasLab.getPV().toExponential(2));
    //$("#rightOut").html(gasLab.getNRT().toExponential(2));
	//$("#ROut").html(gasLab.getR().toFixed(5));
    gasLab.piston.update();
    gasLab.volTracker.update();
    gasLab.gas.update();
    gasLab.gauges.update();
    gasLab.flames.update();
    gasLab.stage.update();
};

var reset = function () {
    $("#height").val(10);
    $("#molecules").val(0.1);
    $("#temperature").val(290);
    gasLab.height = 10;
    gasLab.molecules = 0.1;
    gasLab.temperature = 290;
    gasLab.calcPressure();
    changeHeight();
};

var changeHeight = function () {
    gasLab.setHeight(parseInt($("#height").val(), 10) || 10);
    update();
};

var changeMolecules = function () {
    gasLab.setMolecules(parseFloat($("#molecules").val()) || 0.1);
    update();
};

var changeTemperature = function () {
    gasLab.setTemperature(
        parseInt($("#temperature").val(), 10) || 290
    );
    update();
};

var Chamber = function () {
    //Aliases
    var stage = gasLab.stage;
    var white = gasLab.COLOR_WHITE;

    var chamber = new createjs.Shape();
    chamber.w = 100;
    chamber.h = 400;
    chamber.hOffset = 50;
    chamber.pointer = { x: -20, y: chamber.h - 10 };
    chamber.x = gasLab.STAGE_WIDTH / 2 - chamber.w / 2;
    chamber.y = gasLab.STAGE_HEIGHT - chamber.h - chamber.hOffset;
    chamber.graphics.beginStroke(white);
    chamber.graphics.moveTo(0, 0);
    chamber.graphics.lineTo(0, chamber.h);
    chamber.graphics.lineTo(chamber.w, chamber.h);
    chamber.graphics.lineTo(chamber.w, 0);
    chamber.graphics.beginStroke(white);
    chamber.graphics.moveTo(0, chamber.h);
    chamber.graphics.lineTo(chamber.pointer.x, chamber.pointer.y);
    stage.addChild(chamber);

    var areaLabel = new createjs.Text();
    areaLabel.text = "A = 1.00 m^2";
    areaLabel.color = white;
    areaLabel.x = chamber.x - 68;
    areaLabel.y = chamber.y + chamber.h - 30;
    stage.addChild(areaLabel);

    //Save variables
    this.chamber = chamber;
    this.areaLabel = areaLabel;
    this.x = chamber.x;
    this.y = chamber.y;
    this.w = chamber.w;
    this.h = chamber.h;
    this.hOffset = chamber.hOffset;
};

var Piston = function () {
    var stage = gasLab.stage;
    var chamber = gasLab.chamber;

    this.update = function () {
        piston.y = chamber.y + chamber.h - piston.h
            - gasLab.height * gasLab.PX_PER_METER;
        var graphics = piston.graphics;
        graphics.clear();
        graphics.beginStroke(gasLab.COLOR_WHITE);
        graphics.drawRect(0, 0, piston.w, piston.h);
        piston.graphics.moveTo(piston.w / 2, 0);
        piston.graphics.lineTo(piston.w / 2, -piston.y);
    };

    var piston = new createjs.Shape();
    piston.w = chamber.w - 2;
    piston.h = 20;
    piston.x = chamber.x + 1;
    stage.addChild(piston);

    this.update();

    //Save variables
    this.piston = piston;
    this.x = piston.x;
    this.y = piston.y;
    this.w = piston.w;
    this.h = piston.h;
};

var VolumeTracker = function () {
    var stage = gasLab.stage;
    var chamber = gasLab.chamber;
    var piston = gasLab.piston;
    var white = gasLab.COLOR_WHITE;

    this.update = function () {
        volMarker.h = gasLab.PX_PER_METER * gasLab.height;
        this.h = volMarker.h;
        var graphics = volMarker.graphics;
        graphics.clear();
        graphics.beginStroke(white);
        graphics.moveTo(0, 0);
        graphics.lineTo(volMarker.w, 0);
        graphics.moveTo(volMarker.w / 2, 0);
        graphics.lineTo(volMarker.w / 2, -volMarker.h);
        graphics.moveTo(0, -volMarker.h);
        volMarker.graphics.lineTo(volMarker.w, -volMarker.h);

        volText.y = volMarker.y - volMarker.h / 2;
        volText.text = "h = " + gasLab.height.toPrecision(3)
            + " m\nV = " + gasLab.volume.toPrecision(3) + " L";
    };

    var volMarker = new createjs.Shape();
    volMarker.w = 20;
    volMarker.x = chamber.x + chamber.w + 8;
    volMarker.y = chamber.y + chamber.h;
    stage.addChild(volMarker);

    var volText = new createjs.Text();
    volText.x = volMarker.x + volMarker.w;
    volText.color = white;
    stage.addChild(volText);

    this.update();

    //Save variables
    this.volMarker = volMarker;
    this.volText = volText;
};

var Gas = function () {
    var stage = gasLab.stage;
    var piston = gasLab.piston;
    var chamber = gasLab.chamber;
    var volTracker = gasLab.volTracker;

    this.update = function () {
        gas.h = volTracker.h;
        gas.opacity = gasLab.OPACITY_GRADIENT * gasLab.molecules
            + gasLab.MIN_OPACITY;
        var red = Math.floor(gasLab.COLOR_GRADIENT
            * (gasLab.pressure / gasLab.MAX_PRESSURE));
        var blue = Math.floor((1 - gasLab.COLOR_GRADIENT)
            * (gasLab.pressure / gasLab.MAX_PRESSURE));
        var graphics = gas.graphics;
        graphics.clear();
        graphics.beginFill("rgba(" + red + ", 0, " + blue + ", "
            + gas.opacity + ");");
        graphics.drawRect(0, 0, piston.w, -gas.h);
    };

    var gas = new createjs.Shape();
    gas.x = piston.x;
    gas.y = chamber.y + chamber.h;
    gas.w = piston.w;
    stage.addChild(gas);

    this.gas = gas;
};

var Gauges = function () {
    var stage = gasLab.stage;

    this.update = function () {
        cursor1.x = pressureGauge.x
            + (gasLab.pressure / gasLab.MAX_PRESSURE)
            * pressureGauge.w;
        cursor2.x = moleculeGauge.x
            + (gasLab.molecules / gasLab.MAX_MOLS) * moleculeGauge.w;

        pressureLabel.text = "P = " + gasLab.pressure.toPrecision(3) + " atm";
        moleculeLabel.text = "n = " + gasLab.molecules.toPrecision(3) + " mol";
    };

    var pressureGauge = new createjs.Shape();
    pressureGauge.x = 32;
    pressureGauge.y = 100;
    pressureGauge.w = 200;
    pressureGauge.h = 20;
    var graphics = pressureGauge.graphics;
    graphics.beginStroke("#FFFFFF");
    graphics.drawRect(0, 0, pressureGauge.w, pressureGauge.h);
    for (var i = 0; i < 10; i++) {
        var red = Math.floor(i / 10 * gasLab.COLOR_GRADIENT);
        var blue = Math.floor((1 - i / 10) * gasLab.COLOR_GRADIENT);
        graphics.beginFill("rgb(" + red + ", 0, " + blue + ")");
        graphics.drawRect(i * 20, 0, 20, 20);
    }
    stage.addChild(pressureGauge);

    var moleculeGauge = new createjs.Shape();
    moleculeGauge.x = pressureGauge.x;
    moleculeGauge.y = pressureGauge.y + 100;
    moleculeGauge.w = pressureGauge.w;
    moleculeGauge.h = pressureGauge.h;
    graphics = moleculeGauge.graphics;
    graphics.beginStroke("#FFFFFF");
    graphics.drawRect(0, 0, moleculeGauge.w, moleculeGauge.h);
    for (i = 0; i < 10; i++) {
        var alpha = i / 10;
        graphics.beginFill("rgba(255, 255, 255," + alpha + ");");
        graphics.drawRect(i * 20, 0, 20, 20);
    }
    stage.addChild(moleculeGauge);

    var cursor1 = new createjs.Shape();
    cursor1.x = pressureGauge.x;
    cursor1.y = pressureGauge.y + 10;
    graphics = cursor1.graphics;
    graphics.beginFill("#FFFFFF");
    graphics.moveTo(0, 0);
    graphics.lineTo(4, 15);
    graphics.lineTo(-4, 15);
    graphics.lineTo(0, 0);
    stage.addChild(cursor1);

    var cursor2 = cursor1.clone(true);
    cursor2.y = moleculeGauge.y + 10;
    stage.addChild(cursor2);

    var pressureLabel = new createjs.Text();
    pressureLabel.x = pressureGauge.x;

    pressureLabel.color = "#FFFFFF";
    pressureLabel.y = pressureGauge.y + pressureGauge.h + 10;
    stage.addChild(pressureLabel);

    var moleculeLabel = new createjs.Text();
    moleculeLabel.x = moleculeGauge.x;
    moleculeLabel.color = "#FFFFFF";
    moleculeLabel.y = moleculeGauge.y + moleculeGauge.h + 10;
    stage.addChild(moleculeLabel);

    this.pressureGauge = pressureGauge;
    this.moleculeGauge = moleculeGauge;
    this.cursor1 = cursor1;
    this.cursor2 = cursor2;
};

var Flames = function () {
    var stage = gasLab.stage;
    var chamber = gasLab.chamber;

    this.update = function () {
        tempLabel.text = "T = " + gasLab.temperature.toPrecision(3)
            + " K";
        var tempRatio = gasLab.temperature / gasLab.MAX_TEMP;
        var colorNumber = Math.floor(tempRatio * 256);
        var flameColor = "rgb(" + colorNumber + ", 0, 0);";
        for (var index in flames)
            this.drawFlame(flames[index], flameColor);
    };

    this.drawFlame = function (shape, color) {
        var graphics = shape.graphics;
        graphics.clear();
        graphics.beginStroke("#FFFFFF");
        graphics.beginFill(color);
        graphics.arc(0, 0, flameTemplate.w / 2, 0, Math.PI);
        graphics.lineTo(0, -flameTemplate.h);
        graphics.lineTo(flameTemplate.w / 2, 0);
    };

    var flameTemplate = new createjs.Shape();
    flameTemplate.h = 20;
    flameTemplate.w = chamber.w / 8;
    flameTemplate.y = chamber.y + chamber.h + flameTemplate.h;

    var flames = [];
    for (var i = 0; i < 8; i++) {
        var flame = flameTemplate.clone(true);
        flame.x = chamber.x + flameTemplate.w / 2
            + flameTemplate.w * i;
        stage.addChild(flame);
        flames[i] = flame;
    }

    var tempLabel = new createjs.Text();
    tempLabel.x = chamber.x;
    tempLabel.y = flameTemplate.y + 10;
    tempLabel.color = "#FFFFFF";
    stage.addChild(tempLabel);
};

window.onload = init;