export interface IGameObject {
    body: MatterJS.BodyType | any;
    spineObject: SpineGameObject;
    destroy: Function;
    stopListeningForEvents: Function;
    isGrabbable: Function;
  }
  