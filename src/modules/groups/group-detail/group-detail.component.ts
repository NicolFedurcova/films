import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit{
  //tu si zapytame data z guarda resolver service

  group?: Group;

  constructor(private route: ActivatedRoute,
              private usersService: UsersService){} //uz nie snapshot ako v guardovi 
  ngOnInit(): void {
    //z data si vytiahnem premennu group a pouzijem --> data je observable !!!!

    this.route.data.subscribe(data => {
        if (data['group']) {
          this.group = data['group']; //viem ze tam bude skupina inak by mi resolver neotvoril tento komponent !!!!!!!!!!!!!!!!!!!
          //z data vylieza any  - to vieme vpochat do premennej hociakeho typu 
          
        }
    })
  }

  onSave(groupToSave: Group){
    //dieta mi poslalo group
    //v servise save group
    this.usersService.saveGroup(groupToSave).subscribe(saved => this.group = saved);
  }

}
