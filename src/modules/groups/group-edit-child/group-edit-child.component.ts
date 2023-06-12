import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Group } from 'src/entities/group';

@Component({
  selector: 'app-group-edit-child',
  templateUrl: './group-edit-child.component.html',
  styleUrls: ['./group-edit-child.component.css']
})
export class GroupEditChildComponent implements OnChanges{
  
  @Input("editingGroup") group? : Group;
  //event emmiter = bo lnahradeny za observable - on deleguje svoju funkcionalitu na observable - vpodstate vraciame observable
  //event save kt u rodica odchytim 
  @Output() save = new EventEmitter<Group>;
  permString  = ""; //s nim budem robit model == to co je v input chlieviku
  name = "";

  //metod azivotneho cyklu on hcanges - bude zavolana vzdy ked sa zmeni imput 
  //nejde to cez observable 
  //vzdy ked nastane zmena atributu v komponente u rodiča 
  ngOnChanges(changes: SimpleChanges): void {
    this.name = this.group?.name || "";
    this.permString = this.group?.permissions.join(", ") || "";
  }

  //toto je detsky komponent ktory sa dajak tvari, daco robi, nejak sa chova 
  //mam enejaky element ktry sa nejak chova
  onSubmit(){
    //potrebujem zo stringu si to vsplitovat skupiny 
    const perms = this.permString.split(",").map(p => p.trim()).filter(p => p !== '') //prazdne string y sa cez tento filter nedostanu mapom otrimujem 
    const g = new Group(this.name, perms, this.group?.id);
    this.save.emit(g); //emit je ako next == nova udalost kt vznikla v utorbach moho komponentu 
  }
}
