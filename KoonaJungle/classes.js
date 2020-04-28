class spritesheet {
  constructor(spritesheet, aX, aY, fW, fH) {
    this.init(spritesheet, animations);
  }

  init(spritesheet, animations) {
    this.sheet = loadImage(spritesheet); // la fonction de Manu pour charger une image

    this.animations = animations.foreach(function(animation, index) {
      animation.currentFrame = 0;
    });
  }
}

class animations {
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
}

class entity {
  constructor() {

  }

  init(animations, hitboxes) {

  }

  draw(x, y, lock, width, height) {

  }
}

class player extends entity {

}
