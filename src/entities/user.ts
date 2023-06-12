import { Group } from "./group";

export class User { //triedu exportujeme bude pouzitelna aj  ineych suboroch

    //staticke metody sa ppisu ako prve
    static clone(user: User): User {
        //vznikne nam kopia usera
        return new User(user.name, user.email, user.id, user.lastLogin, user.password, user.active, user.groups?.map(group => Group.clone(group))); //skupinu musime tiez vyklonovat 
        //musime vyklonovat kazdu skupinu v poli zvlášť
    }
    
    constructor(
        //nepovinne parametre sa davaju cez ? alebo cez default hodnotu 
        //vdaka public sa z toho rovno stanu instancne premenne
        public name: string,
        public email: string,
        public id?: number,
        public lastLogin?: Date,
        public password: string |undefined = '', //ak nemam defult mozem cez * urobit nepovinnu hodnotu, inak cez undefined
        public active:boolean | undefined = true,
        public groups: Group[]  | undefined= []
    ){}
    
    toString():string {
        return `name: ${this.name}, email: ${this.email}, id: ${this.id}, lastLogin: ${this.lastLogin} `;
    }
    
} 