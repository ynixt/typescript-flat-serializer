import {TSFlatObject} from '../src/flat-object';
import {parse, stringify} from '../src/flat-serializer';
import {TSFlatCollection} from "../src";

@TSFlatObject()
export abstract class Animal {
  @TSFlatCollection({collectionType: "map"})
  like: Map<string, boolean>;

  constructor(public name: string) {
  }
}

@TSFlatObject()
export class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
}

@TSFlatObject()
export class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
}

@TSFlatObject()
export class Rat extends Animal {
  @TSFlatCollection({collectionType: "map"})
  points: Map<string, number>;

  constructor(name: string) {
    super(name);
  }
}

test('stringify/parse with inheritance', () => {
  const animal: Animal = new Dog('adsdsa');

  const str = stringify(animal);
  const parsedRoot = parse<Animal>(str);

  expect(parsedRoot).toStrictEqual(animal);
});

test('stringify/parse with inheritance and collection', () => {
  const animal: Animal = new Rat('adsdsa');
  const rat = animal as Rat;

  rat.points = new Map<string, number>();
  rat.like = new Map<string, boolean>();

  rat.like.set('cat', false);
  rat.points.set('test', 15);

  const str = stringify(animal);
  const parsedRoot = parse<Rat>(str);

  expect(parsedRoot).toStrictEqual(rat);
});
