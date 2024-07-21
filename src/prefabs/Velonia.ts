
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import StartAnimationScript from "../script-nodes/StartAnimationScript";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default interface Velonia {

	 body: Phaser.Physics.Arcade.Body;
}

export default class Velonia extends Phaser.GameObjects.Sprite {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 32, y ?? 32, texture || "player", frame ?? "player_6.png");

		this.setInteractive(new Phaser.Geom.Rectangle(17, 14, 32, 34), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.maxVelocity.x = 1000;
		this.body.maxVelocity.y = 1000;
		this.body.maxSpeed = 400;
		this.body.friction.x = 0;
		this.body.allowGravity = false;
		this.body.allowDrag = false;
		this.body.allowRotation = false;
		this.body.pushable = false;
		this.body.setOffset(22, 16);
		this.body.setSize(18, 34, false);

		// startAnimationScript
		const startAnimationScript = new StartAnimationScript(this);

		// startAnimationScript (prefab fields)
		startAnimationScript.animationKey = "player/idle/player-right-idle";

		/* START-USER-CTR-CODE */

		this.body.friction.x = 0;
		this.body.friction.y = 0;

		this.hurtFlag = false;

		this.scene.time.addEvent({
			loop: true,
			delay: 500,
			callback: () => {

				this.hurtFlag = false;
			}
		});

		this.scene.events.on("update", () => this.updatePlayer());

		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	hurtFlag: boolean;

	/**
	 * @return {Phaser.Physics.Arcade.Body} 
	 */
	getBody() {
		return this.body;
	}

	updatePlayer() {

		if (this.hurtFlag) {

			this.play("player/hurt/player-hurt", true);
		}
	}

	hurtPlayer() {

		if (this.hurtFlag) {

			return;
		}

		this.hurtFlag = true;

		//this.hurtTimer.start();

		const body = this.getBody();

		// body.velocity.y = -100;

		// body.velocity.x = (this.scale.x == 1) ? -100 : 100;
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
