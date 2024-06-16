import Phaser from "phaser";
import { IGameObject } from "../interfaces/IGameObject";

export default class MatterBody extends Phaser.GameObjects.Container implements IGameObject {
	mBody: MatterJS.BodyType;
	spineObject: SpineGameObject;
	stopListeningForEvents: Function;
	isGrabbable: Function;
	
	constructor(parent: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(parent);
	}
}