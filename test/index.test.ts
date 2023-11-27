import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import { defineComponent } from 'vue'

import defineUseDependencyInjection from '~'

import type { OverrideOptions, UseDependencyInjection, UseInitiatedDependencyInjection, WithInjectDefault, WithThrowOnNoProvider } from '~'

export interface TestType {
  foo: string
  bar: number
}

export const initializer = () => ({ foo: 'foo', bar: 0 } as TestType)

export const optionsWithInjectDefault = { injectDefault: () => ({ foo: 'foo', bar: 1 } as TestType) }
export const optionsWithThrowOnNoProvider = { throwOnNoProvider: () => new Error('No provider found for optionsWithThrowOnNoProvider') }

export const overrideOptionsWithInjectDefault = { injectDefault: () => ({ foo: 'foo', bar: 2 } as TestType) }
export const overrideOptionsWithThrowOnNoProvider = { throwOnNoProvider: () => new Error('No provider found for overrideOptionsWithThrowOnNoProvider') }

// region Define Components
function createComponents<U extends | UseInitiatedDependencyInjection<TestType> | UseInitiatedDependencyInjection<TestType | undefined> | UseDependencyInjection<TestType> | UseDependencyInjection<TestType | undefined>>(
  useDependencyInjection: U,
  provide: boolean | (() => TestType),
  setMode: boolean,
  overrideOptions: OverrideOptions<TestType> | undefined,
) {
  const ChildComponent = defineComponent({
    setup() {
      let injected
      if (setMode) {
        if (overrideOptions == null) {
          injected = useDependencyInjection('inject')
        }
        else {
          injected = useDependencyInjection('inject', overrideOptions)
        }
      }
      else {
        if (overrideOptions == null) {
          injected = useDependencyInjection()
        }
        else {
          injected = useDependencyInjection(overrideOptions)
        }
      }
      return {
        injected,
      }
    },
    render() {
      return null
    },
  })

  const ParentComponent = defineComponent({
    components: {
      ChildComponent,
    },
    setup() {
      if (provide === false) return
      if (provide === true) {
        useDependencyInjection('provide')
        return
      }
      useDependencyInjection('provide', provide)
    },
    template: `
      <div>
        <child-component/>
      </div>
    `,
  })
  return [ParentComponent, ChildComponent] as const
}

// endregion Define Components

function formatOptions(options: WithInjectDefault<unknown> | WithThrowOnNoProvider | undefined) {
  if (options == null) {
    return 'undefined'
  }
  if ('injectDefault' in options) {
    return 'injectDefault'
  }
  if ('throwOnNoProvider' in options) {
    return 'throwOnNoProvider'
  }
  return 'unknown'
}

type ColOptions = WithInjectDefault<TestType> | WithThrowOnNoProvider | undefined
type ColOverrideOptions = OverrideOptions<TestType> | undefined
type ColSetMode = boolean
type ColExpected = 'undefined' | 'default 1' | 'default 2' | 'error 1' | 'error 2'
/* @formatter:off */
/* eslint-disable style/no-multi-spaces,style/comma-spacing */
const cases: readonly [ColOptions, ColOverrideOptions                   , ColSetMode , ColExpected ][] = [
  // options                     , overrideOptions                      , setMode    , expected
  [undefined                     , undefined                            , false      , 'undefined']        ,
  [undefined                     , undefined                            , true       , 'undefined']        ,
  [undefined                     , overrideOptionsWithInjectDefault     , false      , 'default 2']        ,
  [undefined                     , overrideOptionsWithInjectDefault     , true       , 'default 2']        ,
  [undefined                     , overrideOptionsWithThrowOnNoProvider , false      , 'error 2']          ,
  [undefined                     , overrideOptionsWithThrowOnNoProvider , true       , 'error 2']          ,
  [optionsWithInjectDefault      , undefined                            , false      , 'default 1']        ,
  [optionsWithInjectDefault      , undefined                            , true       , 'default 1']        ,
  [optionsWithInjectDefault      , overrideOptionsWithInjectDefault     , false      , 'default 2']        ,
  [optionsWithInjectDefault      , overrideOptionsWithInjectDefault     , true       , 'default 2']        ,
  [optionsWithInjectDefault      , overrideOptionsWithThrowOnNoProvider , false      , 'error 2']          ,
  [optionsWithInjectDefault      , overrideOptionsWithThrowOnNoProvider , true       , 'error 2']          ,
  [optionsWithThrowOnNoProvider  , undefined                            , false      , 'error 1']          ,
  [optionsWithThrowOnNoProvider  , undefined                            , true       , 'error 1']          ,
  [optionsWithThrowOnNoProvider  , overrideOptionsWithInjectDefault     , false      , 'default 2']        ,
  [optionsWithThrowOnNoProvider  , overrideOptionsWithInjectDefault     , true       , 'default 2']        ,
  [optionsWithThrowOnNoProvider  , overrideOptionsWithThrowOnNoProvider , false      , 'error 2']          ,
  [optionsWithThrowOnNoProvider  , overrideOptionsWithThrowOnNoProvider , true       , 'error 2']          ,
]
/* eslint-enable */
/* @formatter:on */

// @vitest-environment jsdom
describe.concurrent(`useDependencyInjection('inject') correct behavior with no provider`, () => {
  cases.forEach(([options, overrideOptions, setMode, expected]) => {
    it(
      `options=[${formatOptions(options)}], overrideOptions=[${formatOptions(overrideOptions)}], setMode=[${setMode}], expected=[${expected}]`,
      async ({ expect }) => {
        const u = options == null ? defineUseDependencyInjection<TestType>(initializer) : defineUseDependencyInjection<TestType>(initializer, options)
        const [ParentComponent, ChildComponent] = createComponents(u, false, setMode, overrideOptions)

        if (expected === 'error 1') {
          expect(() => mount(ParentComponent)).toThrow('No provider found for optionsWithThrowOnNoProvider')
          return
        }
        if (expected === 'error 2') {
          expect(() => mount(ParentComponent)).toThrow('No provider found for overrideOptionsWithThrowOnNoProvider')
          return
        }

        const wrapper = mount(ParentComponent)
        const injected = wrapper.getComponent(ChildComponent).vm.injected

        if (expected === 'undefined') {
          expect(injected).toBeUndefined()
          return
        }

        if (expected === 'default 1') {
          expect(injected?.bar).toBe(1)
          return
        }

        if (expected === 'default 2') {
          expect(injected?.bar).toBe(2)
        }
      },
    )
  })
})

// @vitest-environment jsdom
describe.concurrent(`useDependencyInjection('inject') correct behavior with provider`, () => {
  cases.forEach(([options, overrideOptions, setMode, _]) => {
    it(
      `options=[${formatOptions(options)}], overrideOptions=[${formatOptions(overrideOptions)}], setMode=[${setMode}]`,
      async ({ expect }) => {
        const u = options == null ? defineUseDependencyInjection<TestType>(initializer) : defineUseDependencyInjection<TestType>(initializer, options)
        const [ParentComponent, ChildComponent] = createComponents(u, true, setMode, overrideOptions)

        const wrapper = mount(ParentComponent)
        const injected = wrapper.getComponent(ChildComponent).vm.injected

        expect(injected?.bar).toBe(0)
      },
    )
  })
})

// @vitest-environment jsdom
describe.concurrent(`useDependencyInjection('provide') correct behavior`, () => {
  it(`not initialized`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>()
    const [ParentComponent, _] = createComponents(u, true, false, undefined)
    expect(() => mount(ParentComponent)).toThrow(/is not initialized/)
  })
  it(`not initialized + override initializer`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(optionsWithThrowOnNoProvider)
    const [ParentComponent, ChildComponent] = createComponents(u, () => ({ foo: 'foo', bar: 1 }), false, undefined)

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.bar).toBe(1)
  })
  it(`initialized`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(u, true, false, undefined)

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.bar).toBe(0)
  })
  it(`initialized + override initializer`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(u, () => ({ foo: 'foo', bar: 1 }), false, undefined)

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.bar).toBe(1)
  })
})
