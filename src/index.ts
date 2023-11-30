import { inject, provide } from 'vue-demi'

import type { InjectionKey } from 'vue-demi'

export interface WithInjectDefault<T> {
  injectDefault: T | (() => T)
}

export interface WithThrowOnNoProvider {
  throwOnNoProvider: () => Error
}

export type Options<T> = {
  key?: InjectionKey<T> | string
} & (WithInjectDefault<T> | WithThrowOnNoProvider)

export type OverrideOptions<T> = (WithInjectDefault<T> | WithThrowOnNoProvider)

/**
 * A composable for dependency injection in a Vue component. It can be used in 'inject' or 'provide' mode.
 * It is not initialized, so in provide mode, initializer needs to be passed in
 * @param mode=inject - 'provide' or 'inject'
 * @param initializer - initializer for provide mode
 * @param overrideOptions - override options for inject mode
 * @see defineUseDependencyInjection
 */
export interface UseDependencyInjection<T> {
  (mode: 'provide', initializer: () => T): NonNullable<T>

  (): T
  (mode: 'inject'): T

  (mode: 'inject', overrideOptions: OverrideOptions<T>): NonNullable<T>
  (overrideOptions: OverrideOptions<T>): NonNullable<T>
}

/**
 * A composable for dependency injection in a Vue component. It can be used in 'inject' or 'provide' mode.
 * It is initialized, so in provide mode, initializer is not needed, and still can be passed in to override the default initializer
 */
export interface UseInitiatedDependencyInjection<T> extends UseDependencyInjection<T> {
  (mode: 'provide'): NonNullable<T>
}

/**
 * Defines a composable for Vue that provides or injects a value.
 *
 * @template T - The type of the value to be provided or injected.
 *
 * @param options - Configuration options for the composable.
 * @param options.key - An optional InjectionKey or string to uniquely identify the value in the Vue application's dependency injection system.
 * @param options.injectDefault - An optional default value to be used when none is provided. Can be either an instance of T or a factory function returning one.
 * @param options.throwOnNoProvider - An optional function that returns an error to be thrown when no value is provided, and no default is specified.
 *
 * @returns A UseInitiatedDependencyInjection function that can be called with 'provide' or 'inject' to either provide a value to the Vue component tree, or inject an existing one from a parent component. If neither 'provide' nor 'inject' is specified, it defaults to 'inject'.
 *
 * @example
 * // Defining a dependency injection composable
 * const useMyDependency = defineUseDependencyInjection<MyType>(() => newMyType());
 *
 * // Providing a value at the parent component
 * const parentComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('provide');
 *
 *     // Or overrides default initializer
 *     const myDependency = useMyDependency('provide', () => newMyType());
 *   }
 * });
 *
 * // Injecting a value in a child component
 * const childComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('inject');
 *
 *     // Or omit 'inject' because it is the default
 *     const myDependency = useMyDependency();
 *   }
 * });
 *
 * // Using with default value
 * const useDefaultDependency = defineUseDependencyInjection<MyType>({ injectDefault: () => newMyType() });
 * // Using with default value in inject mode
 * const myDependency = useDefaultDependency('inject', { injectDefault: () => newMyType() });
 *
 * // Throwing error when no provider is found
 * const useStrictDependency = defineUseDependencyInjection<MyType>({ throwOnNoProvider: () => new Error('No provider found for useStrictDependency') });
 * // Throwing error when no provider is found in inject mode
 * const myDependency = useStrictDependency('inject', { throwOnNoProvider: () => new Error('No provider found for myDependency') });
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  options?: Pick<Options<T>, 'key'>,
): UseDependencyInjection<T | undefined>

/**
 * Defines a composable for Vue that provides or injects a value.
 *
 * @template T - The type of the value to be provided or injected.
 *
 * @param options - Configuration options for the composable.
 * @param options.key - An optional InjectionKey or string to uniquely identify the value in the Vue application's dependency injection system.
 * @param options.injectDefault - An optional default value to be used when none is provided. Can be either an instance of T or a factory function returning one.
 * @param options.throwOnNoProvider - An optional function that returns an error to be thrown when no value is provided, and no default is specified.
 *
 * @returns A UseInitiatedDependencyInjection function that can be called with 'provide' or 'inject' to either provide a value to the Vue component tree, or inject an existing one from a parent component. If neither 'provide' nor 'inject' is specified, it defaults to 'inject'.
 *
 * @example
 * // Defining a dependency injection composable
 * const useMyDependency = defineUseDependencyInjection<MyType>(() => newMyType());
 *
 * // Providing a value at the parent component
 * const parentComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('provide');
 *
 *     // Or overrides default initializer
 *     const myDependency = useMyDependency('provide', () => newMyType());
 *   }
 * });
 *
 * // Injecting a value in a child component
 * const childComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('inject');
 *
 *     // Or omit 'inject' because it is the default
 *     const myDependency = useMyDependency();
 *   }
 * });
 *
 * // Using with default value
 * const useDefaultDependency = defineUseDependencyInjection<MyType>({ injectDefault: () => newMyType() });
 * // Using with default value in inject mode
 * const myDependency = useDefaultDependency('inject', { injectDefault: () => newMyType() });
 *
 * // Throwing error when no provider is found
 * const useStrictDependency = defineUseDependencyInjection<MyType>({ throwOnNoProvider: () => new Error('No provider found for useStrictDependency') });
 * // Throwing error when no provider is found in inject mode
 * const myDependency = useStrictDependency('inject', { throwOnNoProvider: () => new Error('No provider found for myDependency') });
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  options: Options<T>,
): UseDependencyInjection<T>

/**
 * Defines a composable for Vue that provides or injects a value.
 *
 * @template T - The type of the value to be provided or injected.
 *
 * @param initializer - An optional initializer for the value to be provided.
 * @param options - Configuration options for the composable.
 * @param options.key - An optional InjectionKey or string to uniquely identify the value in the Vue application's dependency injection system.
 * @param options.injectDefault - An optional default value to be used when none is provided. Can be either an instance of T or a factory function returning one.
 * @param options.throwOnNoProvider - An optional function that returns an error to be thrown when no value is provided, and no default is specified.
 *
 * @returns A UseInitiatedDependencyInjection function that can be called with 'provide' or 'inject' to either provide a value to the Vue component tree, or inject an existing one from a parent component. If neither 'provide' nor 'inject' is specified, it defaults to 'inject'.
 *
 * @example
 * // Defining a dependency injection composable
 * const useMyDependency = defineUseDependencyInjection<MyType>(() => newMyType());
 *
 * // Providing a value at the parent component
 * const parentComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('provide');
 *
 *     // Or overrides default initializer
 *     const myDependency = useMyDependency('provide', () => newMyType());
 *   }
 * });
 *
 * // Injecting a value in a child component
 * const childComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('inject');
 *
 *     // Or omit 'inject' because it is the default
 *     const myDependency = useMyDependency();
 *   }
 * });
 *
 * // Using with default value
 * const useDefaultDependency = defineUseDependencyInjection<MyType>({ injectDefault: () => newMyType() });
 * // Using with default value in inject mode
 * const myDependency = useDefaultDependency('inject', { injectDefault: () => newMyType() });
 *
 * // Throwing error when no provider is found
 * const useStrictDependency = defineUseDependencyInjection<MyType>({ throwOnNoProvider: () => new Error('No provider found for useStrictDependency') });
 * // Throwing error when no provider is found in inject mode
 * const myDependency = useStrictDependency('inject', { throwOnNoProvider: () => new Error('No provider found for myDependency') });
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  initializer: () => T,
  options?: Pick<Options<T>, 'key'>,
): UseInitiatedDependencyInjection<T | undefined>

/**
 * Defines a composable for Vue that provides or injects a value.
 *
 * @template T - The type of the value to be provided or injected.
 *
 * @param initializer - An optional initializer for the value to be provided.
 * @param options - Configuration options for the composable.
 * @param options.key - An optional InjectionKey or string to uniquely identify the value in the Vue application's dependency injection system.
 * @param options.injectDefault - An optional default value to be used when none is provided. Can be either an instance of T or a factory function returning one.
 * @param options.throwOnNoProvider - An optional function that returns an error to be thrown when no value is provided, and no default is specified.
 *
 * @returns A UseInitiatedDependencyInjection function that can be called with 'provide' or 'inject' to either provide a value to the Vue component tree, or inject an existing one from a parent component. If neither 'provide' nor 'inject' is specified, it defaults to 'inject'.
 *
 * @example
 * // Defining a dependency injection composable
 * const useMyDependency = defineUseDependencyInjection<MyType>(() => newMyType());
 *
 * // Providing a value at the parent component
 * const parentComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('provide');
 *
 *     // Or overrides default initializer
 *     const myDependency = useMyDependency('provide', () => newMyType());
 *   }
 * });
 *
 * // Injecting a value in a child component
 * const childComponent = defineComponent({
 *   setup() {
 *     const myDependency = useMyDependency('inject');
 *
 *     // Or omit 'inject' because it is the default
 *     const myDependency = useMyDependency();
 *   }
 * });
 *
 * // Using with default value
 * const useDefaultDependency = defineUseDependencyInjection<MyType>({ injectDefault: () => newMyType() });
 * // Using with default value in inject mode
 * const myDependency = useDefaultDependency('inject', { injectDefault: () => newMyType() });
 *
 * // Throwing error when no provider is found
 * const useStrictDependency = defineUseDependencyInjection<MyType>({ throwOnNoProvider: () => new Error('No provider found for useStrictDependency') });
 * // Throwing error when no provider is found in inject mode
 * const myDependency = useStrictDependency('inject', { throwOnNoProvider: () => new Error('No provider found for myDependency') });
 */
export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  initializer: () => T,
  options: Partial<Options<T>>,
): UseInitiatedDependencyInjection<T >

export default function defineUseDependencyInjection<T extends NonNullable<unknown>>(
  arg0: (() => T) | Partial<Options<T>> | undefined = undefined,
  arg1: Partial<Options<T>> | undefined = undefined,
): UseInitiatedDependencyInjection<T | undefined> {
  let initializer: (() => T) | undefined
  let options: Partial<Options<T>> = {}
  // two arguments
  if (arg0 != null && arg1 != null) {
    if (typeof arg0 !== 'function') {
      throw new TypeError('[defineUseDependencyInjection] first argument must be a initializer function when two arguments are provided')
    }
    initializer = arg0 as () => T
    options = arg1
  }
  // one argument
  else if (arg0 != null) {
    // first argument is initializer
    if (typeof arg0 === 'function') {
      initializer = arg0
    }
    // first argument is options
    else {
      options = arg0
    }
  }
  // no argument do nothing

  // eslint-disable-next-line symbol-description
  const injectKey = options.key ?? (Symbol() as InjectionKey<T>)
  return function UseDependencyInjection($arg0: unknown, $arg1: unknown) {
    // mode: 'provide'

    if ($arg0 === 'provide') {
      if ($arg1 != null && typeof $arg1 !== 'function') {
        throw new TypeError('[useDependencyInjection] second argument must be a function when mode is \'provide\'')
      }
      const overrideInitializer = $arg1 as (() => T) | undefined
      const value = overrideInitializer?.() ?? initializer?.()
      if (value == null) throw new Error(`UseDependencyInjection value \`${injectKey.toString()}\` is not initialized`)
      provide(injectKey, value)

      return value
    }

    // mode: 'inject'

    let overrideOptions: OverrideOptions<T>
    if ($arg0 === 'inject') {
      overrideOptions = ($arg1 ?? {}) as OverrideOptions<T>
    }
    else {
      overrideOptions = ($arg0 ?? {}) as OverrideOptions<T>
    }

    const finalOptions = { ...options } as Partial<WithInjectDefault<T> & WithThrowOnNoProvider>
    // override options has higher priority than options
    if ('injectDefault' in overrideOptions && overrideOptions.injectDefault != null) {
      finalOptions.injectDefault = overrideOptions.injectDefault
      finalOptions.throwOnNoProvider = undefined
    }
    else if ('throwOnNoProvider' in overrideOptions && overrideOptions.throwOnNoProvider != null) {
      finalOptions.throwOnNoProvider = overrideOptions.throwOnNoProvider
      finalOptions.injectDefault = undefined
    }

    if (finalOptions.injectDefault != null) {
      return inject(injectKey, finalOptions.injectDefault, true)
    }

    const value = inject(injectKey)
    if (value == null && 'throwOnNoProvider' in finalOptions && finalOptions.throwOnNoProvider != null) {
      throw finalOptions.throwOnNoProvider()
    }

    return value
  } as UseInitiatedDependencyInjection<T | undefined>
}
