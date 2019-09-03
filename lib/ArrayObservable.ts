import {Observable} from '../types/sherlock'
import {Properties} from './PropertyBag'

export interface ArrayObservable<T> extends Observable<any> { }

export class ArrayObservable<T> extends Array<T> {
    /**
     * Removes the last element from an array and returns it.
     */
    public pop(): T | undefined {
        return this.splice(this.length - 1, 1)[0]
    }

    /**
     * Appends new elements to an array, and returns the new length of the array.
     *
     * @param items  New elements of the Array.
     */
    public push(...items: T[]): number {
        this.splice(this.length, 0, ...items)

        return this.length
    }

    /**
     * Removes the first element from an array and returns it.
     */
    public shift(): T | undefined {
        return this.splice(0, 1)[0]
    }

    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place,
     * returning the deleted elements.
     *
     * @param start        The zero-based location in the array from which to start removing elements.
     * @param deleteCount  The number of elements to remove.
     * @param items        Elements to insert into the array in place of the deleted elements.
     */
    public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        if (typeof deleteCount !== 'undefined') {
            // truncate deleteCount so we don't delete more items than the array length
            deleteCount = Math.max(Math.min(deleteCount, this.length - start), 0)
        } else {
            // set deleteCount to the remainder of the array
            deleteCount = this.length - start
        }

        let properties = this.propertyBag.properties()

        const result = Object.keys(properties)
            .map(x => Number.parseInt(x))
            .filter(x => x < start)
            .reduce(
                (obj, item) => {
                    obj[item] = properties[item]
                    delete properties[item]

                    return obj
                },
                {} as Properties)

        let index = start

        items.reduce(
            (obj, item) => {
                obj[index++] = item

                return obj
            },
            result)

        const offset = deleteCount - items.length

        Object.keys(properties)
            .map(x => Number.parseInt(x))
            .filter(x => x >= start + deleteCount!)
            .reduce(
                (obj, item) => {
                    obj[item - offset] = properties[item]
                    delete properties[item]

                    return obj
                },
                result)

        const deleted: T[] = Array(deleteCount)

        Object.keys(properties)
            .map(x => Number.parseInt(x))
            .reduce(
                (obj, item) => {
                    obj[item - start] = properties[item]

                    return obj
                },
                deleted)

        properties = this.propertyBag.properties()

        for (const key of Object.keys(result)) {
            // only call set on the PropertyBag if setting a new value
            // or expanding the array
            if (result[key] !== properties[key]
                && ! (
                    typeof result[key] === 'undefined'
                    && properties.length >= key
                    && typeof properties[key] === 'undefined'
                )
            ) {
                this.propertyBag.set(key, result[key])
            }
        }

        for (const key of Object.keys(properties)) {
            if ( ! (key in result)) {
                this.propertyBag.deleteProperty(key)
            }
        }

        this.length = this.length + items.length - deleteCount

        return deleted
    }

    /**
     * Inserts new elements at the start of an array.
     *
     * @param items  Elements to insert at the start of the Array.
     */
    public unshift(...items: T[]): number {
        this.splice(0, 0, ...items)

        return this.length
    }
}
