import {Sherlock} from '../lib/Sherlock'
import {createEmployee} from './helpers/factories'
import {expect} from 'chai'

describe('Sherlock#isDirty()', () => {
    it('is false for an empty object', async () => {
        const observable = Sherlock.observe({})
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(false)
    })

    it('is false for a synced object', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(false)
    })

    it('is true for a new object', async () => {
        const observable = Sherlock.observe(createEmployee())
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(true)
    })

    it('is true when changing an existing property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.firstName = 'Jane'
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(true)
    })

    it('is true when adding a property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.age = 30
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(true)
    })

    it('is true when deleting a property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        delete observable.title
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(true)
    })

    it('is false when set does not change the value', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.firstName = 'John'
        const isDirty = observable.propertyBag.isDirty()

        expect(isDirty).to.equal(false)
    })
})
