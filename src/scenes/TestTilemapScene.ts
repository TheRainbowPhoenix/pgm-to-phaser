// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import Velonia from "../prefabs/Velonia";
import GameUI from "../prefabs/GameUI";
/* START-USER-IMPORTS */
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

		// bgLayer
		const bgLayer = map.createLayer("layer4", ["stage03","stage04","stage01"], 0, 0)!;

		// collideLayer
		const collideLayer = map.createLayer("layer3", ["stage01"], 0, 0)!;

		// player
		const player = new Velonia(this, 352, 592);
		this.add.existing(player);

		// uiLayer
		const uiLayer = this.add.layer();

		// levelMap
		const levelMap = this.add.sprite(1120, 176, "MAP_Lv1_bridge_1", "MAP_1b_request_crew.png");
		levelMap.setOrigin(1, 0.5);
		uiLayer.add(levelMap);

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
		this.levelMap = levelMap;
		this.gameUI = gameUI;
		this.uiLayer = uiLayer;
		this.map = map;
		this.spaceKey = spaceKey;
		this.leftKey = leftKey;
		this.rightKey = rightKey;
		this.upKey = upKey;
		this.downKey = downKey;
		this.interactKey = interactKey;
		this.items = items;
		this.enemies = enemies;

		this.events.emit("scene-awake");
	}

	private bgLayer!: Phaser.Tilemaps.TilemapLayer;
	private collideLayer!: Phaser.Tilemaps.TilemapLayer;
	private player!: Velonia;
	private levelMap!: Phaser.GameObjects.Sprite;
	public gameUI!: GameUI;
	private uiLayer!: Phaser.GameObjects.Layer;
	private map!: Phaser.Tilemaps.Tilemap;
	private spaceKey!: Phaser.Input.Keyboard.Key;
	private leftKey!: Phaser.Input.Keyboard.Key;
	private rightKey!: Phaser.Input.Keyboard.Key;
	private upKey!: Phaser.Input.Keyboard.Key;
	private downKey!: Phaser.Input.Keyboard.Key;
	private interactKey!: Phaser.Input.Keyboard.Key;
	private items!: Array<any>;
	private enemies!: Array<any>;

	/* START-USER-CODE */

  protected lastDir: number = 0;
  protected animatedTiles: any[] = [];
  protected boxTriggerGroup: Phaser.Physics.Arcade.StaticGroup;
  protected inInteraction: boolean = false;
  private activeTrigger: any;
  private mapShown: boolean = false;
  private debugGraphics: any;
  // Write your code here

  create() {
    this.editorCreate();

    this.initColliders();

    this.initUI();

    this.initAnimations();

    this.initCamera();
  }

  initCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.bgLayer.width, this.bgLayer.height);

    cam.startFollow(this.player, false, 1, 1);
    cam.setDeadzone(100, 150);
    // cam.setZoom(2);
  }

  update(time: number, delta: number) {
    this.movePlayer();

    this.handleAnimateTiles(this, delta);

    this.handleInteractions();

    // fix camera position
    // const cam = this.cameras.main;

    // camera X follows the player
    // cam.scrollX = Math.floor(this.player.x - cam.width / 2);

    // cameras Y moves to a sector of the world
    // const row = Math.floor(this.player.y / cam.height);
    // cam.scrollY = row * cam.height;
  }

  movePlayer() {
    if (this.player.hurtFlag) {
      return;
    }
    this.player.body.setVelocity(0);

    const body = this.player.getBody();

    const jumpDown = this.upKey.isDown || this.spaceKey.isDown; // || this.controllerJump.isDown;
    const upDown = this.upKey.isDown; // || this.controllerLeft.isDown;
    const downDown = this.downKey.isDown; // || this.controllerLeft.isDown;
    const leftDown = this.leftKey.isDown; // || this.controllerLeft.isDown;
    const rightDown = this.rightKey.isDown; // || this.controllerRight.isDown;

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

    if (upDown && downDown) {
      // ignore
    } else if (upDown) {
      yDir = -1;
    } else if (downDown) {
      yDir = 1;
    }

    if (leftDown && rightDown) {
      // ignore
    } else if (rightDown) {
      xDir = 1;
    } else if (leftDown) {
      xDir = -1;
    }

    let playerDirection = "right";

    //       -1
    // -11  . . .  +9
    // -10  . 0 .  +10
    // -9   . . .  +11
    //        1
    let currentDir = xDir * 10 + yDir;

    if (currentDir == 0) {
      currentDir = this.lastDir;
    }

    switch (currentDir) {
      case 11:
        playerDirection = "SE";
        break;
      case 10:
        playerDirection = "right";
        break;
      case 9:
        playerDirection = "NE";
        break;

      case 1:
        playerDirection = "down";
        break;
      case -1:
        playerDirection = "up";
        break;

      case -9:
        playerDirection = "SW";
        break;
      case -10:
        playerDirection = "left";
        break;
      case -11:
        playerDirection = "NW";
        break;
      default:
        playerDirection = "right";
    }

    if (xDir == 0 && yDir == 0) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.play(`player/idle/player-${playerDirection}-idle`, true);
    } else {
      this.player.body.setVelocityX(xDir * 100);
      this.player.body.setVelocityY(yDir * 100);
      this.player.play(`player/walk/player-${playerDirection}-walk`, true);
    }
    this.player.body.velocity.normalize().scale(100);

    this.lastDir = currentDir;
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

          this.physics.add.overlap(
            this.player,
            boxTrigger,
            this.showDialog as any,
            undefined,
            this
          );
        }
      }
    }

    // this.interactKey.addListener
    // this.input.keyboard.on('keydown-E', this.handleDialogConfirm, this);

    // this.physics.add.overlap(
    // 	player,
    // 	items,
    // 	this.pickItem,
    // 	undefined,
    // 	this
    //   );
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

  handleInteractions() {
    // Check if player is no longer overlapping any trigger
    if (
      this.activeTrigger &&
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.activeTrigger.getBounds()
      )
    ) {
      this.hideDialog();
    }
  }

  showDialog(player: Velonia, trigger: Phaser.Physics.Arcade.Sprite) {
    if (this.activeTrigger !== trigger) {
      // dialogText.setText(trigger.trigger_name);
      // dialogText.setVisible(true);
      let trigger_name = (trigger as any).trigger_name;

      switch (trigger_name) {
        case "map_view":
          this.showLevelMap();
          break;
        case "door_open":
          this.openDoor();
          break;
        default:
          this.gameUI.displayMessage(`showDialog! ${trigger_name}`);
          console.log("showDialog", trigger_name);
      }

      this.activeTrigger = trigger;
    }
  }

  hideDialog() {
    console.log("hideDialog");
    // dialogText.setVisible(false);
    if (this.activeTrigger) {
      let trigger_name = (this.activeTrigger as any).trigger_name;
      switch (trigger_name) {
        case "map_view":
          this.hideLevelMap();
          break;
        case "door_open":
          this.closeDoor();
          break;
        default:
          console.log("hideDialog", trigger_name);
      }

      this.activeTrigger = null;
    }
  }

  showLevelMap() {
    if (!this.mapShown) {
      // TODO: swap the content according to the level

      this.tweens.add({
        targets: this.levelMap,
        x: 660, // Final position
        duration: 500,
        ease: "Elastic",
        easeParams: [0.1, 1.5], // Adjust for more elasticity
      });
      this.mapShown = true;
    }
  }

  hideLevelMap() {
    if (this.mapShown) {
      this.tweens.add({
        targets: this.levelMap,
        x: 800 + 320, // Off-screen to the right
        duration: 500,
        ease: "Power2",
      });
      this.mapShown = false;
    }
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
