export class Person {
  constructor(
    public id: number,
    public krstneMeno: string,
    public stredneMeno: string,
    public priezvisko: string
  ){}

  static ifNull(meno: string):string{
    if(meno==null){
      return "";
    }
    return meno;
  }

  static toString(person:Person):string{
    //console.log(this.ifNull(this.krstneMeno)+ " "+this.ifNull(this.stredneMeno) + " " + this.ifNull(this.priezvisko));
    return this.ifNull(person.krstneMeno)+ " "+this.ifNull(person.stredneMeno) + " " + this.ifNull(person.priezvisko);
  }
  
}