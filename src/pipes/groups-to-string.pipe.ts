import { Pipe, PipeTransform } from '@angular/core';
import { Group } from 'src/entities/group';

@Pipe({
  name: 'groupsToString'
})
export class GroupsToStringPipe implements PipeTransform {

  //value su veci co sa pisu za dvojbodky --> argumenty

  transform(groups: Group[], options?:string): string { //options je nepovinyn parameter
    //ccem vypisat mena skuin ako retazec 
    //skuoina je objekt a ma name permisiions a id
    //chceme sa dostat ku kazdej skupine ku atributu name
    if(options ==="perms"){
      return groups.flatMap(group => group.permissions) //p prichadza z flatmapu
                            .reduce((acc : string[],p) => acc.includes (p) ? acc : [...acc, p],[]) //to su len string - primitivne typy mozeme sa pytat cez includes 
                            .join(", ")
      //cez flatmap mame pole s duplicitami --> duplicity odstranime cez reduce
    }
    return groups.map(group => group.name).join(", "); //join urobí to že nam pole stringov spojí do jedneho stringu a ako oddelovac pouzije , 
  }

}
