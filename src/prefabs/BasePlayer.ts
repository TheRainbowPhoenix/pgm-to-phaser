// You can write more code here

import { IGameObject } from "../interfaces/IGameObject";
import { BodyTypeLabel } from "../enums/BodyTypeLabel";
import { GameEvent } from "../enums/GameEvents";
import { emit, off, on } from "../utils/eventEmitterUtils";
import { destroyObject } from "../utils/gameobjectUtils";
import { DepthGroup } from "../enums/DepthGroup";
import { commonTimeLock, stopCompletely } from "../utils/gameUtils";
import { PlayerState } from "../types/PlayerState";
import { emitDustParticles } from './dustParticleEmitter';
import { ControllerEvent } from "../enums/ControllerEvent";

type CollideCallback = {
  bodyA: MatterJS.BodyType;
  bodyB: MatterJS.BodyType;
};

type TProps = {
  pos: Phaser.Math.Vector2;
  width: number;
  height: number;
  pathToFollow?: Phaser.Curves.Path;
};

export default class BasePlayer
  extends Phaser.GameObjects.Container
  implements IGameObject
{
  pos: Phaser.Math.Vector2;
  declare body: MatterJS.BodyType;
  bodyConstraint: MatterJS.BodyType;
  constraint: MatterJS.ConstraintType;
  width: number = 0;
  height: number = 0;
  proximityCircle: MatterJS.BodyType;
  groundDetector: MatterJS.BodyType;

  aboveHeadBody: MatterJS.BodyType;
  grabbedObject: IGameObject;
  bodyRadius = 35;
  container: Phaser.GameObjects.Container; // used for camera to follow
  grabbedObjectConstraint: MatterJS.ConstraintType;
  spineObject: SpineGameObject;
  spineOffset = new Phaser.Math.Vector2(0, 13);
  dustParticleOffset = new Phaser.Math.Vector2(0, 100);
  speed = 7;
  scale = 0.5;
  playerState: PlayerState;
  direction = 1;
  aimConstraintBone: spine.Bone;
  weaponBone: spine.Bone;
  aimBeamDistance = 500;
  startPos: Phaser.Math.Vector2;
  // bubble: SpeechBubble;
  attachedToPlatform: MatterJS.BodyType;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.pos = new Phaser.Math.Vector2(x, y);
    //   this.pathToFollow = pathToFollow;
    //   this.createBody(this.pos);
    //   this.initSpineObject(this.pos);
    //   this.listenForEvents();
  }

  protected createBody(pos: Phaser.Math.Vector2) {
    const startPosX = pos.x;
    const startPosY = pos.y;

	let hbHeight = 220;
	let hbWidth = 37;
    this.body = this.scene.matter.add.rectangle(startPosX-20, startPosY-100, hbWidth, hbHeight, {
		ignoreGravity: false,
      frictionAir: 0.03,
      label: BodyTypeLabel.player,
      mass: 5,
      friction: 1,
      frictionStatic: 0.1,
      restitution: 0,
      angle: 0, // Math.PI / 2
      chamfer: {
		radius: hbWidth/2
	  },
    });

    this.scene.matter.body.setInertia(this.body, Infinity); // prevent body from rotating

	this.groundDetector = this.scene.matter.add.rectangle(
		startPosX,
		startPosY + hbHeight,
		hbWidth,
		8,
		{
		  ignoreGravity: true, // TODO: added
		  isSensor: true,
		  label: BodyTypeLabel.proximity,
		}
	)

    this.proximityCircle = this.scene.matter.add.circle(
      startPosX,
      startPosY,
	  hbHeight/2 + 8,
      {
		ignoreGravity: true, // TODO: added
        isSensor: true,
		frictionAir: 0.03,
		mass: 5,
		friction: 1,
		frictionStatic: 0.1,
		restitution: 0,
        label: BodyTypeLabel.proximity,
      }
    );

    this.container = this.scene.add.container(startPosX, startPosY, []);
  }

  createAboveHeadBody(pos: Phaser.Math.Vector2) {
    this.aboveHeadBody = this.scene.matter.add.circle(pos.x, pos.y + this.bodyRadius, 2, { isSensor: true });
    const overHeadPoint = new Phaser.Math.Vector2(0, this.bodyRadius * -3);
    this.scene.matter.add.constraint(this.body, this.aboveHeadBody, 0, 1, {
      pointA: overHeadPoint,
    });
  }

  initSpineObject = (pos: Phaser.Math.Vector2) => {
    this.spineObject = this.scene.add
      .spine(pos.x, pos.y, 'hero', 'idle', true)
      .setDepth(DepthGroup.player)
      .setScale(this.scale)
      .setSkinByName('blue');

    this.spineObject.timeScale = 1.3;
    const skeleton = this.spineObject.skeleton;
    this.aimConstraintBone = skeleton.findBone('weapon-aim');
    this.weaponBone = skeleton.findBone('weapon-ik');
    // this.spineObject.setSkinByName(getEquippedSkinName());
  };

  update(time: number, delta: number) {
    if (this.state === 'idle') {
      this.addVelocityToBody();
    }

    // this.updateSpineObject();
    this.updateProximityCircle();
    this.updateGroundDetector();
    this.updateContainer();
    // this.updateGrabbedObject();
    // this.bubble?.update(time, delta);

    // updateAim(this.scene, this.aimConstraintBone);
  }

  updatePos() {
	this.updateProximityCircle();
	this.updateGroundDetector();
    this.updateContainer();
  }

  updateSpineObject() {
    const { x, y } = this.body.position;
    this.spineObject.setPosition(x + this.spineOffset.x, y + this.spineOffset.y);
  }

  setPlayerState(state: PlayerState) {
    if (!this.spineObject) return;
    if (this.state === state) return;
    this.state = state;
    switch (state) {
      case 'idle':
        this.spineObject.play('idle', true, true);
        break;
      case 'walk':
        this.spineObject.play('walk', true, true);
        break;
      case 'killed':
        this.playDead();
        break;
      default:
    }
  }

  isGrabbable() {
    return false;
  }

  destroy() {
    destroyObject(this.scene, this);
  }

  protected cameraFollow() {
    this.scene.cameras.main.startFollow(this.container, false, 0.1, 0.1);
    this.scene.cameras.main.setZoom(1);
    this.scene.cameras.main.setDeadzone(400, 200);
  }

  public isOnGround() {
    if (!this.body) return false;
    const allObjectsInProximity = this.scene.matter.intersectBody(this.groundDetector);
    for (let obj of allObjectsInProximity) {
      const other = <MatterJS.BodyType>obj;
      // TODO Improve check to be less manual labor
      if (
        other.label === BodyTypeLabel.collisionWall ||
        other.label === BodyTypeLabel.box ||
        // other.label === BodyTypeLabel.spinningBar ||
        other.label === BodyTypeLabel.platform
      ) {
		return true;
	  }
    }

    return false;
  }

  protected updateContainer() {
    const { x, y } = this.body.position;
    this.container.setX(x);
    this.container.setY(y);
  }

  protected updateProximityCircle() {
    const { x, y } = this.body.position;
    this.scene.matter.body.setPosition(
      this.proximityCircle,
      new Phaser.Math.Vector2(x, y),
      false
    );
  }

  protected updateGroundDetector() {
    const { x, y } = this.body.position;
    this.scene.matter.body.setPosition(
      this.groundDetector,
      new Phaser.Math.Vector2(x, y + 115),
      false
    );

  }

  protected setDirection(direction: number) {
    if (!this.spineObject) return;
    if (direction === this.direction) return;
    this.spineObject.setScale(this.scale * direction, this.spineObject.scaleY);
    this.direction = direction;
  }

  private onMove = ({ velocity }: { velocity: Phaser.Math.Vector2 }) => {
    if (this.state === "killed") return;
    if (velocity.x !== 0) {
      this.setPlayerState("walk");
      if (this.isOnGround()) {
        emitDustParticles(
          this.scene,
          this.body.position.x,
          this.body.position.y + this.dustParticleOffset.y
        );
      }
      let velocityX = velocity.x * this.speed;

      // TODO  also check if actually on top of platform (not below or on the sides)
      if (this.attachedToPlatform) {
        const velocityMultiplier =
          Math.sign(this.attachedToPlatform.velocity.x) ==
          Math.sign(this.body.velocity.x)
            ? 0.5
            : 1.5;
        velocityX += this.attachedToPlatform.velocity.x * velocityMultiplier;
      }
      this.scene.matter.setVelocity(this.body, velocityX, this.body.velocity.y);
      this.setDirection(velocity.x > 0 ? 1 : -1);
    } else {
      this.setPlayerState("idle");
    }
  };

  private onJump = () => {
	console.log("onJump")
    // if (!this.isOnGround() || this.state === "killed") return;
    this.scene.matter.setVelocity(this.body, this.body.velocity.x, -30);
    if (this.grabbedObject) {
      this.scene.matter.setVelocity(
        this.grabbedObject.body,
        this.body.velocity.x,
        -30
      );
    }
    this.setPlayerState("jump");
  };

  private onAction = () => {
	console.debug("onAction")
    // if (this.grabbedObject) return this.throwGrabbedObject();
    // const grabbedObject = grabItemInProximity(this.scene, this.proximityCircle);
    // if (!grabbedObject?.body) return;
    // this.grabbedObject = grabbedObject;
    // this.scene.matter.body.setPosition(
    //   this.grabbedObject.body,
    //   new Phaser.Math.Vector2(this.aboveHeadBody.position.x, this.aboveHeadBody.position.y),
    //   false
    // );
    // this.scene.matter.body.setAngle(this.grabbedObject.body, 0, false);
    // this.scene.matter.body.setInertia(this.body, Infinity); // prevent body from rotating
    // this.grabbedObjectConstraint = this.scene.matter.add.constraint(this.aboveHeadBody, this.grabbedObject.body, 0, 50);
  };

  private onShoot = ({ pos }: { pos: Phaser.Math.Vector2 }) => {
	console.debug("onShoot")
    // if (!this.scene.game.scene.isActive(SceneKey.Level)) return; // don't do action if scene is paused
    // const x = this.weaponBone.worldX + this.scene.cameras.main.scrollX;
    // const y = -this.weaponBone.worldY + this.scene.cameras.main.height + this.scene.cameras.main.scrollY; // spine y coordinates are opposite of Phaser's

    // // Make up for scrollX and scrollY since the InputScene doesn't support that
    // const aimedPos = new Phaser.Math.Vector2(
    //   pos.x + this.scene.cameras.main.scrollX,
    //   pos.y + this.scene.cameras.main.scrollY
    // );
    // const startPos = new Phaser.Math.Vector2(x, y);
    // const maxDist = this.aimBeamDistance;
    // const direction = aimedPos.clone().subtract(startPos).normalize();
    // let endPos = new Phaser.Math.Vector2(direction.x * maxDist, direction.y * maxDist).add(startPos);

    // const closestBody = getClosestBody(this.scene, startPos, endPos);

    // emit(GameEvent.timeLock, { body: closestBody });
    // playLaserBeam();
    // if (closestBody === this.grabbedObject?.body) this.releaseGrabbedObject();

    // // TODO (johnedvard) Add some particle effects to the endPos if we found a body
    // endPos = getClosestEndPos(closestBody, startPos, endPos, direction);

    // startActionRoutine(this.scene, startPos, endPos);
  };

  async playDead() {
    this.spineObject.play('killed');
    this.body.isStatic = true;
    this.body.isSensor = true;
	console.error("dead player")
    // playDeadSound();
    // await startKilledRoutine(this.scene, { pos: new Phaser.Math.Vector2(this.body.position.x, this.body.position.y) });
    emit(GameEvent.restartLevel);
  }

  addVelocityToBody() {
    // TODO Only add velocity to body (player) if it's above the platform
    if (this.attachedToPlatform) {
      let platformSpeed = this.attachedToPlatform.velocity.x + this.attachedToPlatform.velocity.x / 25;
      this.scene.matter.setVelocityX(this.body, platformSpeed); // make player follow moving platform
    }
  }

  onKilled = async () => {
    this.setPlayerState('killed');
  };

  protected listenForEvents() {
    // TODO (johnedvard) handle player input events in a different file
    on(ControllerEvent.move, this.onMove);
    on(ControllerEvent.jump, this.onJump);
    on(ControllerEvent.shoot, this.onShoot);
    on(ControllerEvent.action, this.onAction);
    // on(GameEvent.changeSkin, this.onSkinChanged);
    on(GameEvent.kill, this.onKilled);
    // on(GameEvent.onPlatform, this.onAttachedTo);
    // on(GameEvent.offPlatform, this.onAttachedTo);
  }
  stopListeningForEvents() {
    off(ControllerEvent.move, this.onMove);
    off(ControllerEvent.jump, this.onJump);
    off(ControllerEvent.shoot, this.onShoot);
    off(ControllerEvent.action, this.onAction);
    // off(GameEvent.changeSkin, this.onSkinChanged);
    off(GameEvent.kill, this.onKilled);
    // off(GameEvent.onPlatform, this.onAttachedTo);
    // off(GameEvent.offPlatform, this.onAttachedTo);
  }
}
