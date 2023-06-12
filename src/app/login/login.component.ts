import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/entities/auth';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  auth = new Auth("Peter","sovy"); //defaultne hodnoty --> daco take chceme odoslať
  //notSucessful = false;
  message="";

  /*
  getAuth(){ //pomocný výpis --> objektu auth
    return JSON.stringify(this.auth); //zo šablony json nie je vyditelny -- musime z toho spravit string 
  }*/

  constructor(private usersService: UsersService,
              private router: Router){ //bud eto ten isty usersservice ako v users componente lebo singleton
  
  }

  onSubmit(){
    //chceme odoslat auth na server --> nema sa to robit v komonente ale v servise
    //ppotrebujem referenciu na servis --> cez konštruktor --. angular to doda za nas 
    this.usersService.login(this.auth).subscribe(sucess => {
      if(sucess) {
        //idem na extended users
        //chceme ist na inu adrsu kde s abude extended user zobrazovat
        //cey router
        this.router.navigateByUrl(this.usersService.navigateAfterLogin); //sem sa dostaneme ked sa dobre prihlasime
        //sa spytame servisu na to kam chceme ist po tom co spravime login
      } else {
        //vypisem ze zle heslo alebo login
        //nech v komponente vzpise ye ylz login alebo heslo 
        //this.notSucessful = true;
        this.message = "Zlý login alebo heslo!";
        setTimeout(() => this.message = "", 3000); // --> po 3 sekundách sa premenná zmení na ""
      }
    }) 
  }

}
