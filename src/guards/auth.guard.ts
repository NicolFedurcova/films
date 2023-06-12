import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {

  //injectnem si service
  constructor(private usersService: UsersService,
              private router: Router){}

  //miesto can load 
  //vraci atrue alebo false ci chcem alebo nechcem naloadovat
  //url adresa sa ziskava nie cez path ale cez route.path
  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("Match guarding url: " + route.path);
    //route znamena ze dane pravidlo este nebolo vyhodnotene ako uspesne 
    return this.canAnything(route.path || "")
  }

  canActivate(
    route: ActivatedRouteSnapshot,//pravidlo uz bolo vyhodnotene ako uspesne -> lebo activated 
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("guarding url: " + state.url);
    return this.canAnything(state.url || "")
    
  }

  canAnything(url:string): Observable<boolean>{
    return this.usersService.isLoggedInAsync().pipe(//asynchronny pravi este extra dopyt na server ci je token platny
      tap(ok => {
        if(!ok) {
          this.usersService.navigateAfterLogin = url; //ak sa mi vrai false tak do premennej ulozim kde sa prave nachadzam
          //a potom s aponavigujem na logina z loginu potom nazad sem
          
          this.router.navigateByUrl("/login");
      }
    })
    ); 
  }
  
}
