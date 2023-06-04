import {parse, stringify, TSFlatCollection, TSFlatObject} from "../src";
import {Animal, Cat, Dog} from "./inheritance.test";

export class ExampleArray {
    @TSFlatCollection({collectionType: "array"})
    public items: Array<number>;

    constructor(items: Array<number>) {
        this.items = items;
    }
}

@TSFlatObject()
export class ExampleArrayFlatObject {
    @TSFlatCollection({collectionType: "array"})
    public items: Array<number>;

    constructor(items: Array<number>) {
        this.items = items;
    }
}

export class ExampleSet {
    @TSFlatCollection({collectionType: "set"})
    public items: Set<string>;

    constructor(items: Set<string>) {
        this.items = items;
    }
}

export class ExampleMap {
    @TSFlatCollection({collectionType: "map"})
    public items: Map<string, boolean>;

    constructor(items: Map<string, boolean>) {
        this.items = items;
    }
}

export class ExampleDict {
    @TSFlatCollection({collectionType: "dictionary"})
    public items: { [key: string]: any };

    constructor(items: { [key: string]: any }) {
        this.items = items;
    }
}

export class ExampleComplexMap {
    @TSFlatCollection({collectionType: "map"})
    public items: Map<string, Animal>;

    constructor(items: Map<string, Animal>) {
        this.items = items;
    }
}

test("array", () => {
    const example = new ExampleArray([3, 5]);

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(example);
});

test("array in a ExampleFlatObject", () => {
    const example = new ExampleArrayFlatObject([3, 5]);

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toStrictEqual(example);
});

test("set", () => {
    const example = new ExampleSet(new Set(["a", "asd"]));

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(example);
});

test("map", () => {
    const map = new Map<string, boolean>();
    map.set("asd", true);
    map.set("b", false);

    const example = new ExampleMap(map);

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(example);
});

test("dict", () => {
    const dict = {
        "bb": true,
        "adsasd": "asd"
    };

    const example = new ExampleDict(dict);

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(example);
});

test("complex map", () => {
    const map = new Map<string, Animal>();
    map.set("asd", new Dog("Luffy"));
    map.set("b", new Cat("Eros"));

    const example = new ExampleComplexMap(map);

    const str = stringify(example);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(example);
});