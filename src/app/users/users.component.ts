import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  //vytvorime si premennu 
  users:User[] = [
    new User ("Alica", "mailAlica@mail.com"),
    new User ("Bob", "mailBob@mail.com", 1, new Date(), "heslo"),
    new User ("cyril", "mailCyril@mail.com"),
    {name:"David", email:"david@mail.sk", password:"heslo", active: undefined, groups:undefined,
    toString(): string { return `name: ${this.name} ` }} //POzor ale toto uz nie je objekt user, je to objekt - preto to string nepojde
  ];

  activeUser?: User; //premenna kt moze byt aj undefined
  columnsToDisplay = ["id", "name", "email"];
  errorText = "";

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar //injectujeme snackbar -> angular je framework my nevyrabame instancie ale vyraba ich angular 
    ){} //ak tu dame public prida sa ku instancnym premennym
  

  ngOnInit(): void {
    //tu mozeme menit svoje instancne premenne, dom je hotovy
    //od servisu si mozeme pytat nejake veci
    //servis je injectable - musime si ho najprv popytat
    //vieme cez konstruktor si ho zapytat
    //this.users = this.usersService.getLocalUsers(); //mojich userov nahradim servisovimy
    //ked vracia observable musime urobit subscribe

    this.usersService.getUsers().subscribe(
      //users => this.users = users,
      //error => this.errorText = "server not available!" //toto je deprecated verzia = odporuca sa aby sme nerobili dvojparametrove volanie subscribe
      //potrebujeme 2 fcie zabalit do objektu :
      {
        next: users => this.users = users,
        //dodali sme že get users vybaví chybu --> cez message service
        /*
        error: error => this.snackBar.open("server not available!", "ERROR"), //na vypisanie chyby novy komponent z angular materialu 
        */
       // complete: //ked sa uzavrie prud dat -> netreba nam 
        //yabalenie fcii do objektu je lepsie 
      }
      );

  }
  

  onUserClick(user: User) {
    //ochytime udalost klik v html a toto sa pri kliku zavolam
    //budem predpokladat ze mi pride user
    this.activeUser = user;
  }
  //chcem zavolat metodu getLocalUsers() z users service a nahradit tychto userov servisovimy
}
