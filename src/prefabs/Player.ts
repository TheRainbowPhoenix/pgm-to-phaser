
// You can write more code here
import { ControllerEvent } from "../enums/ControllerEvent";
import { emit } from "../utils/eventEmitterUtils";

/* START OF COMPILED CODE */

import BasePlayer from "./BasePlayer";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Player extends BasePlayer {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// hasumi_screen
		const hasumi_screen = scene.add.image(0, 0, "hasumi_screen");
		hasumi_screen.setOrigin(0.5, 0.84);
		this.add(hasumi_screen);

		// leftKey
		const leftKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

		// rightKey
		const rightKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		// upKey
		const upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		// spaceKey
		const spaceKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.hasumi_screen = hasumi_screen;
		this.leftKey = leftKey;
		this.rightKey = rightKey;
		this.upKey = upKey;
		this.spaceKey = spaceKey;

		/* START-USER-CTR-CODE */
		this.width = hasumi_screen.width;
		this.height = hasumi_screen.height;

		// this.initSpineObject(this.pos);
		this.createBody(this.pos);
		this.createAboveHeadBody(this.pos);
		this.listenForEvents();
		this.cameraFollow();
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	private hasumi_screen: Phaser.GameObjects.Image;
	private leftKey: Phaser.Input.Keyboard.Key;
	private rightKey: Phaser.Input.Keyboard.Key;
	private upKey: Phaser.Input.Keyboard.Key;
	private spaceKey: Phaser.Input.Keyboard.Key;
	public score: number = 0;

	/* START-USER-CODE */
	protected velocity = { x: 0, y: 0 };

	// Write your code here.

	setVelocityX(x: number) {
		this.velocity.x = x;
		if (x < 0 && !this.hasumi_screen.flipX) {
			this.hasumi_screen.flipX = true
		} else if (x > 0 && this.hasumi_screen.flipX) {
			this.hasumi_screen.flipX = false
		}
		emit(ControllerEvent.move, { velocity: this.velocity });
	}
	setVelocityY(y: number) {
		this.velocity.y = y;
		emit(ControllerEvent.jump, { velocity: this.velocity });
	}

	updatePos() {
		super.updatePos();
		const { x, y } = this.body.position;
		this.hasumi_screen.setPosition(x - 195, y - 240)
	}

	update(time: number, delta: number): void {
		super.update(time, delta)
		this.updatePos();

		// const velocity = { x: 0, y: 0 };

		// if (this.leftKey.isDown) {
		// 	velocity.x = -1;
		// }
		// if (this.rightKey.isDown) {
		// 	velocity.x = 1;
		// }
		// if (this.upKey.isDown || this.spaceKey.isDown) {
		// 	velocity.y = -1;
		// } else {
		// 	velocity.y = 0;
		// }

		// emit(ControllerEvent.move, { velocity });
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */


// You can write more code here
