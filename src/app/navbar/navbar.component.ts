import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  loggedUser = "";

  constructor(private usersService: UsersService){}
              //private router:Router) { }

  ngOnInit(): void {
    this.usersService.getCurrentUsers$().subscribe(userName => this.loggedUser = userName); //tu sa vola koniec rury
    //ked sa vola koniec tak sa rura vytvara
    //vzdy ked nieco vypadne zavola s atato funkcia a zmeni sa inštančna premenna
  }

  logout(){
    this.usersService.logout();
    //this.router.navigateByUrl("/login"); //lepsie urobit v servise --> servis moze robit 
  }
}
