
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import StartAnimationScript from "../script-nodes/StartAnimationScript";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Velonia extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 26, y ?? 32);

		// sprite
		const sprite = scene.add.sprite(6, 0, "player", "player_6.png") as Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body };
		scene.physics.add.existing(sprite, false);
		sprite.body.maxVelocity.x = 1000;
		sprite.body.maxVelocity.y = 1000;
		sprite.body.maxSpeed = 400;
		sprite.body.friction.x = 0;
		sprite.body.allowGravity = false;
		sprite.body.allowDrag = false;
		sprite.body.allowRotation = false;
		sprite.body.pushable = false;
		sprite.body.setOffset(22, 16);
		sprite.body.setSize(18, 34, false);
		this.add(sprite);

		// startAnimationScript
		const startAnimationScript = new StartAnimationScript(sprite);

		// numberCount
		const numberCount = scene.add.bitmapText(-2, 20, "SN", "63");
		numberCount.visible = false;
		numberCount.text = "63";
		numberCount.fontSize = 10;
		this.add(numberCount);

		// collider
		const collider = scene.physics.add.image(6, 1, "_MISSING");
		collider.visible = false;
		collider.alpha = 0.01;
		collider.alphaTopLeft = 0.01;
		collider.alphaTopRight = 0.01;
		collider.alphaBottomLeft = 0.01;
		collider.alphaBottomRight = 0.01;
		collider.body.setCircle(14);
		this.add(collider);

		// numberGun
		const numberGun = scene.add.bitmapText(-28, -8, "GN", "99");
		numberGun.visible = false;
		numberGun.text = "99";
		numberGun.fontSize = 10;
		this.add(numberGun);

		// startAnimationScript (prefab fields)
		startAnimationScript.animationKey = "player/idle/player-right-idle";

		this.sprite = sprite;
		this.numberCount = numberCount;
		this.collider = collider;
		this.numberGun = numberGun;

		/* START-USER-CTR-CODE */

		this.body = this.sprite.body;

		// this.body.friction.x = 0;
		// this.body.friction.y = 0;

		this.hurtFlag = false;

		this.scene.time.addEvent({
			loop: true,
			delay: 500,
			callback: () => {

				this.hurtFlag = false;
			}
		});

		this.scene.events.on("update", (time: number, delta: number) => this.updatePlayer(time, delta));

		/* END-USER-CTR-CODE */
	}

	public sprite: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body };
	public numberCount: Phaser.GameObjects.BitmapText;
	public collider: Phaser.Physics.Arcade.Image;
	private numberGun: Phaser.GameObjects.BitmapText;

	/* START-USER-CODE */
	public body: Phaser.Physics.Arcade.Body;
	hurtFlag: boolean;

	/**
	 * @return {Phaser.Physics.Arcade.Body} 
	 */
	getBody() {
		return this.sprite.body;
	}

	getSprite() {
		return this.sprite;
	}

	getArcadeBounds(): Phaser.Geom.Rectangle {
		return this.collider.getBounds();
		// return new Phaser.Geom.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);
	}

	play(key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean) {
		return this.sprite.play(key, ignoreIfPlaying);
	}

	updatePlayer(time: number, delta: number) {
		this.collider.x = this.sprite.x;
		this.collider.y = this.sprite.y;

		this.numberCount.x = this.sprite.x - 8;
		this.numberCount.y = this.sprite.y + 20;

		this.numberGun.x = this.sprite.x - 32;
		this.numberGun.y = this.sprite.y - 8;

		if (this.hurtFlag) {
			this.sprite.play("player/hurt/player-hurt", true);
		}
	}

	setCount(n: number) {
		this.numberCount.setVisible(true);
		this.numberCount.setText(`${n}%`);
	}

	hideCount() {
		this.numberCount.setVisible(false);
	}

	setFireCount(n : number) {
		this.numberGun.setVisible(true);
		this.numberGun.setText(`${n}`);
	}

	hurtPlayer() {

		if (this.hurtFlag) {

			return;
		}

		this.hurtFlag = true;

		//this.hurtTimer.start();

		const body = this.sprite.body;

		// body.velocity.y = -100;

		// body.velocity.x = (this.scale.x == 1) ? -100 : 100;
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
