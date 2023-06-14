# typescript-flat-serializer

![Build status](https://github.com/ynixt/typescript-flat-serializer/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ynixt/typescript-flat-serializer/badge.svg?branch=master)](https://coveralls.io/github/ynixt/typescript-flat-serializer?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/ynixt/typescript-flat-serializer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ynixt/typescript-flat-serializer?targetFile=package.json)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/typescript-flat-serializer)
![GitHub](https://img.shields.io/github/license/ynixt/typescript-flat-serializer)
![npm](https://img.shields.io/npm/v/typescript-flat-serializer)

A typescript library to serialize/deserialize classes to/from string in a flat format. Supports inheritance, circular reference and more

## Summary

1. [Why](#why)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API](#API)
5. [Important notes](#important-notes)
6. [Inspired by](#inspired-by)

## Why

When I was developing a electron app I needed a serializer that fill some requirements to use with
[IPC](https://www.electronjs.org/docs/latest/tutorial/ipc):

- After serialize I wanted that the object keep the methods (right prototype)
- I needed inheritance
- Supports circular reference is always good

## Installation

`npm install typescript-flat-serializer --save`

You also need to set **experimentalDecorators** and **emitDecoratorMetadata** to true into the tsconfig.json file.

For example:

```json
{
  "compilerOptions": {
    ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    ...
  }
}
```

## Usage

First let's create some models

```typescript
import {TSFlatCollection, TSFlatObject} from "typescript-flat-serializer";

@TSFlatObject()
export abstract class Animal {
  protected constructor(public name: string) {
  }
}

// This decorator NEEDS to be placed on every class that you want to serialize. 
// Without this decorator the behavior will be like stringify/parse from JSON.
@TSFlatObject()
export class Dog extends Animal {
  // This decorator will take care of serialize/deserialize our collection
  @TSFlatCollection({collectionType: "set"})
  favoriteFoods: Set<Food>;

  constructor(name: string, public beautiful: boolean, favoriteFoods: Set<Food>) {
    super(name);
    this.favoriteFoods = favoriteFoods;
  }
}

@TSFlatObject()
export class Food extends Animal {
  constructor(name: string) {
    super(name);
  }
}
```

Now we only need to serialize/deserialize the animal.

```typescript
import {parse, stringify} from "typescript-flat-serializer";


const foods = new Set([new Food('all')])
const animal: Animal = new Dog('Luffy', true, foods);

// Let's go serialize our animal
const str = stringify(animal)
// value of str: [{"name":"Luffy","beautiful":true,"favoriteFoods":"#_1_#","__class__":"Dog"},["#_2_#"],{"name":"all","__class__":"Food"}]

// And now we can deserialize the animal
const parsedAnimal = parse<Animal>(str);
```

You can find another examples of utilisation on [tests](https://github.com/ynixt/typescript-flat-serializer/tree/master/test).

## API

### Decorators

#### **@TSFlatObject**

Used to make a class serializable.

##### **Example**

```typescript
@TSFlatObject()
export class Dog {
}
```

#### **@TSFlatCollection**

Used do make a Array|Set|Map|Dictionary

##### **Example**

```typescript
@TSFlatObject()
export class Dog {
  @TSFlatCollection({collectionType: "map"})
  placesVisited: Map<string, boolean>
}
```

##### **Parameters**

**collectionType**
Type: [`CollectionTypeString`](#collectionTypeString)  
Optional: `false`  
Description: The way to specify the type of collection

#### **@TSFlatProperty**

Used modify the serialization/deserialization of a property.

##### **Example**

```typescript
@TSFlatObject()
export class Dog {
  @TSFlatCollection({collectionType: "map"})
  @TSFlatProperty({
    beforeStringify: (m) => {
      m.set('Brazil', true);
    }
  })
  placesVisited: Map<string, boolean>
}
```

##### **Parameters**

**options**
Type: [`TSFlatPropertyOptions`](#tSFlatPropertyOptions)  
Optional: `true`  
Description: The option to customize the serialization/deserialization of the target property.

### Methods

#### **stringify**

Used to serialize a object.

```
stringify(obj: any, options?: StringifyOptions): string
```

##### **Parameters**

**obj**

Type: `any`  
Optional: `false`  
Description: The object that will be serialized

**options**

Type: [`StringifyOptions`](#stringifyOptions)  
Optional: `true`  
Description: Custom options to the serialization

##### **Return**

`string`

---

#### **parse**

Used to deserialize a string into a object.

```
parse<T>(str: string): T
```

##### **Return**

`T`

### Definitions

#### **Types**

##### **CollectionTypeString**

```typescript
export type CollectionTypeString = 'array' | 'dictionary' | 'map' | 'set';
```

##### **TSFlatPropertyOptions**

```typescript
export type PropertyTransformer = (property: any) => any;

export interface TSFlatPropertyMetadata {
    beforeStringify?: PropertyTransformer;
    afterParse?: PropertyTransformer;
}

export interface TSFlatPropertyOptions extends TSFlatPropertyMetadata {
}
```

#### **stringifyOptions**

```typescript
export type StringifyOptions = {
  rFDCOptions?: RFDCOptions
}

export type CustomWayOfCloningObjectMap = Map<Type<any>, (obj: any) => any>;

export type RFDCOptions = {
  customWayOfCloningObject?: CustomWayOfCloningObjectMap
}
```

## Important notes

### Cloning

This library before the serialization makes a clone of the object. By default the cloning supports the types:

- Object
- Array
- Number
- String
- null
- Date
- undefined
- Buffer
- TypedArray
- Map
- Set
- Function
- AsyncFunction
- GeneratorFunction
- arguments

To support other type, like DateTime of [Luxon](https://github.com/moment/luxon/), you should do something like that:

```typescript
const customWayOfCloningObject: CustomWayOfCloningObjectMap = new Map();
const rFDCOptions: RFDCOptions = {
  customWayOfCloningObject
}

customWayOfCloningObject.set(DateTime, (obj) => DateTime.fromMillis(obj.toMillis()));

const str = stringify(obj, {rFDCOptions});
```

## Inspired by

- [WebReflection/flatted](https://github.com/WebReflection/flatted)
- [GillianPerard/typescript-json-serializer](https://github.com/GillianPerard/typescript-json-serializer)
- [davidmarkclements/rfdc](https://github.com/davidmarkclements/rfdc)
