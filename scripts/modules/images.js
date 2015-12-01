var gagslib = gagslib || {};
gagslib.images = (function () {
	var images = {};
	var imagesLoaded = 0;
	var sources = [];
	var onComplete = function(){};
	
	//Set the sources for image loading
	function setSources(src) {
		sources = src;
	}
	
	//Set the callback for when the image finishes loading
	function setOnComplete(callback) {
		onComplete = callback;
	}
	
	//Load the next image and then call loadNext()
	function loadImage(id) {
		var image = new Image();
		image.src = "images/" + id + ".png";
		image.onload = loadNext;
		images[id] = image;
	}
	
	//Load the next image or call onComplete()
	function loadNext() {
		if (imagesLoaded < sources.length) {
			loadImage(sources[imagesLoaded]);
			imagesLoaded++;
		}
		else
			onComplete();
	}
	
	return {
		images : images,
		setSources : setSources,
		setOnComplete: setOnComplete,
		loadNext : loadNext
	};
})();