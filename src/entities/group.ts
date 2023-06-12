export class Group {
    static clone(group: Group): Group {
        return new Group(group.name, [...group.permissions], group.id)
    }

    constructor(
        public name: string,
        public permissions: string[] = [],
        public id?: number
    ) { }

    /*
    toString():string {
        return `(name: ${this.name}, id: ${this.id}, permissions: ${this.permissions} )`;
    }
    */
}