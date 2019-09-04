import {ArrayObservable} from './ArrayObservable'
import {Observable, ObserveOptions} from '../types/sherlock'
import {PropertyBag} from './PropertyBag'
import {SherlockHandler} from './SherlockHandler'

import _ = require('lodash')

export class Sherlock {
    public static observe<T extends object>(target: T, options?: ObserveOptions): Observable<T> {
        if ('propertyBag' in target) {
            return target as Observable<T>
        }

        let observable: Observable<T>

        if (Array.isArray(target)) {
            const arrayObservable = new ArrayObservable(target) as ArrayObservable<T> & T

            observable = Object.assign(arrayObservable, {
                propertyBag: new PropertyBag(true),
            })

            arrayObservable.length = target.length
        } else {
            observable = Object.assign(_.clone(target), {
                propertyBag: new PropertyBag(),
            })
        }

        const requiredOptions = SherlockHandler.getRequiredOptions(options)

        if (requiredOptions.existing) {
            let entries = Object.entries(target) as [keyof T, any][]

            if (requiredOptions.strategy === 'public') {
                entries = entries.filter(([p]) => typeof p === 'string' && p[0] !== '_')
            }

            if (requiredOptions.blacklist.length > 0) {
                entries = entries.filter(([p]) => typeof p === 'string' && requiredOptions.blacklist.indexOf(p) === -1)
            }

            entries.map(([p]) => delete observable[p])
            const proxy = new Proxy(observable, new SherlockHandler(requiredOptions))
            entries.map(([p, value]) => proxy[p] = value)

            return proxy
        } else {
            return new Proxy(observable, new SherlockHandler(requiredOptions))
        }
    }
}
