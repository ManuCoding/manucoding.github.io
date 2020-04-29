class spritesheet {
  constructor(sprite, aX, aY, fW, fH) { // respectivement animation X, animation Y, frame width, frame height
    this.init(sprite, aX, aY, fW, fH);
  }

  init(sprite, aX, aY, fW, fH) {
    this.sheet = loadImage(sprite), // la fonction de Manu pour charger une image
    this.aX = aX, this.aY = aY, this.fW = fW, this.fH = fH;
  }

  draw(id, frame, x, y, scale) {
    image(this.sheet, this.aX + this.fW * frame, this.aY + this.fH * id, this.fW, this.fH, x, y, this.fW * scale, this.fH * scale); // La fonction de Manu pour dessiner une image
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

/*class animations {
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
