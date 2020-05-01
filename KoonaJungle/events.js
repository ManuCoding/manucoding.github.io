function keydown(key) {
	switch (key.keyCode || key.which) {
		case 27:
			document.getElementById('menu').style.display = document.getElementById('menu').style.display == 'none' ? 'block' : 'none';
			break;
		default:
			// Do nothing
	}
}
