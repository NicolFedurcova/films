import { Injectable } from '@angular/core';
import { Observable, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client, over } from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url = environment.websocket_url;
  socket?: WebSocket;
  stompClient?: Client; //zo stomp js
  nick = "";

  constructor() { }

  connect(): Observable<boolean> { //ocakavam observable toho ci sa mi to podarilo --> boolean 
    return new Observable(subscriber => { //zaciatok rury --> toto vnutri sa zavola vtedy kedniekto na druom konci urobi subscribe == studena rura
        //tieto saradny sa spravia ked niekto da subscribe 
        this.socket = new WebSocket (this.url) //toto nam vrati objekt typu websocket 
        this.stompClient = over(this.socket);
        //cez stomp klinta s anapojime
        this.stompClient.connect({}, frame =>subscriber.next(true), 
                                     error =>subscriber.next(false)); //v hlavicke musime uviest heslo - nemame, dame prazdny objekt, potom callback fcia kt bde zavolana ked budem uspesna - -doda mi frame 
        //mame vratit observable  --> prerobili sme si callback na observable 
    
        //vieme vratit teardown logic == rozlucime sa s prudom --> pocuvac mi povie ze prestava pocuvat 
        return () => { //toto nastane ked dakto spravi unsubscribe
          this.disconnect();
        }
      });
  }

  disconnect() {
    this.stompClient?.disconnect(()=>{});//povinn disconnect callback
  }

  sendNickName(nick:string){
    this.stompClient?.send("/app/hello", {},JSON.stringify({name:nick}) ); //druhy je header, treti je objekt - > musime mu dat rovno json - on si nevie robit mapovacku
    //alt: this.stompClient?.send("/app/hello", {}, `{"name" : "${nick}"}`);
    //alt: this.stompClient?.send("/app/hello", {}, `{"name" : "' + nick + '"}`);
    this.nick = nick;
  }

  sendMessage(message:string){
    this.stompClient?.send("/app/message", {},JSON.stringify({name:this.nick,message }) ); //nick som si vyssie zapamatala 
  }

  listenGreetings():Observable<string> {
    //dojde callback a ja chcem observable
    return new Observable(subscriber => {
      this.stompClient?.subscribe("/topic/greetings", 
        response =>subscriber.next(JSON.parse(response.body).content)); //response ma komplet info o tom co prislo v celom balicku - headers a aj body - body obsahuje json co nam pritiekol zo servera
    }); //vezmem obsah a cez subscribera ho strcim do rury -- urobim za kazdym ked pride novy greeting
  }

  listenMessages():Observable<ChatMessage> { //name a message
    //dojde callback a ja chcem observable
    return new Observable(subscriber => {
      this.stompClient?.subscribe("/topic/messages", 
        response =>subscriber.next(JSON.parse(response.body)));
      });
  }

}

export interface ChatMessage {
  name:String,
  message:String,
};
