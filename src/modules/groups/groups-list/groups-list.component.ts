import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit{
  groupToEdit?: Group;
  groups$?: Observable<Group[]> //je to rura tak na konci sa pise dolar 
  //do tejto rury NESMIE NIKDY PRITIECT CHYBA LEBO ROBIIME SUBSCRIBE CEZ ASYNC

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.groups$ = this.usersService.getGroups(); // ZAPAMATAM SI LEN RURU - > NEUROBIM SUBSCRIBE
    
  }

  onSave(groupToSave: Group){

    this.usersService.saveGroup(groupToSave).subscribe(saved => {
      this.ngOnInit();
      this.groupToEdit = undefined;
    });
  }

}
