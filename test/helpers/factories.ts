interface PersonConstructor {
    firstName: string
    lastName: string
    age?: number
}

export class Person {
    public firstName: string
    public lastName: string
    public age?: number
    public dateJoined?: Date
    public dateLeft?: Date

    public constructor(ctor: PersonConstructor) {
        this.firstName = ctor.firstName
        this.lastName = ctor.lastName
        this.age = ctor.age
    }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }
}

interface EmployeeConstructor extends PersonConstructor {
    title: string
    departments?: string[]
}

export class Employee extends Person {
    public title: string
    public departments: string[]

    public constructor(ctor: EmployeeConstructor) {
        super(ctor)

        this.title = ctor.title
        this.departments = ctor.departments || []
    }
}

export const createEmployee = (): Employee => {
    return new Employee({
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Engineer',
    })
}
