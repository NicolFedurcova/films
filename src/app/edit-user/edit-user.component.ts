// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { EMPTY, switchMap } from 'rxjs';
// import { User } from 'src/entities/user';
// import { UsersService } from 'src/services/users.service';

// @Component({
//   selector: 'app-edit-user',
//   templateUrl: './edit-user.component.html',
//   styleUrls: ['./edit-user.component.css']
// })
// export class EditUserComponent implements OnInit{

//   userId?:number;
//   user?: User;
//   constructor (private route: ActivatedRoute,
//                private usersService: UsersService){}

//   ngOnInit(): void { //VOLA SA LEN KED SSAKOMPONENT VYRABA -> AK SA ZMENI TAK IDCKO SO SI TU DOLEPIM SA NEZMENI !!!!!!!!! -> na to rura parma MAP kt vracia observable - z nej budu vypadavat nove parametre vzdy ked sa zmenia 
//     //chcem idcko z url adresy - viem to rbit vseliakymi sposobmi 
//     //parms = parametre vytahane z url adresy
//     //this.userId = +this.route.snapshot.params["id"]; //1string JE AUTOMATICKA PRETYPOVACK ANA INTEGER
//     this.route.paramMap.pipe(
//       switchMap(params => {
//       this.userId = +(params.get("id") || "");
//       if(this.userId){
//         return this.usersService.getUser(this.userId)//.subscribe(user => this.user = user);
//       } else {
//         return EMPTY;
//       }
//     }).subscribe(user => this.user = user)
//     //userid je typu nejakych params = cosi  stringoidne -- asi any 
//   }
//   //v subscribe mame druhy subscribe a mame 2 zachytne funkcie --> TOTO SA V PRUDOVOM SPRACOVANI ROBIT NEMAAAAAAAA
//   //spravne vzdy iba na konci je jednej SUBSCRIBE - ostatne pomocou prudovych operatororv --> napr cez switch map 
  
// }

import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { CanDeacivateComponet } from 'src/guards/deactivate.guard';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, CanDeacivateComponet {
  hide = true;
  userId?:number;
  allGroups: Group[] = []
  user?: User;
  saved = false;

  editForm = new FormGroup({
    name: new FormControl<string>('',{nonNullable: true,
                                      validators: [Validators.required],
                                      asyncValidators: this.userConflictsValidator('name')}),
    email: new FormControl('',[Validators.required, 
                               Validators.email,
                               Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],
                              this.userConflictsValidator('email')),
    password: new FormControl(''),
    active: new FormControl<boolean>(false, {nonNullable: true}),
    groups: new FormArray([]) //aby sme dnamick vedli generovat checkboxov tolko kolko pritecie skupin 
    //do groups dame tolko boolean form ocntrolov kolko je tych skupin
    //nestaci ze deti groups maju kamaratov v html, aj groups musia byt samaratene s niecim vkomponente!!!!!!!!!§
    //!!!!!!!!!!!!!!!!!!!!!!§IMPORTANT
  });


  constructor(private route: ActivatedRoute,
              private usersService: UsersService,
              private router: Router){}
              
  canDeactivate():boolean | Observable<boolean> {
    if(this.saved) return true;
    if(this.user?.name !== this.name.value) return false;
    if(this.user?.email !== this.email.value) return false;
    if(this.user?.active !== this.active.value) return false;
    //s grupami by sa trebalo viacej pohrat 
    return true;
  };
  
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        if(params.has("id")) {//editing user
          this.userId = +(params.get("id") || '');
          if (this.userId) {
            return this.usersService.getUser(this.userId)
          } else {
            return EMPTY;
          }
        } else { // new user -> rovno poslem of new user
          return of(new User("","",undefined, undefined, "", true, []));
        }
    })
    ).subscribe(user => {
      this.user = user;
      this.editForm.patchValue({
        name: user.name,
        email: user.email,
        active: user.active
      }); //tu si veymeme udaje z susera a hodime ich na editaciu 
      //da sa aj jednym riadkom: -> som nestihla opisat

      //teraz si natiahnem vsetky skupiny -> v html ccem tolko checkboxov kolko skupin mi vypadne == dynamickeeeee
      this.usersService.getGroups().subscribe(groups => {
        //prejdem vsetky skupiny a pre kazdu skupinu pridam novy form control 
        this.allGroups = groups;
        //ity prvok vo form groups predstavuje kamarata pre form control 
        this.groups.clear(); //musime si najprv vycistit pole lebo inak by sa nam dookola pushovali checkboxy
        for (let group of groups) {
          //v modeli budem mat tolko form controlov kolko chcem
          //PROBLEM -> nepmamata si labels tych ceckboxov v modlei  - musim si labels pamatat v exterej strukture
          if(this.user?.groups) {
            //const isMember = user.groups?.some(ug => ug.id=== group.id);
            const isMember = !! user.groups?.find(ug => ug.id=== group.id);
            this.groups.push(new FormControl<boolean>(isMember)) //this groups je form array a on ma metodu push -> an koniec viem vpucit lubovolny form control alebo form group
          }  
        }
      })
    })
  }

  //dohodime este idko usera aby sme mohli robit edit a nevalidoval sa ten dany user voci samemu seba
  //je to sipkova funkcia, k idcku sa viem dostat cez this.user.id
  userConflictsValidator(field: 'name'|'email'): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const name = field === 'name' ? control.value : '';
      const email= field === 'email' ? control.value : '';
      const user = new User(name, email, this.user?.id); //teraz uz vieme edit ak mame pridane idcko
      return this.usersService.userConflicts(user).pipe(
        map( arrayConflicts => {
          if (arrayConflicts.length === 0) return null;
          return { serverConflict: field + ' already present on server'}
        })
      )
    }
  }
  onSubmit(){
    //last loginnechcem vyplnat dam undefined
    //heslo si najprv upravim
    const pass = this.password.value.trim() || undefined //ak to bude prazdny string bude to undefined
    //v groups maju byt normalne cele objekty typu groups do ktorych user patri 
    //bude to podmnozina all groups -> z all groups povyhadzjeme tie kt user nema  
    //budeme si vediet zobrat ity model = cez AT --> ked tam je tak true inak false a podla toho sa hodi / nehodi do pola 
    const groups = this.allGroups.filter((_gr, i ) => this.groups.at(i).value )
    const user = new User(this.name.value, this.email.value, this.user?.id, undefined, pass, this.active.value, groups);
    //jednoducho odideme = sa vyhneme patch value
    this.usersService.saveUser(user).subscribe(savedUser => {
      //ked som uspesne savenuty prerootujem sa na zoznam pouzivatelov
      //cez injecnuty router
      this.saved = true;
      this.router.navigateByUrl("/extended-users")
    });

  }

  get name(): FormControl<string> {
    return this.editForm.get('name') as FormControl<string>
  }
  get email(): FormControl<string> {
    return this.editForm.get('email') as FormControl<string>
  }
  get password(): FormControl<string> {
    return this.editForm.get('password') as FormControl<string>
  }
  get active(): FormControl<boolean> {
    return this.editForm.get('active') as FormControl<boolean>
  }
  get groups(): FormArray {
    return this.editForm.get('groups') as FormArray
  }

}



