import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupResolverService } from 'src/guards/group-resolver.service';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';

const routes: Routes = [
//u rodica bol groups fixnuty - odtiaz z path: "groups" groups vymazem
//prazdna "" znamena ze sa to nalepi k predoslemu
{path: '', component: GroupsMenuComponent, //toto je pravidlo kt sa napise nad pravidla app routing modulu -- lebo tie moduly su importovane v danom poradi 
    //groups module z app module vyhodim lebo ho chcem dotahovat dynamicky
    children: [
      {path: '', component: GroupsListComponent},
      {path: 'detail/:id', 
        component:GroupDetailComponent,
        resolve: {group:GroupResolverService} // do premennej vkladaj veci cez groupresolver service
      //do data prihodi tuto premennu -- data napr v app routing module -- doplnujem do objektu data novu intsancnu premennu a hodnotu doda resolver
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
