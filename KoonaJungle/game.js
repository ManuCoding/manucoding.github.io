var world=new World();
var player=world.addEntity(new Player(0,0));

debugMode=true;
function draw() {
	background("#202020");
	world.update();
}
