var imagesLoaded = 0;
var sources = [
	"canisterBack",
	"canisterFront",
	"gasTank",
	"greenButton",
	"greenButtonOff",
	"blueButton",
	"redButton",
	"weight"
];

function loadNext() {
	if (imagesLoaded < sources.length) {
		loadImage(sources[imagesLoaded], loadNext);
		imagesLoaded++;
	}
	else
		load();
}