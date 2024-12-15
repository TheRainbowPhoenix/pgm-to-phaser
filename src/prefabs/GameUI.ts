
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
		const bottom_text_board = scene.add.image(672, 448, "text_board01", "bottom_text_board");
		bottom_text_board.preFX!.padding = 1;
		bottom_text_board.setOrigin(1, 1);
		logInfo.add(bottom_text_board);

		// consoleLog
		const consoleLog = scene.add.bitmapText(374, 328, "k8x12", " \n");
		consoleLog.text = " \n";
		consoleLog.fontSize = -12;
		logInfo.add(consoleLog);

		// map
		const map = scene.add.layer();
		this.add(map);

		// levelMap
		const levelMap = scene.add.sprite(1120, 176, "MAP_Lv1_bridge_1", "MAP_1b_request_crew.png");
		levelMap.setOrigin(1, 0.5);
		map.add(levelMap);

		// elevator
		const elevator = scene.add.layer();
		this.add(elevator);

		// elevator_console
		const elevator_console = scene.add.image(320, -64, "elevator", "elevator_6.png");
		elevator.add(elevator_console);

		this.bottom_text_board = bottom_text_board;
		this.consoleLog = consoleLog;
		this.logInfo = logInfo;
		this.levelMap = levelMap;
		this.map = map;
		this.elevator_console = elevator_console;
		this.elevator = elevator;

		/* START-USER-CTR-CODE */

		const gameConf = this.systems.game.config
		this.width = typeof gameConf.width === 'string' ? parseInt(gameConf.width, 10) : gameConf.width;
		this.height = typeof gameConf.height === 'string' ? parseInt(gameConf.height, 10) : gameConf.height;

		// x, y = 512, 412
		// 640, 360
		this.bottom_text_board.setPosition(this.width +32, this.height + 84) // set its position x and y to the gameconfig width and gameconfig height
		this.consoleLog.setPosition(this.width - 266, this.height - 32)
		this.levelMap.setPosition(this.width + 480, 176)
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	private bottom_text_board: Phaser.GameObjects.Image;
	private consoleLog: Phaser.GameObjects.BitmapText;
	private logInfo: Phaser.GameObjects.Layer;
	private levelMap: Phaser.GameObjects.Sprite;
	private map: Phaser.GameObjects.Layer;
	private elevator_console: Phaser.GameObjects.Image;
	private elevator: Phaser.GameObjects.Layer;
	public isDialogVisible: boolean = false;
	public dialogTimeout: number = 0;
	public levelMapVisible: boolean = false;
	public sectorMiniMap: number = 0;

	/* START-USER-CODE */

	private width: number;
	private height: number;

	setScrollFactor(x: number, y:number) {
		this.logInfo.getChildren().forEach((elem: any) => {
			elem.setScrollFactor(0, 0);
		});

		this.map.getChildren().forEach((elem: any) => {
			elem.setScrollFactor(0, 0);
		});

		this.elevator.getChildren().forEach((elem: any) => {
			elem.setScrollFactor(0, 0);
		});

		this.logInfo.setDepth(92);
	}

	// Full level map

	showLevelMap() {
		if (!this.levelMapVisible) {
			// TODO: swap the content according to the level

			this.scene.tweens.add({
			  targets: this.levelMap,
			  x: this.width + 20, // Final position
			  duration: 500,
			  ease: "Elastic",
			  easeParams: [0.1, 1.5], // Adjust for more elasticity
			});
			this.levelMapVisible = true;
		  }
	}

	hideLevelMap() {
		if (this.levelMapVisible) {
			this.scene.tweens.add({
			targets: this.levelMap,
			x: this.width + 480, // Off-screen to the right
			duration: 500,
			ease: "Power2",
			});
			this.levelMapVisible = false;
		}

	}

	// Elevator
	showElevatorMenu() {
		this.scene.tweens.add({
			targets: this.elevator_console,
			x: 320,
			y: 44,
			duration: 500,
			ease: "Elastic",
			easeParams: [0.1, 1.4],
		});
    }

	hideElevatorMenu() {
		this.scene.tweens.add({
			targets: this.elevator_console,
			x: 320, // Final position
			y: -64,
			duration: 500,
			ease: "Elastic.In",
			easeParams: [0.1, 1.4], // Adjust for more elasticity
		});
	}


	showDialog(message: string, autoDismiss = true, timeout = 4500) {
		this.scene.tweens.add({
			targets: this.bottom_text_board,
			y: this.height + 18,
			duration: 50,
			ease: "Power2",
		  });

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

		this.scene.tweens.add({
			targets: this.bottom_text_board,
			y: this.height + 84,
			duration: 500,
			ease: "Elastic.In",
			easeParams: [0.6, 0.8], // Adjust for more elasticity
		});

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
