
// You can write more code here

import OnPointerDownScript from "../script-nodes-basic-ts/OnPointerDownScript"
import PushActionScript from "../script-nodes/PushActionScript"

/* START OF COMPILED CODE */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// dino
		const dino = this.add.image(643, 281, "dino");

		// onPointerDownScript
		const onPointerDownScript = new OnPointerDownScript(dino);

		// pushActionScript
		new PushActionScript(onPointerDownScript);

		// text_1
		const text_1 = this.add.text(640, 547, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "Phaser 3 + Phaser Editor 2D + TypeScript";
		text_1.setStyle({ "fontFamily": "arial", "fontSize": "3em" });

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here.

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here