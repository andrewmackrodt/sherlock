import {ArrayObservable} from './ArrayObservable'
import {Observable, ObserveOptions} from '../types/sherlock'
import {Sherlock} from './Sherlock'

import _ = require('lodash')

export class SherlockHandler<T extends object, U extends Observable<T>> implements ProxyHandler<U> {
    protected readonly options: Required<ObserveOptions>

    public static getRequiredOptions(options?: ObserveOptions): Required<ObserveOptions> {
        return Object.assign(
            {
                existing: true,
                strategy: 'public',
                blacklist: [],
                deep: true,
                ownKeysStrategy: 'proxy',
            },
            options)
    }

    public constructor(options?: ObserveOptions) {
        this.options = SherlockHandler.getRequiredOptions(options)
    }

    public getOwnPropertyDescriptor(target: U, p: PropertyKey): PropertyDescriptor | undefined {
        if (typeof p === 'symbol' || p in target || this.isNotObserved(p)) {
            return Reflect.getOwnPropertyDescriptor(target, p)
        }

        if (!target.propertyBag.has(p)) {
            return
        }

        return {
            configurable: true,
            enumerable: true,
            writable: true,
            value: target.propertyBag.get(p),
        }
    }

    public has(target: U, p: PropertyKey): boolean {
        if (typeof p === 'symbol' || p in target || this.isNotObserved(p)) {
            return Reflect.has(target, p)
        }

        return target.propertyBag.has(p)
    }

    public get(target: U, p: PropertyKey, receiver: any): any {
        if (typeof p === 'symbol' || p in target || this.isNotObserved(p)) {
            return Reflect.get(target, p, receiver)
        }

        return target.propertyBag.get(p)
    }

    public set(target: U, p: PropertyKey, value: any, receiver: any): boolean {
        if (typeof p === 'symbol' || p in target || this.isNotObserved(p)) {
            Reflect.set(target, p, value, receiver)

            return true
        }

        // recursively proxy child object if options.deep
        if (this.options.deep && typeof value === 'object' && value !== null) {
            value = _.clone(value)
            for (const [k, v] of Object.entries(value)) {
                if (typeof v === 'object' && v !== null) {
                    value[k] = Sherlock.observe(v, this.options)
                }
            }
            value = Sherlock.observe(value, this.options)
        }

        if (target instanceof ArrayObservable
            && typeof p === 'string'
            && ! Number.isNaN(Number.parseInt(p, 10))
        ) {
            p = Number.parseInt(p, 10)

            target.propertyBag.set(p, value)

            if (p >= target.length) {
                target.length = p + 1
            }
        } else {
            target.propertyBag.set(p, value)
        }

        return true
    }

    public deleteProperty(target: U, p: PropertyKey): boolean {
        if (typeof p === 'symbol' || p in target || this.isNotObserved(p)) {
            Reflect.deleteProperty(target, p)

            return true
        }

        if (target instanceof ArrayObservable
            && typeof p === 'string'
            && ! Number.isNaN(Number.parseInt(p, 10))
        ) {
            p = Number.parseInt(p, 10)
        }

        target.propertyBag.deleteProperty(p)

        return true
    }

    public ownKeys(target: U): PropertyKey[] {
        if (this.options.ownKeysStrategy === 'all') {
            return Reflect.ownKeys(target)
                .filter(p => p !== 'propertyBag')
                .concat(target.propertyBag.keys())
        } else {
            return target.propertyBag.keys()
        }
    }

    protected isNotObserved(p: string | number): boolean {
        return this.options.strategy !== 'public'
            || (
                typeof p === 'string'
                && (
                    p[0] === '_'
                    || this.options.blacklist.indexOf(p) !== -1
                ))
    }
}
