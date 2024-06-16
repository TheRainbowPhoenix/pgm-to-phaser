
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import Player from "../prefabs/Player";
import Platform from "../prefabs/Platform";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MatterLevel extends Phaser.Scene {

	constructor() {
		super("MatterLevel");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// background
		const background = this.add.image(0, 0, "bg");
		background.scaleX = 1.5;
		background.scaleY = 1.1;
		background.setOrigin(0, 0);

		// player
		const player = new Player(this, 218, 345);
		this.add.existing(player);
		player.name = "player";

		// platforms
		const platforms = this.add.layer();

		// platform_4
		const platform_4 = new Platform(this, -5, 152);
		platform_4.angle = 86;
		platforms.add(platform_4);

		// platform_3
		const platform_3 = new Platform(this, 1200, 508);
		platforms.add(platform_3);

		// platform_2
		const platform_2 = new Platform(this, 797, 534);
		platforms.add(platform_2);

		// platform_1
		const platform_1 = new Platform(this, 395, 565);
		platforms.add(platform_1);

		// platform
		const platform = new Platform(this, -5, 553);
		platforms.add(platform);

		this.player = player;
		this.platforms = platforms;

		this.events.emit("scene-awake");
	}

	private player!: Player;
	private platforms!: Phaser.GameObjects.Layer;

	/* START-USER-CODE */
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;

	// Write your code here

	create() {

		this.editorCreate();


		for (const platform of this.platforms.list) {
			// platform.update();
		}

		// TODO: non-keyboard devices ?
		this.cursors = this.input.keyboard!.createCursorKeys();
	}

	update(time: number, delta: number): void {
		super.update(time, delta)

		this.player.update(time, delta);
		// for (const platform of this.platforms.getAll()) {
		// 	platform.update()
		// }

		if (this.cursors.left.isDown) {

			this.player.setVelocityX(-0.35);

			// this.player.anims.play("left", true);

		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(0.35);

			// this.player.anims.play("right", true);

		} else {

			this.player.setVelocityX(0);

			// this.player.anims.play("turn");
		}
		if (this.player.isOnGround()) {
			if (this.cursors.up.isDown /* && this.player.body.touching.down */) {
				console.log("UP")
				this.player.setVelocityY(.15);
			}
		} else {

		}

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
