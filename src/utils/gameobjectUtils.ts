import { Scene } from 'phaser';

export const destroyObject = (scene: Scene, object: any) => {
  object.stopListeningForEvents();
  if (object.body) scene.matter.world.remove(object.body);
  object.body = null;
  if (object.spineObject) {
    object.spineObject.destroy();
    object.spineObject = null;
  }
};
