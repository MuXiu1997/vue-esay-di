# vue-easy-di
A Vue composable library for simplifying dependency injection.

## Install
```bash
$ npm install @muxiu1997/vue-easy-di
```

```js
import defineEmitterComposable from '@muxiu1997/vue-easy-di'
```

## Usage
```typescript
// Defining a dependency injection composable
const useMyDependency = defineUseDependencyInjection<MyType>(() => newMyType());

// Providing a value at the parent component
const parentComponent = defineComponent({
  setup() {
    const myDependency = useMyDependency('provide');

    // Or overrides default initializer
    const myDependency = useMyDependency('provide', () => newMyType());
  }
});

// Injecting a value in a child component
const childComponent = defineComponent({
  setup() {
    const myDependency = useMyDependency('inject');

    // Or omit 'inject' because it is the default
    const myDependency = useMyDependency();
  }
});

// Using with default value
const useDefaultDependency = defineUseDependencyInjection<MyType>({ injectDefault: () => newMyType() });
// Using with default value in inject mode
const myDependency = useDefaultDependency('inject', { injectDefault: () => newMyType() });

// Throwing error when no provider is found
const useStrictDependency = defineUseDependencyInjection<MyType>({ throwOnNoProvider: () => new Error('No provider found for useStrictDependency') });
// Throwing error when no provider is found in inject mode
const myDependency = useStrictDependency('inject', { throwOnNoProvider: () => new Error('No provider found for myDependency') });
```

## License
[MIT](./LICENSE)
