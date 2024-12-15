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

  // TODO: make this global / const somewhere ?
  private directions = [
    { name: "right", start: 337.5, end: 22.5, diagonal: false },
    { name: "SE", start: 22.5, end: 67.5, diagonal: true },
    { name: "down", start: 67.5, end: 112.5, diagonal: false },
    { name: "SW", start: 112.5, end: 157.5, diagonal: true },
    { name: "left", start: 157.5, end: 202.5, diagonal: false },
    { name: "NW", start: 202.5, end: 247.5, diagonal: true },
    { name: "up", start: 247.5, end: 292.5, diagonal: false },
    { name: "NE", start: 292.5, end: 337.5, diagonal: true }
  ];

  fireDirection(aimX: number, aimY: number, speed?: number) {
    if (speed === undefined) {
      speed = this.speed;
    }

    // If aimX and aimY are both zero, do nothing
    if (aimX === 0 && aimY === 0) return;

    // Normalize the aim direction vector
    const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
    const normalizedX = aimX / magnitude;
    const normalizedY = aimY / magnitude;

    // Calculate the angle in degrees (0° is right, counter-clockwise positive)
    let angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI); // Radians to degrees
    const normalizedAngle = angle >= 0 ? angle : 360 + angle; // Normalize angle to [0, 360)

    // Determine if the direction is diagonal or straight

    let isDiagonal = false;
    for (const dir of this.directions) {
      if (normalizedAngle >= dir.start && normalizedAngle < dir.end) {
        isDiagonal = dir.diagonal;
        break;
      }
    }

    let bulletImageAngle = angle + 90
    // Set the appropriate frame based on diagonal/straight
    if (isDiagonal) {
      this.setFrame("bullet shot diagonal");
      bulletImageAngle -= 45;
    }
    
    // Set the bullet's rotation angle for visuals
    this.setAngle(bulletImageAngle); // Phaser's angle system is rotated by 90°

    // Set bullet velocity
    const velocityX = normalizedX * speed;
    const velocityY = normalizedY * speed;
    this.body.setVelocity(velocityX, velocityY);
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
