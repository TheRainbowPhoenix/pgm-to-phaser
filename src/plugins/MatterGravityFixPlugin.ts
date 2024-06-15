/**
 * quickfix for issue in https://github.com/photonstorm/phaser/issues/6473
 */
export class MatterGravityFixPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super(scene, pluginManager, "MatterGravityFix");
  }
  boot() {
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter;
    this.applyGravityFix(Matter);
  }
  applyGravityFix(Matter: any) {
    Matter.Engine._bodiesApplyGravity = function (bodies: Phaser.Types.Physics.Matter.MatterBodyConfig[] |any[], gravity: Phaser.Physics.Matter.Sprite) {
      var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001,
        bodiesLength = bodies.length;

      if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
        return;
      }

      for (var i = 0; i < bodiesLength; i++) {
        var body = bodies[i];

        if (body.ignoreGravity || body.isStatic || body.isSleeping) {
          continue;
        }
        body.force.y += body.mass * gravity.y * gravityScale;
        body.force.x += body.mass * gravity.x * gravityScale;
      }
    };
  }
}
