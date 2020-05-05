function keydown(key) {
	switch (key.keyCode || key.which) {
		case 27:
			mainMenu.style.display = mainMenu.style.display == 'none' ? 'block' : 'none';
			break;
		default:
			// Do nothing
	}
}

let closeMainMenuBtn = click('closeMainMenu', () => {
	mainMenu.style.display = 'none';
});
