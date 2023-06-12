import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group>{

  constructor(private usersService: UsersService) { }

  //promise je nieco ako observable ale vrati nic alebo jednu vec - rura na jeden objekt - nieco ako future v jave
  //vieme pouzit s wait - ked prvok pride zobudi sa kod - da sa to pisat skoro ako synchronne
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot) : Group | Observable<Group> | Promise<Group> {
            const groupId = +(route.paramMap.get("id") || 0) //ak pride string cez plus z neho spravime cislo inak vratime nulu 
            return this.usersService.getGroup(groupId);
          }

  //v pravidle mame ze pride idcko - toto idcko si potrebujem ziskat-> nato actvated route snapshot
}
