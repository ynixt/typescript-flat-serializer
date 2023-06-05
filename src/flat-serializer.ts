import {CollectionType, CollectionTypeString, TSFlatCollectionMetadata} from './flat-collection';
import {registeredTSFlatObjects} from './flat-object';
import {Reflection} from './reflection';
import {RFDCOptions, rfdc} from './rfdc';
import {TSFlatPropertyMetadata} from "./flat-property";

export type StringifyOptions = {
  rFDCOptions?: RFDCOptions;
};

function getId(index: number): string {
  return `#_${index}_#`;
}

function getIndex(id: string): number {
  return parseInt(id.split('#_')[1], 10);
}

function isId(str: string): boolean {
  const regex = /^#_(\d+)_#$/gm;
  return regex.exec(str) != null;
}

function addItem(value: any, input: any[], positionsByObj: Map<any, number>) {
  const index = input.push(value) - 1;
  positionsByObj.set(value, index);
  return index;
}

export const ATTR_CLASS_NAME = '__class__';

function formatValue(value: any) {
  if (value != null && typeof value === 'object' && registeredTSFlatObjects.has(value.constructor.name)) {
    value[ATTR_CLASS_NAME] = value.constructor.name;
    return value;
  }

  return value;
}

function convertCollectionToArray(value: CollectionType, currentCollectionType: CollectionTypeString) {
  if (value == null) return value;

  switch (currentCollectionType) {
    case 'array': {
      return value;
    }
    case 'set': {
      return Array.from(value.values());
    }
    case 'map': {
      return Array.from(value.entries());
    }
    case 'dictionary': {
      const array = [];
      for (const key of Object.keys(value)) {
        array.push({
          key,
          value: value[key],
        });
      }
      return array;
    }
  }
}

function convertArrayToOriginalCollectionType(value: CollectionType, currentCollectionType: CollectionTypeString) {
  if (value == null) return value;

  const array = value as Array<any>;

  switch (currentCollectionType) {
    case 'array': {
      return value;
    }
    case 'set': {
      return new Set(array);
    }
    case 'map': {
      return new Map(array);
    }
    case 'dictionary': {
      const obj: any = {};

      array.forEach(item => {
        obj[item.key] = item.value;
      });

      return obj;
    }
  }
}

/**
 * Get the flatPropertyMetadata searching on the object and on object's parent.
 */
function getFlatPropertyMetadata(obj: any, propertyKey: string): TSFlatPropertyMetadata {
  let propertyMetadata: TSFlatPropertyMetadata = null;

  do {
    propertyMetadata = Reflection.getFlatPropertyMetadata(obj.constructor.prototype, propertyKey);
    obj = Object.getPrototypeOf(obj);
  } while (propertyMetadata == null && obj.constructor.name != 'Object')

  return propertyMetadata;
}

/**
 * Get the flatCollectionMetadata searching on the object and on object's parent.
 */
function getFlatCollectionMetadata(obj: any, propertyKey: string): TSFlatCollectionMetadata {
  let collectionMetadata: TSFlatCollectionMetadata = null;

  do {
    collectionMetadata = Reflection.getFlatCollectionMetadata(obj.constructor.prototype, propertyKey);
    obj = Object.getPrototypeOf(obj);
  } while (collectionMetadata == null && obj.constructor.name != 'Object')

  return collectionMetadata;
}

export function stringify(obj: any, options?: StringifyOptions): string {
  const cloner = rfdc(options?.rFDCOptions);
  obj = cloner(obj);

  const positionsByObj = new Map<any, number>();
  const inputArray: any[] = [];
  const outputArray: any[] = [];
  let i = 0;
  let first = true;

  addItem(obj, inputArray, positionsByObj);

  while (i < inputArray.length) {
    first = true;
    outputArray.push(
      JSON.stringify(inputArray[i++], (key, value) => {
        if (value != null && typeof value === 'object') {
          for (const childKey of Object.keys(value)) {
            const propertyMetadata = getFlatPropertyMetadata(value, childKey);
            const collectionMetadata = getFlatCollectionMetadata(value, childKey);

            if (propertyMetadata != null && propertyMetadata.beforeStringify) {
              value[childKey] = propertyMetadata.beforeStringify(value[childKey]);
            }

            if (collectionMetadata != null) {
              value[childKey] = convertCollectionToArray(value[childKey], collectionMetadata.collectionType);
            }
          }
        }

        if (first) {
          first = false;
          return formatValue(value);
        }

        if (obj == null) return value;

        if (typeof value === 'object') {
          if (positionsByObj.has(value)) {
            return getId(positionsByObj.get(value));
          }

          return getId(addItem(formatValue(value), inputArray, positionsByObj));
        }

        return formatValue(value);
      }),
    );
  }

  return `[${outputArray.join(',')}]`;
}

export function parse<T>(str: string): T {
  const array: any[] = JSON.parse(str);

  if (typeof array[0] !== 'object') return array[0];

  // Restore the type of the object
  array.forEach((item, index) => {
    if (item != null && typeof item === 'object') {
      const className = item[ATTR_CLASS_NAME];

      if (className != null && registeredTSFlatObjects.has(className)) {
        const prototype = registeredTSFlatObjects.get(className).prototype;
        const tempObj = Object.create(prototype);
        const metadata = Reflection.getFlatObjectMetadata(tempObj.constructor);
        array[index] = Object.assign(new tempObj.constructor(...metadata.constructorParams), item);
      }
    }
  });

  // Restore references
  array.forEach(item => {
    if (item != null && typeof item === 'object') {
      for (const key of Object.keys(item)) {
        if (isId(item[key])) {
          const indexOnFlat = getIndex(item[key]);
          item[key] = array[indexOnFlat];
        }
      }
    }
  });

  afterParse(array[0]);

  array.forEach(item => {
    if (item != null) {
      // ATTR_CLASS_NAME is not needed anymore
      delete item[ATTR_CLASS_NAME];
    }
  });

  return array[0];
}

function afterParse(obj: any, alreadyVisited: Set<any> = new Set()) {
  if (obj == null) return;

  for (const key of Object.keys(obj)) {
    if (obj[key] != null && typeof obj[key] === 'object') {
      if (alreadyVisited.has(obj)) continue;
      alreadyVisited.add(obj[key]);
      afterParse(obj[key], alreadyVisited);
    }

    const propertyMetadata = getFlatPropertyMetadata(obj, key);
    const collectionMetadata = getFlatCollectionMetadata(obj, key);

    if (propertyMetadata != null && propertyMetadata.afterParse) {
      obj[key] = propertyMetadata.afterParse(obj[key]);
    }

    if (collectionMetadata != null) {
      obj[key] = convertArrayToOriginalCollectionType(obj[key], collectionMetadata.collectionType);
    }
  }
}
