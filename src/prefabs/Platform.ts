
// You can write more code here

/* START OF COMPILED CODE */

import BasePlatform from "./BasePlatform";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Platform extends BasePlatform {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// platform
		const platform = scene.add.image(0, 0, "platform");
		platform.setOrigin(0, 0);
		this.add(platform);

		/* START-USER-CTR-CODE */
		this.width = platform.width;
		this.height = platform.height;

		this.createBody(this.pos);
		this.listenForEvents();
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	updatePos() {
		this.pos = new Phaser.Math.Vector2(this.x, this.y);
		super.updatePos();
		console.log(this.angle)
	}

	update(time: number, delta: number): void {
		super.update(time, delta);
		this.updatePos();
	}

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
