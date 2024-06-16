// You can write more code here

import { IGameObject } from "../interfaces/IGameObject";
import { BodyTypeLabel } from "../enums/BodyTypeLabel";
import { GameEvent } from "../enums/GameEvents";
import { emit, off, on } from "../utils/eventEmitterUtils";
import { destroyObject } from "../utils/gameobjectUtils";
import { DepthGroup } from "../enums/DepthGroup";
import { commonTimeLock, stopCompletely } from "../utils/gameUtils";

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
  
  export default class BasePlatform extends Phaser.GameObjects.Container implements IGameObject {
	pos: Phaser.Math.Vector2;
	declare body: MatterJS.BodyType;
	bodyConstraint: MatterJS.BodyType;
	constraint: MatterJS.ConstraintType;
	spineObject: SpineGameObject;
	width: number = 0;
	height: number = 0;
	pathToFollow?: Phaser.Curves.Path;
	timeAlive = 0;
  
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
  
	  this.bodyConstraint = this.scene.matter.add.circle(startPosX + this.width / 2, startPosY + this.height / 2, 10, {
		isSensor: true,
		isStatic: true,
		label: BodyTypeLabel.constraint,
		angle: this.angle
	  });
  
	  this.body = this.scene.matter.add.rectangle(startPosX, startPosY, this.width, this.height, {
		label: BodyTypeLabel.platform,
		friction: 1,
		frictionStatic: 1,
		restitution: 0.2,
		mass: 10,
		angle: this.angle
	  });
  
	  this.body.onCollideActiveCallback = ({ bodyA, bodyB }: CollideCallback) => {
		if (bodyB?.label === BodyTypeLabel.player) {
		  emit(GameEvent.onPlatform, { body: bodyA });
		}
	  };
	  this.body.onCollideEndCallback = ({ bodyA, bodyB }: CollideCallback) => {
		if (bodyB?.label === BodyTypeLabel.player) {
		  emit(GameEvent.offPlatform, { body: null });
		}
	  };
	  this.body.onCollideCallback = ({ bodyA, bodyB }: CollideCallback) => {
		if (bodyB?.label === BodyTypeLabel.player) {
		  if (Math.abs(bodyB.speed) >= 20) {
			// TODO  Maybe change scale of object based on speed within inpact and add a bouncy-ish juicy effect
		  }
		}
	  };
  
	  this.scene.matter.body.setInertia(this.body, Infinity); // prevent body from rotating
  
	  this.constraint = this.scene.matter.add.constraint(this.body, this.bodyConstraint, 0, 1);
	}
	private initSpineObject(pos: Phaser.Math.Vector2) {
	  this.spineObject = this.scene.add
		.spine(pos.x, pos.y, 'spinningBar', 'idle', true)
		.setDepth(DepthGroup.box)
		.setAngle(90);
  
	//   const unsafeBarSlot = this.spineObject.findSlot('unsafe-bar');
	//   unsafeBarSlot.setAttachment(null);
	}
  
	followPath(time: number, delta: number) {
	  if (this.body.isStatic || !this.pathToFollow) return;
	  this.timeAlive += delta;
	  // TODO  move to other file
	  const s = 0.5 + 0.5 * Math.sin(this.timeAlive / (1.5 * this.pathToFollow.getLength()));
	  const p = this.pathToFollow.getPoint(s);
	  this.bodyConstraint.position.x = p.x;
	  this.bodyConstraint.position.y = p.y;
	}
	updateSpineObject() {
	  const { x, y } = this.body.position;
	  this.spineObject.setPosition(x, y);
	}

	updatePos() {
		const { x, y } = this.body.position;
		this.scene.matter.body.setPosition(
			this.bodyConstraint,
			new Phaser.Math.Vector2(this.x, this.y),
			false
		);
		this.scene.matter.body.setAngle(
			this.bodyConstraint,
			this.angle,
			false
		);

		this.scene.matter.body.setPosition(
			this.body,
			new Phaser.Math.Vector2(this.x, this.y),
			false
		);
		this.scene.matter.body.setAngle(
			this.body,
			this.angle,
			false
		);

	}
  
	update(time: number, delta: number) {
		this.updatePos()
	  // this.scene.matter.setAngularVelocity(this.body, 0); // another way of preventing rotation
	  this.followPath(time, delta);
	//   this.updateSpineObject();
	}
  
	isGrabbable() {
	  return false;
	}
  
	onTimeLock = ({ body }: { body: MatterJS.BodyType }) => {
	  if (body && body === this.body) {
		stopCompletely(this.scene, this.body);
		commonTimeLock(this.scene, this.body);
	  }
	};
  
	listenForEvents = () => {
	  on(GameEvent.timeLock, this.onTimeLock);
	};
	stopListeningForEvents() {
	  off(GameEvent.timeLock, this.onTimeLock);
	}
  
	destroy() {
	  if (this.bodyConstraint) {
		this.scene.matter.world.remove(this.bodyConstraint);
		// @ts-expect-error
		this.bodyConstraint = null;
	  }
	  if (this.constraint) {
		this.scene.matter.world.removeConstraint(this.constraint, true);
		// @ts-expect-error
		this.constraint = null;
	  }
	  destroyObject(this.scene, this);
	}
  }
  