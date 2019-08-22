import * as THREE from 'three';
import { VRMHumanBones } from '../humanoid';
import { GLTFNode } from '../types';
import { LookAtTypeName } from '../types';
import { CurveMapper } from './CurveMapper';
import { VRMLookAtApplyer } from './VRMLookAtApplyer';
import { VRMLookAtHead } from './VRMLookAtHead';

const _euler = new THREE.Euler(0.0, 0.0, 0.0, VRMLookAtHead.EULER_ORDER);

export class VRMLookAtBoneApplyer extends VRMLookAtApplyer {
  public readonly type = LookAtTypeName.Bone;

  private readonly _curveHorizontalInner: CurveMapper;
  private readonly _curveHorizontalOuter: CurveMapper;
  private readonly _curveVerticalDown: CurveMapper;
  private readonly _curveVerticalUp: CurveMapper;

  private readonly _leftEye?: GLTFNode;
  private readonly _rightEye?: GLTFNode;

  constructor(
    humanBodyBones: VRMHumanBones,
    curveHorizontalInner: CurveMapper,
    curveHorizontalOuter: CurveMapper,
    curveVerticalDown: CurveMapper,
    curveVerticalUp: CurveMapper,
  ) {
    super();

    this._curveHorizontalInner = curveHorizontalInner;
    this._curveHorizontalOuter = curveHorizontalOuter;
    this._curveVerticalDown = curveVerticalDown;
    this._curveVerticalUp = curveVerticalUp;

    this._leftEye = humanBodyBones.leftEye;
    this._rightEye = humanBodyBones.rightEye;
  }

  public lookAt(euler: THREE.Euler) {
    const srcX = euler.x;
    const srcY = euler.y;

    // left
    if (this._leftEye) {
      if (srcX < 0.0) {
        _euler.x = -this._curveVerticalDown.map(-srcX);
      } else {
        _euler.x = this._curveVerticalUp.map(srcX);
      }

      if (srcY < 0.0) {
        _euler.y = -this._curveHorizontalInner.map(-srcY);
      } else {
        _euler.y = this._curveHorizontalOuter.map(srcY);
      }

      this._leftEye.quaternion.setFromEuler(_euler);
    }

    // right
    if (this._rightEye) {
      if (srcX < 0.0) {
        _euler.x = -this._curveVerticalDown.map(-srcX);
      } else {
        _euler.x = this._curveVerticalUp.map(srcX);
      }

      if (srcY < 0.0) {
        _euler.y = -this._curveHorizontalOuter.map(-srcY);
      } else {
        _euler.y = this._curveHorizontalInner.map(srcY);
      }

      this._rightEye.quaternion.setFromEuler(_euler);
    }
  }
}
