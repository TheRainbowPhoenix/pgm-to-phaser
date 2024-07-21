
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GameUI extends Phaser.GameObjects.Layer {

	constructor(scene: Phaser.Scene) {
		super(scene);

		// logInfo
		const logInfo = scene.add.layer();
		this.add(logInfo);

		// bottom_text_board
		const bottom_text_board = scene.add.image(512, 346, "text_board01", "bottom_text_board");
		logInfo.add(bottom_text_board);

		// consoleLog
		const consoleLog = scene.add.bitmapText(374, 328, "k8x12", "Captain's access key is required to move to level 2.");
		consoleLog.text = "Captain's access key is required to move to level 2.";
		consoleLog.fontSize = -12;
		logInfo.add(consoleLog);

		this.consoleLog = consoleLog;
		this.logInfo = logInfo;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	private consoleLog: Phaser.GameObjects.BitmapText;
	private logInfo: Phaser.GameObjects.Layer;
	public isDialogVisible: boolean = false;
	public dialogTimeout: number = 0;

	/* START-USER-CODE */

	setScrollFactor(x: number, y:number) {
		this.logInfo.getChildren().forEach((elem: any) => {
			elem.setScrollFactor(0, 0);
		  });
		  this.logInfo.setDepth(92);
	}

	showDialog(message: string, autoDismiss = true, timeout = 4500) {
		console.log("showDialog")

        this.consoleLog.setText(message); // todo: split if too long + add prompt hint ?
		this.isDialogVisible = true;
		if (autoDismiss) {
            this.dialogTimeout = setTimeout(() => {
				console.log("auto dismiss")
                this.dismissDialog();
            }, timeout);
        }
    }

	dismissDialog() {
        this.consoleLog.setText('');
        this.isDialogVisible = false;

        if (this.dialogTimeout !== 0) {
            clearTimeout(this.dialogTimeout);
            this.dialogTimeout = 0;
        }
    }

	displayMessage(message: string) {
        this.showDialog(message, true);
    }

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
