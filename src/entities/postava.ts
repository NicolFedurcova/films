import { Person } from "./person";

export class Postava {
  constructor(
    public postava: string,
    public dolezitost: "hlavná postava" | "vedľajšia postava",
    public herec: Person
  ){}

  static ifNull(meno: string):string{
    if(meno==null){
      return "";
    }
    return meno;
  }


  static toString(postava:Postava):string{
    return (this.ifNull(postava.postava)+ " ("+this.ifNull(postava.dolezitost) + "): ").toString();
  }
}