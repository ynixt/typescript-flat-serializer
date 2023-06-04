import { TSFlatCollection, TSFlatObject, parse, stringify } from '../src';

@TSFlatObject()
export abstract class Animal {
  protected constructor(public name: string) {}
}

@TSFlatObject()
export class Dog extends Animal {
  @TSFlatCollection({ collectionType: 'set' })
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

test('example from readme', () => {
  const foods = new Set([new Food('all')]);
  const animal: Animal = new Dog('Luffy', true, foods);

  const str = stringify(animal);
  const parsedAnimal = parse<Animal>(str);

  expect(parsedAnimal).toStrictEqual(animal);
});
