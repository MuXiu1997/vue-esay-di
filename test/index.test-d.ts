import { expectTypeOf } from 'vitest'

import {
  initializer,
  optionsWithInjectDefault,
  optionsWithThrowOnNoProvider,
  overrideOptionsWithInjectDefault,
  overrideOptionsWithThrowOnNoProvider,
} from '#/index.test'
import defineUseDependencyInjection from '~'

import type { TestType } from '#/index.test'
import type { UseDependencyInjection, UseInitiatedDependencyInjection } from '~'

describe('defineUseDependencyInjection return correct type with different arguments', () => {
  test('With initializer', () => {
    expectTypeOf(defineUseDependencyInjection(initializer)).toEqualTypeOf<UseInitiatedDependencyInjection<TestType | undefined>>()
    expectTypeOf(defineUseDependencyInjection(initializer, optionsWithInjectDefault)).toEqualTypeOf<UseInitiatedDependencyInjection<TestType>>()
    expectTypeOf(defineUseDependencyInjection(initializer, optionsWithThrowOnNoProvider)).toEqualTypeOf<UseInitiatedDependencyInjection<TestType>>()
  })

  test('Without initializer', () => {
    expectTypeOf(defineUseDependencyInjection<TestType>()).toEqualTypeOf<UseDependencyInjection<TestType | undefined>>()
    expectTypeOf(defineUseDependencyInjection(optionsWithInjectDefault)).toEqualTypeOf<UseDependencyInjection<TestType>>()
    expectTypeOf(defineUseDependencyInjection<TestType>(optionsWithThrowOnNoProvider)).toEqualTypeOf<UseDependencyInjection<TestType>>()
  })
})

describe('useDependencyInjection return correct type with different options', () => {
  test('No options - inject mode maybe return undefined', () => {
    const u = defineUseDependencyInjection(initializer)
    expectTypeOf(u('provide')).toEqualTypeOf<TestType>()

    expectTypeOf(u()).toEqualTypeOf<TestType | undefined>()
    expectTypeOf(u('inject')).toEqualTypeOf<TestType | undefined>()

    expectTypeOf(u(overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()

    expectTypeOf(u(overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
  })

  test('With injects default', () => {
    const u = defineUseDependencyInjection(initializer, optionsWithInjectDefault)
    expectTypeOf(u('provide')).toEqualTypeOf<TestType>()

    expectTypeOf(u('inject')).toEqualTypeOf<TestType>()
    expectTypeOf(u()).toEqualTypeOf<TestType>()

    expectTypeOf(u(overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()

    expectTypeOf(u(overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
  })

  test('With throw on no provider', () => {
    const u = defineUseDependencyInjection(initializer, optionsWithThrowOnNoProvider)
    expectTypeOf(u('provide')).toEqualTypeOf<TestType>()

    expectTypeOf(u()).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject')).toEqualTypeOf<TestType>()

    expectTypeOf(u(overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithInjectDefault)).toEqualTypeOf<TestType>()

    expectTypeOf(u(overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
    expectTypeOf(u('inject', overrideOptionsWithThrowOnNoProvider)).toEqualTypeOf<TestType>()
  })
})
