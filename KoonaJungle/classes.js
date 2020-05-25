class Spritesheet {
	constructor(sprite, fW, fH, animations) { // respectivement animation X, animation Y, frame width, frame height
		this.init(sprite, fW, fH, animations);
	}

	init(sprite, fW, fH, animations) {
		this.sheet = loadImage(sprite), // la fonction de Manu pour charger une image
		this.fW = fW, this.fH = fH,
		this.animationsLength = animations, this.currentFrames = new Array(animations.length).fill(0);
	}

	draw(id, x, y, scale) {
		image(
			this.sheet,
			this.fW * this.currentFrames[id], this.fH * id, this.fW, this.fH,
			x, y, this.fW * scale, this.fH * scale
		); // La fonction de Manu pour dessiner une image

		this.currentFrames[id] = (this.currentFrames[id] + 1) % this.animationsLength[id];
	}

	reset(id) {
		this.currentFrames[id] = 0;
	}

	resetAll() {
		this.currentFrames = new Array(this.animationsLength.length).fill(0);
	}
}

class World {
	constructor(levels) {
		this.levels=levels;
		this.entities=[];
	}
	addEntity(entity) {
		return this.entities[this.entities.push(entity)-1];
	}
	update() {
		for(var entity of this.entities) {
			entity.show();
			if(debugMode) for(var box of entity.hitboxes) {
				fill(255,0,0);
				outline(box.x,box.y,box.w,box.h);
			}
		}
	}
}

var debugMode=false;

class Hitbox {
	constructor(x,y,w,h) {
		var args=Array.from(arguments);
		for(var c of "xywh") {
			this[c]=args.shift()|0;
		}
	}
	hit(other) {
		if(other instanceof Hitbox) {
			return this.x<=other.x+other.w
				&& this.x+this.w>=other.x
				&& this.y<=other.y+other.h
				&& this.y+this.h>=other.y;
		}
		return false;
	}
	rect() {
		rect(this.x,this.y,this.w,this.h);
	}
}

class Entity {
	constructor(x,y,...args) {
		this.x=x;
		this.y=y;
		this.gravity=true;
		this.hitboxes=[];
		this.init.apply(this,args);
	}
	// May be overriden
	init() {}
	update() {}
	show() {}
}

class Player extends Entity {
	init() {
		this.hitboxes=[new Hitbox(0,0,16,16)];
	}
	show() {
		fill("#eee");
		for(var hitbox of this.hitboxes) {
			hitbox.rect();
		}
	}
}

/*class Animations {
	constructor(spritesheet, x, y, animations = [{name: "", frames: [{x: 0, y: 0, w: 0, h: 0}]}]) {
	this.init(spritesheet, animations);
	}

	init(spritesheet, animations) {
	this.sheet = loadImage(spritesheet); // la fonction de Manu pour charger une image

	animations.foreach(function(animation, index) {
	animation.currentFrame = 0;
	});

	this.animations = animations;
	}

	draw(animationID, x, y, w, h) {
	this.animations[animationID].currentFrame = (this.animations[animationID].currentFrame++) % this.animations[animationID].frames.length;

	image(
	this.sheet,
	this.animations[animationID].frames[frame].x, this.animations[animationID].frames[frame].y,
	this.animations[animationID].frames[frame].w, this.animations[animationID].frames[frame].h,
	x, y, w, h
	); // la fonction de Manu pour dessiner une image
	}
}*/
