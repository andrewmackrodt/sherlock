import {ArrayObservable} from './ArrayObservable'

export interface Properties {
    [key: string]: any
}

type PropertyBagKey = string | number

type ChangeFormat = 'default' | 'flat' | 'object'

import {dot, object} from 'dot-object'
import _ = require('lodash')

// export interface PropertyChange {
//     newValue: any
//     oldValue: any
// }

export class PropertyBag {
    //region dictionary of [propertyKey: value] with the current object state
    protected readonly _properties: Properties = {}

    public properties(flatten: boolean = false): Properties {
        const keys = Object.keys(this._properties).filter(x => this.children.indexOf(x) === -1)
        const properties = this.extract(this._properties, keys, (bag) => bag.properties(flatten))

        return flatten ? dot(properties) : object(properties)
    }

    //endregion

    //region dictionary of [propertyKey: value] with the original object state
    protected _original: Properties = {}

    public original(flatten: boolean = false): Properties {
        const keys = Object.keys(this._original).filter(x => this.children.indexOf(x) === -1)
        const original = this.extract(this._original, keys, (bag) => bag.properties(flatten))

        return flatten ? dot(original) : object(original)
    }

    //endregion

    //region property keys which have been modified but not yet synced
    protected _changing: PropertyBagKey[] = []
    protected _adding: PropertyBagKey[] = []
    protected _deleting: PropertyBagKey[] = []

    public changing(format: ChangeFormat = 'default', depth: number = 0): Properties | undefined {
        const changes = this.extract(
            this._properties,
            this._changing,
            (bag) => bag.changing(format, depth + 1)!,
        )

        if (depth > 0 || Object.keys(changes).length !== 0) {
            if (format !== 'default') {
                return format === 'flat' ? dot(changes) : object(changes)
            } else {
                return changes
            }
        }
    }

    public adding(format: ChangeFormat = 'default', depth: number = 0): Properties | undefined {
        const changes = this.extract(
            this._properties,
            this._adding,
            (bag) => bag.adding(format, depth + 1)!,
        )

        if (depth > 0 || Object.keys(changes).length !== 0) {
            if (format !== 'default') {
                return format === 'flat' ? dot(changes) : object(changes)
            } else {
                return changes
            }
        }
    }

    public deleting(format: ChangeFormat = 'default', depth: number = 0): Properties | undefined {
        const changes = this.extract(
            this._original,
            this._deleting,
            (bag) => bag.deleting(format, depth + 1)!,
        )

        if (depth > 0 || Object.keys(changes).length !== 0) {
            if (format !== 'default') {
                return format === 'flat' ? dot(changes) : object(changes)
            } else {
                return changes
            }
        }
    }

    //endregion

    //region dictionary of [propertyKey: value] which were modified during the last sync
    protected _changed: Properties | undefined
    protected _added: Properties | undefined
    protected _deleted: Properties | undefined

    public changed(): Properties | undefined {
        return this._changed
    }

    public added(): Properties | undefined {
        return this._added
    }

    public deleted(): Properties | undefined {
        return this._deleted
    }

    //endregion

    /**
     * List of keys which contain additional property bags. This is used to
     * detect changes recursively in child objects without taking a large
     * performance hit.
     */
    protected readonly children: PropertyBagKey[] = []

    protected isArray: boolean

    public constructor(isArray: boolean = false) {
        this.isArray = isArray
    }

    public isDirty(): boolean {
        if (this._changing.length !== 0) {
            return true
        }

        for (const child of this.children) {
            const bag = this._properties[child].propertyBag

            if (bag.isDirty()) {
                return true
            }
        }

        return false
    }

    public sync(clean: boolean = false) {
        if (!clean) {
            this._changed = this.changing()
            this._added = this.adding()
            this._deleted = this.deleting()
        } else {
            this._changed = undefined
            this._added = undefined
            this._deleted = undefined
        }

        this._changing = []
        this._adding = []
        this._deleting = []

        this._original = _.clone(this._properties)

        for (const child of this.children) {
            const bag: PropertyBag = this._properties[child].propertyBag

            bag.sync(clean)
        }
    }

    public keys(): string[] {
        return Object.keys(this._properties)
    }

    public values<T>(): T[] {
        return Object.values(this._properties)
    }

    public has(p: PropertyBagKey): boolean {
        return p in this._properties
    }

    public get(p: PropertyBagKey): any {
        return this._properties[p]
    }

    public set(p: PropertyBagKey, value: any) {
        const previous = this._properties[p]
        const previousIsBag = typeof previous === 'object' && 'propertyBag' in previous

        if (typeof value === 'object' && 'propertyBag' in value) {
            if (previousIsBag) {
                previous.propertyBag.replace(value.propertyBag.properties())

                this.isArray = value instanceof ArrayObservable
            } else {
                this._properties[p] = value
            }

            this.addPropertyKey(p, this.children)
        } else {
            if (_.isEqual(value, previous)) {
                return
            }

            this._properties[p] = value

            const original = this._original[p]

            if (!_.isEqual(value, original)) {
                if (previousIsBag) {
                    // call deleteProperty on the previous PropertyBag, although it
                    // won't be included in the change set, we may want to emit
                    // events if that is implemented in the future
                    previous.propertyBag.replace({})

                    this.isArray = false
                }

                if (typeof previous === 'undefined') {
                    this.addPropertyKey(p, this._adding)
                }

                this.addPropertyKey(p, this._changing)
            } else {
                this.removePropertyKey(p, this._changing)
            }

            this.removePropertyKey(p, this.children)
        }
    }

    public deleteProperty(p: PropertyBagKey) {
        if (!(p in this._properties)) {
            return
        }

        this.removePropertyKey(p, this.children)
        this.removePropertyKey(p, this._adding)
        this.addPropertyKey(p, this._changing)
        this.addPropertyKey(p, this._deleting)

        delete this._properties[p]
    }

    protected replace(properties: Properties) {
        for (const p of this.keys()) {
            if (!(p in properties)) {
                this.deleteProperty(p)
            }
        }

        for (const [p, value] of Object.entries(properties)) {
            this.set(p, value)
        }
    }

    protected extract(
        properties: Properties,
        keys: PropertyBagKey[],
        fn: (bag: PropertyBag) => Properties,
    ): Properties {
        let result: Properties = this.isArray ? [] : {}

        keys.reduce(
            (obj, item) => {
                obj[item] = properties[item]

                if (typeof obj[item] === 'undefined') {
                    // todo add deleted class
                    obj[item] = undefined
                }

                return obj
            },
            result)

        for (const child of this.children) {
            // child relations may be empty when calling `this.delete()`
            // so skip it, the previous value should already be part of
            // the result variable set above
            if (typeof properties[child] === 'undefined') {
                continue
            }

            const bag: PropertyBag = properties[child].propertyBag
            const values = fn(bag)

            if (child in this._original) {
                for (const key of Object.keys(values)) {
                    result[`${child}.${key}`] = values[key]
                }
            } else {
                result[child] = values
            }
        }

        return result
    }

    protected addPropertyKey(p: PropertyBagKey, array: PropertyBagKey[]) {
        if (array.indexOf(p) === -1) {
            array.push(p)
        }
    }

    protected removePropertyKey(p: PropertyBagKey, array: PropertyBagKey[]) {
        let index = array.indexOf(p.toString())

        if (index !== -1) {
            array.splice(index, 1)
        }
    }
}
