import { Pipe, PipeTransform } from '@angular/core';
import { Person } from 'src/entities/person';

@Pipe({
  name: 'directorsToString'
})
export class DirectorsToStringPipe implements PipeTransform {

  transform(directors: Person[]): string {
    
    return directors.map(dir => Person.toString(dir)).join(", ");  
  }

}
