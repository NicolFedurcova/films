import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MessageService } from 'src/services/message.service';
import { ChatMessage, ChatService } from '../chat.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: '../chat/chat.component.html',
  styleUrls: ['../chat/chat.component.css']
})
export class ChatComponent implements OnDestroy{
  nick = "";
  //datovy zdroj budu objekt typu chatMessage
  messages: ChatMessage[] = [];
  messageToSend="";
  connected = false;
  connectSubscription?: Subscription;
  @ViewChild("messageInput") messageinput? : ElementRef; //hociaky elemnt dom modelu 

constructor(private chatService: ChatService, private messageService: MessageService){}
//tesne pred tym ked komponent prestane existovat --. aj ked vypiname stranku = stihne s aon destroy
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }


  //pri pripojeni chcem na /hello  poslat hello message
  onConnect(){
    //subscribe vracia subscribtion objekt --> 
    this.connectSubscription = this.chatService.connect().subscribe(isConnected => {
      if(isConnected){
        this.connected = true;
        this.chatService.listenGreetings().subscribe(gr => {
          this.messages = [...this.messages, {name: "SERVER", message: gr}]; //pri greetingu nam pride len message - musime tam dolepit meno
        });
        this.chatService.listenMessages().subscribe(msg => {
          this.messages = [...this.messages, msg];
        });
        this.chatService.sendNickName(this.nick);
        setTimeout(() => this.messageinput?.nativeElement.focus(), 0); //aby sa mi kurzor objavil na pisaní správy 
        //hack --> bez settimeout by sa to neprekreslovalo --> ono to bude pocuvat na timeout
      }else {
        this.messageService.errorMessage("server is not avaible");
      }
    })
  }

  onSend(){
    this.chatService.sendMessage(this.messageToSend);
    this.messageToSend = "";
    this.messageinput?.nativeElement.focus()
  }

  onDisconnect(){
    this.connectSubscription?.unsubscribe(); //poviem ze uz nechcem pocuvat==toto je z pohladu pocuvaca - konzumeta
    //this.chatService.disconnect();
    this.connected = false;
    
  }

}
