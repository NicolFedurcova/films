import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from "zxcvbn";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  hide:boolean = true;
  usersService = inject(UsersService); //nemusime injectovat cez konstruktor ale mozeme takto 
  passwordMessage = ""; //tu cheme pristupovat preto paswwordvalidator je sipkkova

   //!!!!!!!!!!!!!!!sipkove funkcie sa parsuju az po vsetkych ostatnych funkciach s vynimkou toho ked je zadana pred tym kde sa vola
  //na vstupe abstract control a vracia valdiation errors
  //sipkova funkcia je akoby definovanie premennej - sa startuje zhora dole a sa spustaju inkedy ako klasicke funcie
  passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.value; //tu bude heslo 
    const result = zxcvbn(pass);
    this.passwordMessage = "Password strength: " + result.score + "/4, crackable in: " + result.crack_times_display.offline_slow_hashing_1e4_per_second;
    return result.score<3 ? {"weakPassword" : this.passwordMessage} : null; //ked posielam nulll je to ok - aspon 3 
  }
  //sipkova preto aby this bol moj lebo tato funkcia sa vola vnutri formgroup a aak by bola klasicka tak this by patril form groupu

  //modelovy objekt formulara -> skamaratime so sablonou 
  registerForm = new FormGroup({
    //prvy kluc
    //validatory bud cez konfig objekt, alko jeden validator alebo ako pole validatorov
    name: new FormControl<string>("", {nonNullable:true,
                                      validators: [Validators.required,
                                                    Validators.minLength(3)],
                                      //generator validatora pre meno - pre email taky isty len mu povieme ze emial
                                      asyncValidators: this.userConflictsValidator("name")}), //ked sa to zresetuje nenastavi sa o na null ale na defultnu hodnotu 
    email: new FormControl("", [Validators.required, 
                                //Validators.email,//ok validator ale slaby
                                Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")],// - ak bohatsi tak cez regex
                                this.userConflictsValidator("email")), //v tomto pozisnom sa ako treti v poradi cakaju asynchronne validatory
    password: new FormControl("", this.passwordValidator),
    password2: new FormControl("")
  }, this.passwordsMatchValidator); //druhym parametrom konstruktora su validatory


  //do tohto velkeho validatora by sme vedeli nahadzat vsetky validatory ale nie je to dobre - mali by sme zbytočne ozrutny kod
  passwordsMatchValidator(control:AbstractControl): ValidationErrors | null {//control tu bude cely form group
    //je to bezna funkcia nie siokova -. nemame pristup ku getterom - lebo to su this -> vsteko musim tahat z controlu u
    const passwordModel = control.get("password"); //toto je model toho passwordu z register formu 
    const passwordModel2 = control.get("password2");
    //ak sa hesla zhoduju tak ok 
    if(passwordModel?.value === passwordModel2?.value) {
      passwordModel2?.setErrors(null);
      return null; //vsetko je ok vraciam null
      //povieme passwordu2 modelu ze je bez chyb
      
    } else {
      const error = {"differentPasswords": "Passwords do not match "}; // retazec na hocico 
      //nanutim tomu chlieviku password 2 ze je chybny
      passwordModel2?.setErrors(error);
      //vraciam validation errror
      return error; //toto je objekt validationErrors
    }
  }

  //asynchronny a parametricky validator 
  //ulohou parametrickeho validatra je vratit bezparametricky validator == je to vpodstate generator
  //chcem jednu metodu kt bude valdiatorom na mena aj na emaily - > to ktore z toho uvediem v parametri 

  //field: name | email == string s 2 povolenymi hodnotami 
  //ma vratit bezparametrovy asynchronny validator
  //asynchronny validator vracia observable do ktoreho niekedy v buducnosti bude vhodne odnota null alebo validationerrors -> to sa udeje podla metody zo servisu 
  userConflictsValidator(field: "name" | "email"): AsyncValidatorFn {
    //budeme vraciat bezparametrovu funkciu  kt bude mat na vstupe cely register form a navratovy typ nebude validation typ alebo null ale OBSERVABLE 
    // kt bud emat v zobakoch validations error alebo null ---. lebo asynchronny validator
    return (control: AbstractControl): Observable<ValidationErrors | null > => {
      //tu trz zalezi ci mam name alebo emil podl atoho bude validator pouzity
      const name = field==="name"? control.value : ""; //ak sa nachadzam v chlieviku pre name tak to bude control, ak som v chlieviku emial dam tam daco prazde - lebo validujem len meno
      const email = field==="email"? control.value : "" ;
      const user = new User (name, email);

      return this.usersService.userConflicts(user).pipe(
        //uz mame pole konfliktov -> ole stringov array Conflickts
        map(arrayConflicts => {
          if (arrayConflicts.length===0) return null; //vraciame null kt bude vnutri observable
          return{serverConflict:  field + " already present on server"} //vraciame valdiation serror kt bude vnutri observable
          //serverconflict je nazov instencnej premennej -> nemusim tam mat uvodovky - je to string
        })
        //v pipe sa z pola stringov stane null alebo chybovy objekt a ten vraciam von z vnutornej fcie kt je validatr
        //funkcia asyncvalidatorfn vrati observable z ktoreho moze vypadnut bud null alebo validation error
      )
    }
  }

 
  onSubmit(){
    //sa zaregistrujeme -> potreujeme poslat na server noveho usera
    //zavolame metodu register a vlozime tam usera -> potrebujeme sa dostat ku users service --> bud injectovanim cez konstruktor
    //alebo cez toto co je vyssie

    //usera tu potrebujeme vyrobit noveho a dat onho info z chlievikov
    //bud si napiseme gettery na vsetky povinne veci alebo ich budeme pisat zakazdym ked ich budeme potrebovat
    const user = new User(this.name.value,
                          this.email.value,
                          undefined,
                          undefined,
                          this.password.value);
    this.usersService.register(user).subscribe(); //!!!!!!!!!!!MUSIME DAT SUBSCRIBEEEEEEEEEEEEEEEEEEEEEEE INAK RURA HLUCHA


  }
  //metodka na vypis mat-erorrov pola vlaidity pola
  printError(fc:FormControl){
    return JSON.stringify(fc.errors);

  }

  get name():FormControl<string> {
    return this.registerForm.get("name") as FormControl<string>; //get nam defaultne hadze naspat orm abstract 
  }

  get email():FormControl<string> {
    return this.registerForm.get("email") as FormControl<string>; //tuna mi ale moze prist aj null!!! a ja ho tu vraciam ako string -- interne veci
  }

  get password():FormControl<string> {
    return this.registerForm.get("password") as FormControl<string>; 
  }

  get password2():FormControl<string> {
    return this.registerForm.get("password2") as FormControl<string>; 
  }

}
