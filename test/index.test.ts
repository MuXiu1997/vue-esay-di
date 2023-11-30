import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import * as VueDemi from 'vue-demi'

import defineUseDependencyInjection from '~'

import type { WithInjectDefault, WithThrowOnNoProvider } from '~'

vi.mock('vue-demi', async (importOriginal) => {
  const $VueDemi = await importOriginal()
  return {
    // @ts-expect-error - mock
    ...$VueDemi,
    // @ts-expect-error - mock
    inject: vi.fn($VueDemi.inject),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

export interface TestType {
  msg: string
}

export const initializer: () => TestType
  = () => ({ msg: '[initializer]' })
export const overrideInitializer: () => TestType
  = () => ({ msg: '[overrideInitializer]' })

export const optionsWithInjectDefault: WithInjectDefault<TestType>
  = { injectDefault: () => ({ msg: '[optionsWithInjectDefault] with inject default' }) }
export const optionsWithThrowOnNoProvider: WithThrowOnNoProvider
  = { throwOnNoProvider: () => new Error('[optionsWithThrowOnNoProvider] No provider found') }

export const overrideOptionsWithInjectDefault: WithInjectDefault<TestType>
  = { injectDefault: () => ({ msg: '[overrideOptionsWithInjectDefault] with inject default' }) }
export const overrideOptionsWithThrowOnNoProvider: WithThrowOnNoProvider
  = { throwOnNoProvider: () => new Error('[overrideOptionsWithThrowOnNoProvider] No provider found') }

// region Define Components
function createComponents(
  setupParent: () => TestType | undefined,
  setupChild: () => TestType | undefined,
) {
  const ChildComponent = defineComponent({
    setup() {
      const injected = setupChild()
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
      const provided = setupParent()
      return {
        provided,
      }
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

// @vitest-environment jsdom
describe.concurrent(`defineUseDependencyInjection initializer correct behavior`, () => {
  it(`not initialized`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>()
    // @ts-expect-error - not initialized
    const [ParentComponent, _] = createComponents(() => u('provide'), () => u())
    expect(() => mount(ParentComponent)).toThrow(/is not initialized/)
  })
  it(`initialized`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(() => u('provide'), () => u())

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[initializer]/)
  })
  it(`initializer not a function`, async ({ expect }) => {
    expect(() => {
      // @ts-expect-error - initializer not a function
      return defineUseDependencyInjection<TestType>('initializer', {})
    }).toThrow(/first argument must be a initializer function when two arguments are provided/)
  })
})

// @vitest-environment jsdom
describe.concurrent(`defineUseDependencyInjection options correct behavior`, () => {
  it(`no options`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(() => u('provide'), () => u())

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[initializer]/)
  })

  it(`options with key`, async ({ expect }) => {
    const testKey = Symbol('test')
    const u = defineUseDependencyInjection<TestType>(initializer, { key: testKey })
    const [ParentComponent, _] = createComponents(() => u('provide'), () => u())

    mount(ParentComponent)

    expect(vi.mocked(VueDemi.inject).mock.lastCall?.[0]).toBe(testKey)
  })

  it(`options with injectDefault`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(optionsWithInjectDefault)
    const [ParentComponent, ChildComponent] = createComponents(() => undefined, () => u())

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[optionsWithInjectDefault]/)
  })

  it(`options with throwOnNoProvider`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(optionsWithThrowOnNoProvider)
    const [ParentComponent, _] = createComponents(() => undefined, () => u())

    expect(() => mount(ParentComponent)).toThrow(/\[optionsWithThrowOnNoProvider]/)
  })
})

// @vitest-environment jsdom
describe.concurrent(`useDependencyInjection provide mode correct behavior`, () => {
  it(`override initializer`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(() => u('provide', overrideInitializer), () => u())

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[overrideInitializer]/)
  })
  it(`override initializer not a function`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    // @ts-expect-error - overrideInitializer not a function
    const [ParentComponent, _] = createComponents(() => u('provide', 'overrideInitializer'), () => u())

    expect(() => mount(ParentComponent)).toThrow(/second argument must be a function when mode is 'provide'/)
  })
})

// @vitest-environment jsdom
describe.concurrent(`useDependencyInjection inject mode correct behavior`, () => {
  it(`default mode is inject`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(() => u('provide'), () => u())

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[initializer]/)
  })

  it(`override options with injectDefault`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer)
    const [ParentComponent, ChildComponent] = createComponents(() => undefined, () => u('inject', overrideOptionsWithInjectDefault))

    const wrapper = mount(ParentComponent)
    const injected = wrapper.getComponent(ChildComponent).vm.injected

    expect(injected?.msg).toMatch(/\[overrideOptionsWithInjectDefault]/)
  })

  it(`override options with throwOnNoProvider`, async ({ expect }) => {
    const u = defineUseDependencyInjection<TestType>(initializer, optionsWithInjectDefault)
    const [ParentComponent, _] = createComponents(() => undefined, () => u(overrideOptionsWithThrowOnNoProvider))

    expect(() => mount(ParentComponent)).toThrow(/\[overrideOptionsWithThrowOnNoProvider]/)
  })
})
