gagslib.images.setSources([
	"canisterBack",
	"canisterFront",
	"gasTank",
    "greenButton",
	"blueButton",
	"redButton",
    "resetButton",
	"weight"
]);
gagslib.images.setOnComplete(gaslab.load);

//Aliases
var images = gagslib.images.images;
var loadNext = gagslib.images.loadNext;