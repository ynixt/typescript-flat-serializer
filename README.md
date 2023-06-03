# typescript-flat-serializer

A typescript library to serialize/deserialize classes to/from string in a flat format. Supports inheritance, circular reference and more

# ⚠️ **UNDER DEVELOPING - NOT DONE YET!!!** ⚠️

## Why

When I was developing a electron app I needed a serializer that fill some requirements to use with
[IPC](https://www.electronjs.org/docs/latest/tutorial/ipc):

- After serialize I wanted that the object keep the methods (right prototype)
- I needed inheritance
- Supports circular reference is always good

## Inspired by

- [WebReflection/flatted](https://github.com/WebReflection/flatted)
- [GillianPerard/typescript-json-serializer](https://github.com/GillianPerard/typescript-json-serializer)
