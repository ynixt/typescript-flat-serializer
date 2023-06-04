import { TSFlatObject } from '../src/flat-object';
import { parse, stringify } from '../src/flat-serializer';

@TSFlatObject()
export abstract class Animal {
  constructor(public name: string) {}
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

test('stringify/parse with inheritance', () => {
  const animal: Animal = new Dog('adsdsa');

  const str = stringify(animal);
  const parsedRoot = parse(str);

  expect(parsedRoot).toStrictEqual(animal);
});
