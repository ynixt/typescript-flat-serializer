/*
    This script was created based on https://github.com/davidmarkclements/rfdc
    The modifications (and probably new bugs) are thanks to this project, so enjoy :]
    Probably on the future I'll move this file into a new repository.
 */
import { Type } from './helpers';
import { getFlatPropertyMetadata } from "./flat-serializer";

function copyBuffer(cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur);
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
}

export type CustomWayOfCloningObjectMap = Map<Type<any>, (obj: any) => any>;

export type RFDCOptions = {
  customWayOfCloningObject?: CustomWayOfCloningObjectMap;
};

export function rfdc(opts?: RFDCOptions) {
  const refs = [];
  const refsNew = [];

  return clone;

  function cloneArray(a, fn) {
    const keys = Object.keys(a);
    const a2 = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        const index = refs.indexOf(cur);
        if (index !== -1) {
          a2[k] = refsNew[index];
        } else {
          a2[k] = fn(cur);
        }
      }
    }
    return a2;
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) return o;
    if (opts?.customWayOfCloningObject?.has(o.constructor.prototype)) return opts.customWayOfCloningObject.get(o.constructor.prototype)(o);
    if (o instanceof Date) return new Date(o);
    if (Array.isArray(o)) return cloneArray(o, clone);
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone));
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone));
    const o2 = Object.create(Object.getPrototypeOf(o));
    refs.push(o);
    refsNew.push(o2);
    for (const k in o) {
      const propertyMetadata = getFlatPropertyMetadata(o, k);

      if (Object.hasOwnProperty.call(o, k) === false || propertyMetadata?.ignore === true) continue;
      const cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (opts?.customWayOfCloningObject?.has(cur.constructor)) {
        o2[k] = opts.customWayOfCloningObject.get(cur.constructor)(cur);
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone));
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone));
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        const i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = clone(cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2;
  }
}
