import {Sherlock} from '../src/Sherlock'
import {expect} from 'chai'

describe('ArrayTest', () => {
    describe('Sherlock#create(array)', () => {
        const assertions: [any[], number][] = [
            [[], 0],
            [[undefined, undefined, 'y', undefined, undefined], 5],
            [Array(10), 10],
        ]

        assertions.map(([array, expected]) => {
            it(`has length ${expected}`, () => {
                const observable = Sherlock.observe(array)
                const length = observable.length

                expect(length).to.equal(expected)
            })
        })
    })
})
