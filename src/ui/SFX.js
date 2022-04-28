export default class SFX {
  constructor(sprites) {
    this._particles = sprites;
  }

  emitt(x, y) {
    const emitter = this._particles.createEmitter({
      x: x,
      y: y,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      lifespan: 300,
      gravityY: 800,
    });

    emitter.explode();
  }
}
