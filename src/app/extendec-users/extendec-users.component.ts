import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { GroupsToStringPipe } from 'src/pipes/groups-to-string.pipe';
import { UsersService } from 'src/services/users.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-extendec-users',
  templateUrl: './extendec-users.component.html',
  styleUrls: ['./extendec-users.component.css']
})

export class ExtendecUsersComponent implements OnInit, AfterViewInit {
  columnsToDisplay=["id", "name", "email", "lastLogin", "active", "groups", "perms", "buttons"];
  users: User [] = [];
  usersDataSource = new MatTableDataSource<User>(); //novy zdroj dat pre tabulku 
  @ViewChild(MatPaginator) paginator?: MatPaginator; //otaznicek treba mat 
  @ViewChild(MatSort) sort?: MatSort; //je to komponent kt nema vlastny tag -- nie je elementovy komponent ale atriutovy - byva v hlavice tagu tabulky

  //potrbujem tu zavolat metodu ze daj mi rozsirenych pouzivatelov a dajak tam dat token

  //ten token je zatial v login componente cez onSubmit()
  //dajak ho chcem sem dopraviť 
  //komponnentu logn token netreba -> potrebuje len info či sme boli uspešný alebo nie 

  //token tečie cez tu metodu login v servise --> servis je sngletn je len jeden a moze si tu premennu - token pamatat donekonecna
  //ked z ineho moponentu si zapytame uz len doplnime token z instancnej premennej sevrisu 

  //subscribe musi vzdy volat ten kde sa inicializuje udalost - ned asa volat zo sevrisu ale z login komponentu 

  constructor( private usersService: UsersService,
               private dialog: MatDialog){}

  //tymto sme repojili paginator s nasimi datami kt  samaju zobrazovat v tabulke
  ngAfterViewInit(): void {
    if (this.paginator && this.sort){
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
      const pipe : GroupsToStringPipe = new GroupsToStringPipe(); //vyrobili sme si pipe
      //sortovanie -- fcia bude zavolana pre kazdy riadok 
      this.usersDataSource.sortingDataAccessor = (user:User, colName:string):string | number => {
        switch (colName) {
          case "groups":
            //zavolame pipe
            //return pipe.transform(user.groups || []);
            return user.groups?.length || 0; //pojdem podla dlzky pola --> sortenie 
          case "perms":
            //zavolame pipe
            return pipe.transform(user.groups || [], "perms");
          default:
            return user[colName as keyof User]?.toString() || ""; //on sa snazi zabezpecit 
            //keyof = zabezepcim ze zo vstekych stringov sveta to budu len take stringy kt mozu byt instancnymi premennymi v streide user 
            //? ak bude tak to bude undefined a ptm treba zavolat ""
            //lebo striktne typovanie 
            //toto je skok do defauktneho spravania - hococo tam bud epokusim sa to najst a prerobit na stringy
        
        }
      }
      this.usersDataSource.filterPredicate = (user:User, filter:string):boolean => {
        //poviem v com ma iba hladat 
        if(user.email.toLowerCase().includes(filter)) return true;
        if(user.name.toLowerCase().includes(filter)) return true;
        //if(user.active?.toString().toLowerCase().includes(filter)) return true;
        if(user.groups?.some(group => group.name.toLowerCase().includes(filter))) return true;
        if(user.groups?.flatMap(g => g.permissions).some(p=>p.toLowerCase().includes(filter))) return true;
        //mozeme hladat na zaklade skupin permisiions 
        return false;
      }

    }
  }
  
  ngOnInit(): void {
    //uz sa token z loginu zapamatal 
    //uz tu mame bo
    //this.usersService.getExtendedUsers().subscribe(users => this.users = users);
    //pouzivatelov nehadzeme do pola ale do datasource
    this.usersService.getExtendedUsers().subscribe(users => this.usersDataSource.data = users);
  }

  onFilter(event:any){
    //kazdy event ma vlastnost targer = dom objekt na kt udalost vznikla -- tu ej to imput element kt ma vlastnost value
    const filterText = event.target.value.trim().toLowerCase(); //dame prec whitespaces a dame to lowercase
    //vezmeme dtaasource
    this.usersDataSource.filter = filterText; //on to uz nejako zabezpeci
    this.usersDataSource.paginator?.firstPage();
  }


  //toto bude vyvolavajuci komponent na dialog pri delete 
  //mat dialog mi vie najst dialogovy komponent a pridat mi ho ako dieta == dynamicke pridavanie dietacieho komponent 
  // pri statickom pridavani sme napisali tag a cez to sme si to dotiahli alebo cez router
  //toto je treti sposob cez servis sa vybubli detsky komponent 

  deleteUser(user:User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: new ConfirmDialogData("Deleting user", "do you really want to delete user "
                                                + user.name + " ?") }); //poiem mu dajake data 
    //confirm dialog by si mal povedat ake data by chcel 
    dialogRef.afterClosed().subscribe(decision => {
      if(decision) { //k decision je true chceme mazat 
        this.usersService.deleteUser(user.id || 0).subscribe (sucess => {
          //chceme robit to co robime v on init -> kontaktovat server 
          //ked sa vola tato funkcia vzdy sme uspesny
          if(sucess) {
            this.ngOnInit();
          }
        })//vsetci useri maju idcko takze to ma netrapi ta nula tu 
        //TREBA TU SUBSCRIBE --> SERVER BUDE ZAVOLANY A DACO NAM POSLE 
        //ked to bude 200 daco tak to bude sucess -> cceme aby tam uz vymazany userv tabulke nebol
          //mozeme zmensit pole kt datasorce obsluhuje ALEBO mozeme skontaktovat server a vypitat mnozinu userov znova
      }
      
    });
    
  }


  



 }
