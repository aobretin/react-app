(function(){
	var container = document.getElementById('SVGSprite');
	if (container) {
		container.innerHTML = "";
	} else {
		throw new Error("Can't find element: #" + container);
	}
})();