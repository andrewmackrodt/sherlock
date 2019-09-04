type DateModifiedCallback = (timestamp: number, receiver: DateObservable) => void

export class DateObservable extends Date {
    protected callback!: DateModifiedCallback

    public static create(date: Date, callback: DateModifiedCallback): DateObservable {
        const instance: DateObservable = new this(date.getTime())
        instance.callback = callback

        return instance
    }

    public unregister() {
        this.callback = () => { }
    }

    /**
     * Sets the date and time value in the Date object.
     *
     * @param time A numeric value representing the number of elapsed milliseconds since midnight, January 1, 1970 GMT.
     */
    public setTime(time: number): number {
        // @ts-ignore
        const timestamp = super.setTime(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the milliseconds value in the Date object using local time.
     *
     * @param ms A numeric value equal to the millisecond value.
     */
    public setMilliseconds(ms: number): number {
        // @ts-ignore
        const timestamp = super.setMilliseconds(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the milliseconds value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param ms A numeric value equal to the millisecond value.
     */
    public setUTCMilliseconds(ms: number): number {
        // @ts-ignore
        const timestamp = super.setUTCMilliseconds(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the seconds value in the Date object using local time.
     *
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setSeconds(sec: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setSeconds(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the seconds value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setUTCSeconds(sec: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setUTCSeconds(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the minutes value in the Date object using local time.
     *
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setMinutes(min: number, sec?: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setMinutes(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the minutes value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setUTCMinutes(min: number, sec?: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setUTCMinutes(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the hour value in the Date object using local time.
     *
     * @param hours A numeric value equal to the hours value.
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setHours(hours: number, min?: number, sec?: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setHours(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the hours value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param hours A numeric value equal to the hours value.
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    public setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number {
        // @ts-ignore
        const timestamp = super.setUTCHours(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the numeric day-of-the-month value of the Date object using local time.
     *
     * @param date A numeric value equal to the day of the month.
     */
    public setDate(date: number): number {
        // @ts-ignore
        const timestamp = super.setDate(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the numeric day of the month in the Date object using Universal Coordinated Time (UTC).
     *
     * @param date A numeric value equal to the day of the month.
     */
    public setUTCDate(date: number): number {
        // @ts-ignore
        const timestamp = super.setUTCDate(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the month value in the Date object using local time.
     *
     * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
     * @param date A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used.
     */
    public setMonth(month: number, date?: number): number {
        // @ts-ignore
        const timestamp = super.setMonth(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the month value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
     * @param date A numeric value representing the day of the month. If it is not supplied, the value from a call to the getUTCDate method is used.
     */
    public setUTCMonth(month: number, date?: number): number {
        // @ts-ignore
        const timestamp = super.setUTCMonth(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the year of the Date object using local time.
     *
     * @param year A numeric value for the year.
     * @param month A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified.
     * @param date A numeric value equal for the day of the month.
     */
    public setFullYear(year: number, month?: number, date?: number): number {
        // @ts-ignore
        const timestamp = super.setFullYear(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }

    /**
     * Sets the year value in the Date object using Universal Coordinated Time (UTC).
     *
     * @param year A numeric value equal to the year.
     * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. Must be supplied if numDate is supplied.
     * @param date A numeric value equal to the day of the month.
     */
    public setUTCFullYear(year: number, month?: number, date?: number): number {
        // @ts-ignore
        const timestamp = super.setUTCFullYear(...arguments)
        this.callback(timestamp, this)

        return timestamp
    }
}
