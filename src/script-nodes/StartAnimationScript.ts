
/// <reference path="../script-nodes-basic-ts/ScriptNode.ts"/>
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../script-nodes-basic-ts/ScriptNode";
import Phaser from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StartAnimationScript extends ScriptNode {

	constructor(parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	public animationKey: string = "";
	public killOnComplete: boolean = false;

	/* START-USER-CODE */

	start() {

		this.gameObject.play(this.animationKey);

		if (this.killOnComplete) {

			this.gameObject.once(
				`animationcomplete-${this.animationKey}`,
				() => this.gameObject.destroy());
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
