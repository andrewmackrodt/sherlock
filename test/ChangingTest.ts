import {Sherlock} from '../lib/Sherlock'
import {createEmployee} from './helpers/factories'
import {expect} from 'chai'

describe('Sherlock#changing()', () => {
    it('is undefined for an empty object', async () => {
        const observable = Sherlock.observe({})
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal(undefined)
    })

    it('is undefined for a synced object', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal(undefined)
    })

    it('contains constructor properties for a new object', async () => {
        const observable = Sherlock.observe(createEmployee())
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({
            firstName: 'John',
            lastName: 'Doe',
            title: 'Software Engineer',
            departments: [],
        })
    })

    it('contains a changed existing property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.firstName = 'Jane'
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({ firstName: 'Jane' })
    })

    it('contains an added property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.age = 30
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({ age: 30 })
    })

    it('contains a deleted property', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        delete observable.title
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({ title: undefined })
    })

    it('is undefined when set does not change the value', async () => {
        const observable = Sherlock.observe(createEmployee())
        observable.propertyBag.sync()
        observable.firstName = 'John'
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal(undefined)
    })
})
