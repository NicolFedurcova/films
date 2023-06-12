import { NgModule } from '@angular/core';
import { Routes , RouterModule} from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeactivateGuard } from 'src/guards/deactivate.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ExtendecUsersComponent } from './extendec-users/extendec-users.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
//import { CommonModule } from '@angular/common'; //zmazeme - sluzi na veci co budu neskor

const routes : Routes = [

//pole pravidiel kt chceme zabezpecit 
  { path: "users", component: UsersComponent }, //za localhost:4200/ --> akusers chcem vidiet userov
  {path: "extended-users", 
  component: ExtendecUsersComponent,
  canActivate: [AuthGuard]
  },
  {path: "user/edit/:id", component:EditUserComponent,
  canActivate:[AuthGuard], //tento guard bude chranit pri kazdej zmene idcka --> bude chranit aj edit 1 aj edit 2 
  canDeactivate:[DeactivateGuard]
  }, //vtedy chceme poslat komponent edit user, v edit user chceme idcko prijat
  //dame si ten isty komponent aj na editaciu aj na vytvaranie noveho --> ak pride id tak je to edit ak nie je to new
  //da sa to poreist aj cez data -> dva prudy a skamaratovat ich 
  {path:"user/new", 
  component:EditUserComponent,
  canActivate: [AuthGuard],
  canDeactivate:[DeactivateGuard]
  },
  { path: "login", component: LoginComponent }, //--> chcem login
  { path: "register", component: RegisterComponent },
  //v hlavnom module sme si fixli groups - aj groups modue ma svoj router 
  {path: "groups",
    canMatch: [AuthGuard], //do groups mozem ist len ked som prihlaseny - auth guard ako match
    canActivate: [AuthGuard], //
    loadChildren: () => //hovorim ze ak nieco zacina na groups dotiahni cel ymodul 
    import('../modules/groups/groups.module').then(mod => mod.GroupsModule)
  },
  {path: "films", 
    loadChildren: () => 
    import('../modules/films/films.module').then(mod => mod.FilmsModule)
  },
  {path: "chat", 
    loadChildren: () => 
    import('../modules/chat/chat.module').then(mod => mod.ChatModule)
  },
  //musime explicitne uviest kde chceme vidiet tieto veci kt router urcuje --> v app.component. html
  { path: "", redirectTo: "users", pathMatch: "full"}, //ak by tam nebol pathmatch full tak by to zachytilo vsetko co za lomkou ma len jedno slovo
  //nemozem robit redirect na redirect = ochrana proti zacykleniu 
  { path: "**", component: Page404Component} //ked bude hocico ine ako to co zachytia predchadzajuce pravila budem vypisovat page 404 komponent 
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes) //hlavny router - for root --> do app routing modulu si davame root modul ktory modifikujeme podl apravidiel z hora
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
