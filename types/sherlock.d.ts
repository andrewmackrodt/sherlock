import {PropertyBag} from '../src/PropertyBag'

export type Observable<T extends object> = T & {
    propertyBag: PropertyBag
}

export interface ObserveOptions {
    /**
     * Deletes existing properties from the target and sets them on the proxy
     * object to populate `_propertyBag`. This is required to observe changes
     * when an object sets properties in its constructor.
     *
     * Default: true
     */
    existing?: boolean

    /**
     * The strategy to use when observing string keys. `public` only observes
     * properties which do not begin with an underscore. `all` observes all
     * properties.
     *
     * Default: public
     */
    strategy?: 'public' | 'all'

    /**
     * Properties which should not be observed.
     */
    blacklist?: string[]

    /**
     * Default: true
     */
    deep?: boolean

    /**
     * Default: proxy
     */
    ownKeysStrategy?: 'proxy' | 'all'
}
