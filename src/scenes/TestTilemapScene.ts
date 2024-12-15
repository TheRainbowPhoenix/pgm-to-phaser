// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import Velonia from "../prefabs/Velonia";
import GameUI from "../prefabs/GameUI";
/* START-USER-IMPORTS */
import Bullet from "../prefabs/Bullet";
/* END-USER-IMPORTS */

export default class TestTilemapScene extends Phaser.Scene {

	constructor() {
		super("TestTilemapScene");

		/* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// map
		const map = this.add.tilemap("bridge0");
		map.addTilesetImage("stage01", "stage01");
		map.addTilesetImage("stage02", "stage02");
		map.addTilesetImage("stage03", "stage03");
		map.addTilesetImage("stage04", "stage04");
		map.addTilesetImage("window01", "window01");

		// spaceKey
		const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// leftKey
		const leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

		// rightKey
		const rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		// upKey
		const upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		// downKey
		const downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

		// interactKey
		const interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

		// fireKey
		const fireKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);

		// bgLayer
		const bgLayer = map.createLayer("layer4", ["stage03","stage04","stage01"], 0, 0)!;

		// collideLayer
		const collideLayer = map.createLayer("layer3", ["stage01"], 0, 0)!;

		// player
		const player = new Velonia(this, 352, 592);
		this.add.existing(player);

		// uiLayer
		const uiLayer = this.add.layer();

		// tiledUI
		const tiledUI = map.createLayer("layer1", ["window01"], 0, 0)!;
		uiLayer.add(tiledUI);

		// gameUI
		const gameUI = new GameUI(this);
		uiLayer.add(gameUI);

		// lists
		const items: Array<any> = [];
		const enemies: Array<any> = [];

		// colliderPlayerVsLayer
		const colliderPlayerVsLayer = this.physics.add.collider(player, collideLayer);

		// colliderEnemiesVsLayer
		const colliderEnemiesVsLayer = this.physics.add.collider(enemies, collideLayer);

		// overlapPlayerVsItems
		const overlapPlayerVsItems = this.physics.add.overlap(player, items, this.pickItem, undefined, this);

		// overlapPlayerVsEnemies
		const overlapPlayerVsEnemies = this.physics.add.overlap(player, enemies, undefined, this.checkAgainstEnemies);

		this.bgLayer = bgLayer;
		this.collideLayer = collideLayer;
		this.player = player;
		this.gameUI = gameUI;
		this.uiLayer = uiLayer;
		this.map = map;
		this.spaceKey = spaceKey;
		this.leftKey = leftKey;
		this.rightKey = rightKey;
		this.upKey = upKey;
		this.downKey = downKey;
		this.interactKey = interactKey;
		this.fireKey = fireKey;
		this.items = items;
		this.enemies = enemies;

		this.events.emit("scene-awake");
	}

	private bgLayer!: Phaser.Tilemaps.TilemapLayer;
	private collideLayer!: Phaser.Tilemaps.TilemapLayer;
	private player!: Velonia;
	public gameUI!: GameUI;
	private uiLayer!: Phaser.GameObjects.Layer;
	private map!: Phaser.Tilemaps.Tilemap;
	private spaceKey!: Phaser.Input.Keyboard.Key;
	private leftKey!: Phaser.Input.Keyboard.Key;
	private rightKey!: Phaser.Input.Keyboard.Key;
	private upKey!: Phaser.Input.Keyboard.Key;
	private downKey!: Phaser.Input.Keyboard.Key;
	private interactKey!: Phaser.Input.Keyboard.Key;
	private fireKey!: Phaser.Input.Keyboard.Key;
	private items!: Array<any>;
	private enemies!: Array<any>;

	/* START-USER-CODE */

  private player_speed: number = 150;
  private gamepad?: Phaser.Input.Gamepad.Gamepad;

  protected lastDir: string = "right";
  protected animatedTiles: any[] = [];
  protected boxTriggerGroup: Phaser.Physics.Arcade.StaticGroup;
  protected inUINavigation: boolean = false;
  private activeTrigger: any;
  private debugGraphics: any;

  private callingElevator: boolean = false;
  private elevatorCounter: number = 0;
  private elevatorDuration: number = 0;
  // Write your code here

  private bullets: Phaser.Physics.Arcade.Group;
  private lastFiredBullet: number = 0;

  create() {
    this.editorCreate();

    this.initColliders();

    this.initUI();

    this.initAnimations();

    this.initCamera();

    this.initBullets();

    this.initControls();
  }

  initCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.bgLayer.width, this.bgLayer.height);

    cam.startFollow(this.player.sprite.body, false, 1, 1);
    cam.setDeadzone(100, 150);
    // cam.setZoom(2);
  }

  initBullets() {
    // Create bullets group
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });

    this.physics.world.on('worldbounds', (body: any) => {
      if (body.gameObject instanceof Bullet) {
          body.gameObject.destroy();
      }
    });

  }

  initControls() {
    console.log(this.input.gamepad)
    if (!this.input.gamepad || this.input.gamepad.total === 0) {
      return;
    }

    const pads = this.input.gamepad.gamepads;
    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];

      if (!pad) {
        continue;
      }
      // TODO: add select logic for gamepads in setting
      this.gamepad = pad;
      break
    }
  }

  fireBullet() {
    const currentTime = this.time.now;
    if (currentTime - this.lastFiredBullet > 300) {
      this.player.numberCount
        const direction = this.getPlayerDirection(this.lastDir); // TODO: fix this ::
        // TODO: directions fix for fire offset
        const bullet = new Bullet(this, this.player.x + this.player.collider.x, this.player.y+ this.player.collider.y);

        this.bullets.add(bullet);
        this.physics.add.collider(this.collideLayer, bullet, (bullet, layer) => {
            // TODO: play animation of bullet hit 
            bullet.destroy();
        });
        this.add.existing(bullet);

        bullet.fireDirection(direction);
        // TODO: play light on player after fire

        this.lastFiredBullet = currentTime;
    }

  }

  override update(time: number, delta: number) {
    super.update(time, delta);

    // should refresh the IO and stuff
    this._fetchGamepad()

    if (!this.inUINavigation) {
      this.movePlayer();
      this.handleInteractions();
    }

    this.handleAnimateTiles(this, delta);

    this.handleElevator(delta);


    // fix camera position
    // const cam = this.cameras.main;

    // camera X follows the player
    // cam.scrollX = Math.floor(this.player.x - cam.width / 2);

    // cameras Y moves to a sector of the world
    // const row = Math.floor(this.player.y / cam.height);
    // cam.scrollY = row * cam.height;
  }

  handleElevator(delta: number) {
    if (this.callingElevator) {
      this.elevatorCounter += delta;
      let progress = Phaser.Math.Clamp(this.elevatorCounter / 5000, 0, 1) * 100;

      if (progress >= 99) {
        this.player.hideCount();
        this.gameUI.showElevatorMenu();
        this.callingElevator = false;
      } else {
        this.player.setCount(Math.min(progress | 0, 99));
      }
    }

  }

  getPlayerDirection(xDir: number, yDir: number, defaultDir: string) {
    let playerDirection = "right"; // Default direction

    // Normalize diagonal movement
    if (xDir !== 0 || yDir !== 0) {
      const magnitude = Math.sqrt(xDir * xDir + yDir * yDir);
      xDir /= magnitude;
      yDir /= magnitude;

      // Calculate angle in degrees (0° is right, counter-clockwise positive)
      const angle = Math.atan2(yDir, xDir) * (180 / Math.PI); // Convert radians to degrees
      const normalizedAngle = angle >= 0 ? angle : 360 + angle; // Normalize angle to [0, 360)

      // Map angle to one of the 8 directions
      const directions = [
        { name: "right", start: 337.5, end: 22.5 },
        { name: "SE", start: 22.5, end: 67.5 },
        { name: "down", start: 67.5, end: 112.5 },
        { name: "SW", start: 112.5, end: 157.5 },
        { name: "left", start: 157.5, end: 202.5 },
        { name: "NW", start: 202.5, end: 247.5 },
        { name: "up", start: 247.5, end: 292.5 },
        { name: "NE", start: 292.5, end: 337.5 }
      ];

      // Determine player direction (quantize to 8 directions)
      //       -1
      // -11  . . .  +9
      // -10  . 0 .  +10
      // -9   . . .  +11
      //        1

      for (const dir of directions) {
        if (normalizedAngle >= dir.start && normalizedAngle < dir.end) {
          playerDirection = dir.name;
          break;
        }
      }
    } else {
      playerDirection = this.lastDir;
    }

    return playerDirection
  }

  roundToStep (value: number, step: number) {
    return Math.sign(value) * Math.floor(Math.abs(value) / step) * step;
  } 

  _fetchGamepad() {
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      if (!this.gamepad) {
        this.gamepad = this.input.gamepad.getAll().find(g => g !== undefined && g !== null);
      }
    }
    return this.gamepad
  }

  movePlayer() {
    if (this.player.hurtFlag) {
      return;
    }

    const body = this.player.getBody();
    body.setVelocity(0);

    // Get keyboard inputs
    const upDown = this.upKey.isDown; // || this.controllerLeft.isDown;
    const downDown = this.downKey.isDown; // || this.controllerLeft.isDown;
    const leftDown = this.leftKey.isDown; // || this.controllerLeft.isDown;
    const rightDown = this.rightKey.isDown; // || this.controllerRight.isDown;

    const jumpDown = this.upKey.isDown || this.spaceKey.isDown; // || this.controllerJump.isDown;

    // if (jumpDown && body.onFloor()) {
    // 	this.player.body.velocity.y = -170;
    // }

    // var vel = 150;

    // direction is :
    //      +1
    //     . . .
    // -1  . 0 .  +1  (10)
    //     . . .
    //      -1

    let yDir = 0;
    let xDir = 0;

    if (this.gamepad) {
      const joystickX = this.gamepad.axes[0].value || 0; // Joystick x-axis value (-1 to 1)
      const joystickY = this.gamepad.axes[1].value || 0; // Joystick y-axis value (-1 to 1)


      if (Math.abs(joystickX) > 0.05 || Math.abs(joystickY) > 0.05) {
        xDir = this.roundToStep(joystickX, 0.05); // Use joystick input
        yDir = this.roundToStep(joystickY, 0.05);
      }
    }

    

    // keyboard velocity Y
    if (upDown && downDown) {
      // ignore
    } else if (upDown) {
      yDir = -1;
    } else if (downDown) {
      yDir = 1;
    }

    // keyboard velocity X
    if (leftDown && rightDown) {
      // ignore
    } else if (rightDown) {
      xDir = 1;
    } else if (leftDown) {
      xDir = -1;
    }

    const playerDirection = this.getPlayerDirection(xDir, yDir, this.lastDir);

    // Set velocity and play animations
    if (xDir === 0 && yDir === 0) {
      this.player.body.setVelocity(0);
      this.player.play(`player/idle/player-${playerDirection}-idle`, true);
    } else {
      this.player.body.setVelocityX(xDir * this.player_speed);
      this.player.body.setVelocityY(yDir * this.player_speed);
      this.player.play(`player/walk/player-${playerDirection}-walk`, true);
    }

    // Clamp speed to player speed
    this.player.body.velocity.normalize().scale(this.player_speed);

    this.lastDir = playerDirection;
  }



  initUI() {
    this.uiLayer.getChildren().forEach((elem: any) => {
      elem.setScrollFactor(0, 0);
    });
    this.uiLayer.setDepth(90);
  }

  initAnimations() {
    this.map.tilesets.forEach(({ tileData, firstgid }) => {
      for (let tileid in tileData) {
        this.map.layers.forEach((layer) => {
          //first check in any of the layers
          layer.data.forEach((tileRow) => {
            tileRow.forEach((tile) => {
              if (tile.index - firstgid === parseInt(tileid)) {
                //In case there is any, add it to the empty array that we created at the beginning
                this.animatedTiles.push({
                  tile,
                  tileAnimationData: (tileData as any)[tileid].animation,
                  firstgid: firstgid,
                  elapsedTime: 0,
                });
              }
            });
          });
        });
      }
    });
  }

  debugCollider() {
    // @ts-ignore
    if (__DEBUG__) {

      if (this.debugGraphics) {
        this.debugGraphics.clear();
      }
      this.debugGraphics = this.add.graphics().setAlpha(0.75);
      this.collideLayer.renderDebug(this.debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    }
  }

  initColliders() {
    this.collideLayer.setCollisionBetween(1, 1600, true, false);
    this.physics.add.collider(this.collideLayer, this.player);

    this.bgLayer.setCollisionByProperty({ interact: 2 });

    this.debugCollider();

    const spawnPoint = this.map.findObject(
      "Interacts",
      (obj) => obj.name === "spawn"
    );
    if (spawnPoint?.x && spawnPoint?.y) {
      this.player.setPosition(spawnPoint?.x, spawnPoint?.y);
    }

    this.boxTriggerGroup = this.physics.add.staticGroup();

    const boxTriggers = this.map.filterObjects(
      "Interacts",
      (o: any) => o.rectangle
    );
    if (boxTriggers) {
      for (const trigger of boxTriggers) {
        console.log(trigger);
        if (
          trigger.x !== undefined &&
          trigger.y !== undefined &&
          trigger.width !== undefined &&
          trigger.height !== undefined
        ) {
			console.log(trigger);
          const trg_x = trigger.x + trigger.width / 2;
          const trg_y = trigger.y + trigger.height / 2;
          const boxTrigger = this.boxTriggerGroup.create(trg_x, trg_y);
          boxTrigger.width = trigger.width;
          boxTrigger.height = trigger.height;
		  boxTrigger.body.width = trigger.width;
		  boxTrigger.body.height = trigger.height;
		  boxTrigger.body.x = trigger.x;
		  boxTrigger.body.y = trigger.y;

          boxTrigger.setDisplaySize(trigger.width, trigger.height);
          boxTrigger.visible = false;
          boxTrigger.trigger_name = trigger.name;

          console.log(this.physics.add.overlap);

          this.physics.add.overlap(
            this.player.sprite,
            boxTrigger,
            this.doBoxTrigger as any,
            undefined,
            this
          );
        }
      }
    }

    // this.input.keyboard.on('keydown-E', this.handleDialogConfirm, this);

    // this.physics.add.overlap(
    // 	player,
    // 	items,
    // 	this.pickItem,
    // 	undefined,
    // 	this
    //   );
  }

  handleDialogConfirm(e: any) {
    console.log(e);
  }

  /**
   * @param {Velonia} player
   * @param {Phaser.GameObjects.Sprite} enemy
   */
  checkAgainstEnemies(player: Velonia, enemy: Phaser.GameObjects.Sprite) {
    if (
      player.y + player.body.height * 0.5 < enemy.y &&
      player.body.velocity.y > 0
    ) {
      // this.add.existing(new EnemyDeath(this, enemy.x, enemy.y));

      enemy.destroy();

      // player.body.velocity.y = -200;
    } else {
      this.player.hurtPlayer();
    }
  }

  checkAgainstTrigger(player: Velonia, trigger: Phaser.GameObjects.Sprite) {
    // console.log(trigger.body.touching.none);
  }

  /**
   * @param {Velonia} player
   * @param {Phaser.GameObjects.Sprite} item
   */
  pickItem(player: Velonia, item: Phaser.GameObjects.Sprite) {
    // this.add.existing(new FeedbackItem(this, item.x, item.y));

    item.destroy();
  }

  toggleBreathingEffect() {
    if (!this.inUINavigation) {
      // if (this.player.breathIn) {
      //   this.player.breathIn = false;
      //   this.player.sprite.y = this.player.collider.y + 1
      // } else {
      //   this.player.breathIn = true;
      //   this.player.sprite.y = this.player.collider.y - 1
      // }
    }
  }

  handleInteractions() {
    let isFire = this.fireKey.isDown
    let isInteract = this.interactKey.isDown
    if (this.gamepad) {
      if (this.gamepad.buttons[5].pressed) { // R1, todo - mapping custom ?
        isFire = true
      }
      if (this.gamepad.buttons[0].pressed) {
        isInteract = true
      }
    } 

    // Check if player is no longer overlapping any trigger
    if (
      this.activeTrigger &&
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.collider.getBounds(),
        this.activeTrigger.getBounds()
        // this.activeTrigger.getBounds()
      )
    ) {
      console.log(this.activeTrigger.body, this.activeTrigger.getBounds());
      this.endBoxTrigger();
    }

    if (isInteract && this.gameUI.isDialogVisible) {
      this.gameUI.dismissDialog();
    }

    
    // Handle fire and actions keys
    if(isFire) {
      this.fireBullet();
    }
  }

  doBoxTrigger(player: Velonia, trigger: Phaser.Physics.Arcade.Sprite) {
    if (this.activeTrigger !== trigger) {
      // dialogText.setText(trigger.trigger_name);
      // dialogText.setVisible(true);
      let trigger_name = (trigger as any).trigger_name;

      switch (trigger_name) {
        case "map_view":
          this.gameUI.showLevelMap();
          break;
        case "door_open":
          this.openDoor();
          break;
        case "comm_view":
          this.gameUI.showDialog(`comm_view`, false);
          break;
        case "elevator":
          this.callElevator();
          // this.gameUI.showElevatorMenu();
          break;
        default:
          this.gameUI.displayMessage(`doBoxTrigger! ${trigger_name}`);
          console.log("doBoxTrigger", trigger_name);
      }

      // @ts-ignore
      trigger.bounds = new Phaser.Geom.Rectangle(trigger.x, trigger.y, trigger.width, trigger.height);
      this.activeTrigger = trigger;
    }
  }

  endBoxTrigger() {
    console.log("endBoxTrigger");
    // dialogText.setVisible(false);
    if (this.activeTrigger) {
      let trigger_name = (this.activeTrigger as any).trigger_name;
      switch (trigger_name) {
        case "map_view":
          this.gameUI.hideLevelMap();
          break;
        case "door_open":
          this.closeDoor();
          break;
        case "elevator":
          this.dismissElevator();
          // this.gameUI.hideElevatorMenu();
          break;
        default:
          console.log("endBoxTrigger", trigger_name);
      }

      this.activeTrigger = null;
    }
  }


  callElevator() {
    console.log("callElevator");

    if (!this.callingElevator) {
      this.callingElevator = true;
      this.elevatorCounter = 0;
    }
  }

  dismissElevator() {
    console.log("dismissElevator");

    this.callingElevator = false;
    this.elevatorCounter = 0;
    this.elevatorDuration = 0;
    this.gameUI.hideElevatorMenu();
    // this.player.setCount(0);
    this.player.hideCount();

  }


  closeDoor() {
    for (let y = 30; y <= 31; y++) {
      for (let x = 55; x <= 57; x++) {
        this.collideLayer.putTileAt(1598, x, y);
      }
    }

    const newDoor = [
      4497, 4498, 4499, 4500, 4501, 4502, 4503, 4504, 4537, 4538, 4539, 4540,
      4541, 4542, 4543, 4544, 4577, 4578, 4579, 4580, 4581, 4582, 4583, 4584,
      4617, 4618, 4619, 4620, 4621, 4622, 4623, 4624, 4657, 4658, 4659, 4660,
      4661, 4662, 4663, 4664, 4697, 4698, 4699, 4700, 4701, 4702, 4703, 4704,
      3287, 3288, 3289, 3290, 3291, 3292, 3293, 3294,
    ];

    // from 52,27 to 59,32
    const startX = 52;
    const startY = 27;
    const endX = 59;
    const endY = 32;

    // Track the index of the newDoor array
    let tileIndex = 0;

    // Place new tiles
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (tileIndex < newDoor.length) {
          this.bgLayer.putTileAt(newDoor[tileIndex], x, y);
          tileIndex++;
        }
      }
    }

    this.debugCollider();
  }

  openDoor() {
    for (let y = 30; y <= 31; y++) {
      for (let x = 55; x <= 57; x++) {
        this.collideLayer.removeTileAt(x, y);
      }
    }

    const newDoor = [
      4507, 4508, 4509, 4510, 4511, 4512, 4513, 4514, 4547, 4548, 4549, 4550,
      4551, 4552, 4553, 4554, 4587, 4588, 4589, 4590, 4591, 4592, 4593, 4594,
      4627, 4628, 4629, 4630, 4631, 4632, 4633, 4634, 4667, 4668, 4669, 4670,
      4671, 4672, 4673, 4674, 4707, 4708, 4709, 4710, 4711, 4712, 4713, 4714,
    ];

    // from 52,27 to 59,32
    const startX = 52;
    const startY = 27;
    const endX = 59;
    const endY = 32;

    // Track the index of the newDoor array
    let tileIndex = 0;

    // Place new tiles
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (tileIndex < newDoor.length) {
          this.bgLayer.putTileAt(newDoor[tileIndex], x, y);
          tileIndex++;
        }
      }
    }

    this.debugCollider();
  }

  handleAnimateTiles(scene: Phaser.Scene, delta: number) {
    this.animatedTiles.forEach((tile) => {
      //If there is no animated tile, don't run the code
      if (!tile.tileAnimationData) return;
      //Get the total animation duration of each tile
      let animationDuration =
        tile.tileAnimationData[0].duration * tile.tileAnimationData.length;
      //Check the elapsed time on your game scene since its started running each frame
      tile.elapsedTime += delta;
      tile.elapsedTime %= animationDuration;
      const animatonFrameIndex = Math.floor(
        tile.elapsedTime / tile.tileAnimationData[0].duration
      );
      //Change the tile index for the next one on the list
      tile.tile.index =
        tile.tileAnimationData[animatonFrameIndex].tileid + tile.firstgid;
    });
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
