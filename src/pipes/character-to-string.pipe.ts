import { Pipe, PipeTransform } from '@angular/core';
import { Person } from 'src/entities/person';
import { Postava } from 'src/entities/postava';

@Pipe({
  name: 'characterToString'
})
export class CharacterToStringPipe implements PipeTransform {  

  transform(characters: Postava[]): string {
     return characters.map(char => Postava.toString(char)).join(", ");  
  
  }

}
