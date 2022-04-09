export default class SFX {
  constructor(data) {
    this._emitters = {};
    this._particles = data.sprites;
    this._frames = ['blue', 'purple', 'red', 'yellow', 'green'];
  }

  _createEmitter(color) {
    this._emitters[color] = this._particles.createEmitter({
      frame: color,
      lifespan: 1000,
      speed: { min: 200, max: 400 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0 },
      rotate: { start: 0, end: 360, ease: 'Power2' },
      blendMode: 'ADD',
      on: false
    });
  }

  _callEmitter() {
    for (let i = 0; i < this._frames.length; i++) {
      this._createEmitter(this._frames[i]);
    }
  }

  emitt() {
    const color = Phaser.Math.Between(0, 4);
    this._callEmitter();
    this._emitters[this._frames[color]].explode(26, 90, 70);
  }

  cameraFadeIn() {
    return this.cameras.fadeIn(250);
  }

  cameraFadeOut(next) {
    this.cameras.add().fade(1000, 0, 0, 0, false, next);
  }

  cameraShake(next) {
    this.cameras.add().shake(1000, 0.04, false, next);
  }
}