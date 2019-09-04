import {Sherlock} from '../src/Sherlock'
import {createEmployee} from './helpers/factories'
import {expect} from 'chai'

describe('DateTest', () => {
    it('is changed when setting new date object with different time', () => {
        const oldDate = new Date(1999, 0, 1, 0, 0, 0, 0)
        const newDate = new Date(2000, 0, 1, 0, 0, 0, 0)

        const observable = Sherlock.observe(createEmployee())
        observable.dateJoined = oldDate
        observable.propertyBag.sync()
        observable.dateJoined = newDate

        const original = { dateJoined: observable.propertyBag.original()['dateJoined'] }
        expect(original).to.deep.equal({ dateJoined: oldDate })

        const changed = observable.propertyBag.changing()
        expect(changed).to.deep.equal({ dateJoined: newDate })
    })

    it('is not changed when setting time on original date object', () => {
        const observable = Sherlock.observe(createEmployee())
        const dateJoined = new Date(1999, 0, 1, 0, 0, 0, 0)
        observable.dateJoined = dateJoined
        observable.propertyBag.sync()
        dateJoined.setFullYear(2000)

        expect(observable.dateJoined).to.deep.equal(new Date(1999, 0, 1, 0, 0, 0, 0))
    })

    it('is changed when setting time on proxied date object', () => {
        const observable = Sherlock.observe(createEmployee())
        observable.dateJoined = new Date(1999, 0, 1, 0, 0, 0, 0)
        observable.propertyBag.sync()
        observable.dateJoined.setFullYear(2000)
        const changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({ dateJoined: new Date(2000, 0, 1, 0, 0, 0, 0) })
    })

    it('is not changed when setting new date object with same time', () => {
        const oldDate = new Date(1999, 0, 1, 0, 0, 0, 0)
        const newDate = new Date(1999, 0, 1, 0, 0, 0, 0)

        const observable = Sherlock.observe(createEmployee())
        observable.dateJoined = oldDate
        observable.propertyBag.sync()
        observable.dateJoined = newDate

        const original = { dateJoined: observable.propertyBag.original()['dateJoined'] }
        expect(original).to.deep.equal({ dateJoined: oldDate })

        const changed = observable.propertyBag.changing()
        expect(changed).to.deep.equal(undefined)
    })

    it('is not changed after modifying a replaced date object', () => {
        const observable = Sherlock.observe(createEmployee())

        observable.dateJoined = new Date(1999, 0, 1, 0, 0, 0, 0)
        const oldDate = observable.dateJoined

        observable.dateJoined = new Date(2000, 0, 1, 0, 0, 0, 0)
        const newDate = observable.dateJoined

        observable.propertyBag.sync()

        oldDate.setFullYear(2009)
        let changed = observable.propertyBag.changing()
        expect(changed).to.deep.equal(undefined)

        newDate.setFullYear(2019)
        changed = observable.propertyBag.changing()
        expect(changed).to.deep.equal({ dateJoined: new Date(2019, 0, 1, 0, 0, 0, 0) })
    })

    it('observes multiple date change events when setting date from existing observable', () => {
        const observable = Sherlock.observe(createEmployee())

        observable.dateJoined = new Date(1999, 0, 1, 0, 0, 0, 0)
        observable.dateLeft = observable.dateJoined
        observable.propertyBag.sync()

        let changed = observable.propertyBag.changing()

        expect(changed).to.be.undefined

        observable.dateJoined.setFullYear(2005)
        observable.dateLeft.setFullYear(2009)

        changed = observable.propertyBag.changing()

        expect(changed).to.deep.equal({
            dateJoined: new Date(2005, 0, 1, 0, 0, 0, 0),
            dateLeft: new Date(2009, 0, 1, 0, 0, 0, 0),
        })
    })
})
