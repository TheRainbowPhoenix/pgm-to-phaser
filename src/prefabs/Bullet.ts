// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default interface Bullet {

	 body: Phaser.Physics.Arcade.Body;
}

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "bullets", frame ?? "bullet shot");

		this.setInteractive(new Phaser.Geom.Rectangle(43, 38, 9.41023240075367, 31.39510855913595), Phaser.Geom.Rectangle.Contains);
		scene.physics.add.existing(this, false);
		this.body.setOffset(44, 45);
		this.body.setSize(8, 8, false);

		/* START-USER-CTR-CODE */

    // Write your code here.
    /* END-USER-CTR-CODE */
	}

	public speed: number = 300;

	/* START-USER-CODE */

  fireDirection(direction: string, speed?: number) {
    if (speed == undefined) {
        speed = this.speed;
    }
    let velocity = { x: 0, y: 0 };
    let isDiagonal = false;

    switch (direction) {
      case "up":
        velocity.y = -speed;
        break;
      case "down":
        this.setAngle(180);
        velocity.y = speed;
        break;
      case "left":
        this.setAngle(270);
        velocity.x = -speed;
        break;
      case "right":
        this.setAngle(90);
        velocity.x = speed;
        break;
      default:
        isDiagonal = true;
    }

    if (isDiagonal) {
        this.setFrame("bullet shot diagonal");
      switch (direction) {
        case "NE":
          velocity.x = speed;
          velocity.y = -speed;
          break;
        case "NW":
          this.setAngle(270);
          velocity.x = -speed;
          velocity.y = -speed;
          break;
        case "SE":
            this.setAngle(90);
          velocity.x = speed;
          velocity.y = speed;
          break;
        case "SW":
            this.setAngle(180);
          velocity.x = -speed;
          velocity.y = speed;
          break;
      }
    }
    this.body.setVelocity(velocity.x, velocity.y);
  }

  getVelocityFromDirection(direction: string) {
    const speed = this.speed;
    let velocity = { x: 0, y: 0 };

    switch (direction) {
      case "up":
        velocity.y = -speed;
        break;
      case "down":
        velocity.y = speed;
        break;
      case "left":
        velocity.x = -speed;
        break;
      case "right":
        velocity.x = speed;
        break;
      case "NE":
        velocity.x = speed;
        velocity.y = -speed;
        break;
      case "NW":
        velocity.x = -speed;
        velocity.y = -speed;
        break;
      case "SE":
        velocity.x = speed;
        velocity.y = speed;
        break;
      case "SW":
        velocity.x = -speed;
        velocity.y = speed;
        break;
    }

    return velocity;
  }

  // Write your code here.

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
