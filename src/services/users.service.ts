import { Injectable } from '@angular/core';
import { map, Observable, of, catchError, EMPTY, Subscriber, tap, defaultIfEmpty } from 'rxjs';
import { User } from 'src/entities/user';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Auth } from 'src/entities/auth';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { Group } from 'src/entities/group';

const DEFAULT_NAVIGATE_AFTER_LOGIN = "/extended-users";
 

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  navigateAfterLogin = DEFAULT_NAVIGATE_AFTER_LOGIN;
  url = "http://localhost:8080/";
  users: User[] = [
    new User("AlicaServis", "mailAlica@mail.com"),
    new User("BobServis", "mailBob@mail.com", 1, new Date(), "heslo"),
  ];
  userSubscriber?: Subscriber<string>;
  //token = "";
  constructor(private http: HttpClient,
    private messageService: MessageService,
    private router: Router) { }

  private set token(value: string) {
    if (value) { //ak je truthy --> má nejaké znaky 
      localStorage.setItem("filmsToken", value); //local storage je pristupna metoda-> key, value
      //vpravo aj vlavo v zatvorke musia byt stringy
    } else {
      localStorage.removeItem("filmsToken");
    }
  }

  get token(): string {
    const value = localStorage.getItem("filmsToken");//to čo príde je alebo string alebo null -> ak s atam ten kluc nenašiel v mape
    //nechcem vraciat null
    return value || "";
  }

  set username(value: string) {
    this.userSubscriber?.next(value);
    if (value) { //ak je truthy --> má nejaké znaky 
      localStorage.setItem("filmsUsername", value); 
    } else {
      localStorage.removeItem("filmsUsername");
    }
  }

  get username(): string {
    const value = localStorage.getItem("filmsUsername");
    return value || "";
  }

  //dolar sa pouziva ako znacka ze toto bude prud 
  getCurrentUsers$(): Observable<string> {
    //ked nastane zmena s tokenom potrebujem tam vhodit pouzivatela
    //studeny sposob - vygeneruje zaciatok rury az vtedy ked si niekto vypita koniec rury
    //teple sposoby - mame prichystanu ruru a ked si niekto zapyta dame mu koniec
    //my studeny

    return new Observable(subscriber => {
      this.userSubscriber = subscriber;
      subscriber.next(this.username); //ked niekto urobi subscribe a otvori ruru tak ja mu tam rovno hodim to co mamv local storage v username
    }); //subscriber je lopata --> ked niekto vypta get current users sa najprv vyrobi lopata a potom sa zavola funkciu kt nam tu lopatu da a ptm vratime koniec rury do kt s lopatou bdeme hadzat data

  }

  getLocalUsers(): Observable<User[]> {
    return of(this.users); //of == data kt si producent nachystal na vhodenie do rury
  }

  getUsers(): Observable<User[]> {
    //ideme kontaktovat httpkliensta - potrebujee si ho v konstructore injectnut 
    return this.http.get<User[]>(this.url + "users").pipe(
      map(jsonObj => jsonObj.map(jsonUser => User.clone(jsonUser))), //tu si zavolame novo vytvorenu metodu kde sa postarame o chybu 
      catchError(error => this.processError(error))
      //prvy map je nad prudom a druhy nad polom
      //observable je vymysleny tak ze vzdy ked z neho nieco vypadne bude to cez pipe presunuty do map kt nahradi objekt kt prisiel prvkom z vnutornej funkcie
      //vnutorna funkcia premapuje pole jsonobjektov na pole userov
      //realne nam get da iba jedno pole ale su ine metody kt vedia dat viacero prvkov v poli
    );
    //vieme dovarit dalsiu ruru kde vieme dovarit mnozstvo dalsich operatorov kt data vedia modifikovat 
    //do map vlozime fciu kt sa zavola pre kazdy objekt pretekajuci rurou 
    //tvrdime ze vraciame pole userov ale vraciame object (z jsonu je js object a je poslany do rury ) --> musime pretypovat 
    //je to genericka metoda a moze cez generikum ziskat navratovy typ 

    //v app module ts musime http klienta dopisat
  }

  //v priprade ze tecie chybovy objekt map sa nezavola a tecie chybovy objek dalej - map mu nerozumie posunie ho len dalej 
  //potom catch error si zly objekt ochyti a vracia novy prud dat lebo stary prud dat je uz pokazeny  -- nova rura of 
  //zly objekt nahradom dobrym a ten poslem dalej 
  //ak pride ina zla vec ako som cakala posielam iny zly prud dalej 
  login(auth: Auth): Observable<boolean> {
    return this.http.post(this.url + "login", auth, { responseType: "text" }).pipe(
      map(token => {
        this.token = token;
        this.username = auth.name;
        //do rury vhadzujem mena userov ku kt token bol vydany
        //tu sa relane zavola setter !!!!!!!!!!!!!
        this.messageService.sucessMessage("Login of user" + auth.name + "was successful")
        return true;
      }),

      /*
      catchError(error => { //vraciam novy prud dat
       if(error instanceof HttpErrorResponse) {
         if(error.status === 401) {
           return of(false); //of je zaciatok prudu dat kde mam prichystane co donho vhodim -> hodim donho false a of potom zatvorí rúru
         }
       }
       return EMPTY; //empty je ze of bez vstupu - zhtnem chybu a rura sa zavrie 
       //ked server bud evypnuty mozem skusat hesla a nic
      })*/
      catchError(error => this.processError(error))

    );//post ma 2 vstupne parametre -> url a body -->body nam staci dat auth a on z neho spravi json sam
    //tymto odchadza poziadavka na server a server nam posiela bud tken a status 200 ak je vsetko ok alebo pride objekt so statusom 401 
    //post vracia observable toho co pride --> ocakavame ze pride token co je string 
    //toto co pridenie je regulerny JSON --> nieje to ani v uvodzovkach --> nemozeme ist do standardneho chovania metody post
    //pomocou volitelnych parametrov post vieme povedat ze response type nebude JSON ale bude to text !!
    //ten text ptm odchadza v observable prude 

    //trz budeme vracat boolean - true false - uspech neuspech - login component nepotrebuje token
    //do rury navarm medzikus - vezme co z rury pritecie ak token tak true inak false  -->.pipe
  }

  //logout moze ist aj na server ale nemusime , mozeme lenivo lokalne zabudnut token
  //
  
  // logout(){
  //   //cez server:
  //   this.http.get(this.url + "logout" + this.token).pipe(
  //     catchError(error => this.processError(error))
  //     //napise mi ze server je nedostupny a proste ostanem prihlasena
  //     //keby si server po reštarte pamatal login tak po reštarte by sme boli stále prihláseny
  //   ).subscribe(() =>{
  //     //az vtedy ked ma server uspesne informuje ze sa podarilo odhlasit
  //     this.token = "";
  //     this.username = "";
  //     this.router.navigateByUrl("/login");
  //   }); //on nam zakazdim vrati observable na kt musime urobit subscibe
  //   //ideme urobit ze server s amusi odhlasit -- ze oznammime userovi ze ak je server nedostupny tak s anepodarilo odhlasit
  //   /*
  //    this.token = "";
  //    this.username = "";
  //    this.router.navigateByUrl("/login");
  //   */
  // }

  logout(){
    this.http.get(this.url + 'logout/' + this.token).pipe(
      catchError(error => this.processError(error))
    ).subscribe(()=>{
      this.navigateAfterLogin = DEFAULT_NAVIGATE_AFTER_LOGIN; //po logoute sa vratime do vychodzieho stavu 
      this.token = '';
      this.username = '';
      this.router.navigateByUrl("/login");
    });
  }
  

  getExtendedUsers(): Observable<User[]> {
    //chcem extended usera --> mam uz toen tak ho prilepim do url 
    return this.http.get<User[]>(this.url + "users/" + this.token).pipe( //tu sa vola getter tokenu !!!!!!!!!!
      map(jsonObj => jsonObj.map(jsonUser => User.clone(jsonUser))),
      catchError(error => this.processError(error))
    );
  }

  register(user:User):Observable<User> {
    return this.http.post<User>(this.url + "register", user).pipe(
      //musime tu dat tap aby sme mohli zavolat message service -> okrem usepsnej spravy pouzivatela rovno aj prerootujeme na login stranku 

      tap(u => {
        this.messageService.sucessMessage("user " +u.name +" is sucessfuly registered, you can now login"),
        this.router.navigateByUrl("/login");
      }),
      catchError(error => this.processError(error))
    );
  }

  userConflicts(user:User): Observable <string[]> {
    //vratime pole konfliktnych prvkov - napr ak chcem registrovat usera s uz pozivanym meno / emailom 
    return this.http.post<string[]>(this.url + "user-conflicts", user).pipe(
      //odchytime vsetky chyby
      catchError(error => this.processError(error))
    )
  }

  //mazanie
  //zavolame si z extended users ts
  deleteUser(userId:number): Observable<boolean> {
    return this.http.delete(this.url + "user/" + userId + "/" + this.token).pipe(
      //ked to bud euspesne a pride 200 OK tak chceme vratit true 
      map(() => true), //nechcem vstup a chcem to mapovat na true 
      //map sa zavola len ak pride nejaka dvestovka
      catchError(error => this.processError(error))
    ) //len url adresa bez tela -. delet enam vrati 
  }

  //get user nam vrati usera zo servera podla idcka
  //mohli by sme si ho aj vybrat z existujucej metody ale zvytcne tahat vsetkych userov
  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.url + "user/" + userId + "/" + this.token).pipe( 
    map(jsonUser => User.clone(jsonUser)),
    catchError(error => this.processError(error))
  );
    //tohto usera si namapujeme ako clone
  }

  saveUser(user:User): Observable<User>{
    return this.http.post<User>(this.url + "users/" + this.token, user).pipe(
      map(jsonUser => User.clone(jsonUser)),
      tap(user => this.messageService.sucessMessage("User " + user.name + " saved on server")),
      //ak by sa zavolal catch error prve dve map a tap sa preskocia 
      catchError(error => this.processError(error))
    );
  }

  //otazka je ako casto toto volat -> pri kazzdom userovi? staci len raz ? 
  getGroups(): Observable<Group[]> { //vracia s anam pole objektov group
    return this.http.get<Group[]>(this.url + "groups").pipe( 
      map(jsonGroups => jsonGroups.map(group => Group.clone(group))),
      catchError(error => this.processError(error))
    );
  }

  getGroup(id:number): Observable<Group> { //vracia s anam pole objektov group
    return this.http.get<Group>(this.url + "group/" + id).pipe( 
      map(g => Group.clone(g)),
      catchError(error => this.processError(error))
    );
  }

  saveGroup(group:Group):Observable<Group>{
    return this.http.post<Group>(this.url + "groups/" + this.token, group).pipe( 
      map(g => Group.clone(g)),
      catchError(error => this.processError(error))
    );
  }

  checkToken(): Observable<boolean> {
    if(!this.token) 
      return of(false); //ked nemam token neotravujem server
    return this.http.get(this.url + "check-token/" + this.token).pipe(
      catchError(error => this.processError(error)), //najprv vybavim ci to nebola chyba 
      defaultIfEmpty(false),
      map(val => val !== false)

    );
  }

  isLoggedIn(): boolean {
    return !!this.token; //synchronna verzia --> lenivy -> nemusi byt uplen presny -- moznoze uz vyprsala session 
  }

  isLoggedInAsync():Observable<boolean>{ //ked si chceme byt istí že token ze zivy ze neexpiroval 
    return this.checkToken();
    
    /*this.getExtendedUsers().pipe( //endpoint get extended users == vek endpoint = tecie vela dat 
      //ak z toho prudu nevyjde nič tak false --> vyjde nic znamena ze sa zavrel prud !!! neviem mapovat nic !!!! ZAAAKERNEEEEE
      //ak vyjde niečo ta true
      
      //ak je prazdny prud - prud sa zatvara tak tam posli nieco ine -- toto uz vieme mapovat
      defaultIfEmpty(false),
      //map(val => val ? true : false) //ak toto je pole userov vratim true inak false 
      map(val => !!val)   )*/

    
  }

  //unverzalne odchytavanie chyb
  processError(error: any): Observable<never> {
    //te kto ma spracovava dostane len EMPTY - pidemmu regularn yprud kt nedonesie nič 
    //premenny typu never v sebe nemoze mat nic okrem undefined
    if (error instanceof HttpErrorResponse) {
      //ak status 0 - nie je to od servera server je nedostupny 
      if (error.status === 0) {
        //chceme vypisat ze server je nedostupny - vypis --> univerzalne riesenie
        //vyrobim si servis kt mozem hocikedy volat a bude vypisovat uspechove a chybove hlašky-- sucess a error message 
        //pohodlnejsia vec - vnutri budeme mat snack bar 
        this.messageService.errorMessage("Server is not available")
      }
      if (error.status >= 400 && error.status < 500) { //300 ani 200 sem nevlezie 
        //terz by som sa rada dostala k vratenemu objektu a k errormessage ktorú nesie
        const message = error.error.errorMessage || JSON.parse(error.error).errorMessage; //telo odpovede sa nevola body ale error !!!!!!!!!!!!!!!!!!!!!!! . error
        //to je JSON a prerobi ho na javascript objekt ak je to JSON,  ALE! dakedy to vezme ako stirng ciez preto ta sranda za ||
        //vyrobime si sami JSON objekt 
        if(error.status ===401 && message === "unknown token") {
          this.logout();
          this.messageService.errorMessage("session expired, please login again");
          return EMPTY;
        }
        this.messageService.errorMessage(message);
      }
      if (error.status >= 500) { //server ma vazny problem - zdochne kod na strane servera, nie je dostupn databaza, došla rmaka or smt 
        //alebo vyletela vynimka lebo sme to zle otestovali --> do konzoly vyletel vynimka 
        this.messageService.errorMessage("Server failed, contact system administrator");
        console.error(error);
      }
      //mame vybavene vstky chyby ktore mohli nastat 
    }
    return EMPTY; //zhltne sa chyba --> uz nic nedostaneme

  }



}
