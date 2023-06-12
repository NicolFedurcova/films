import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {//toto je servis viemho hocikde injectnut

  defaultDuration= 3000;

  constructor(private snackBar: MatSnackBar) { }
  sucessMessage(msg:string, duration=this.defaultDuration) { 
    //viem volat s 1 alebo 2 parametrami ak len 1 tak sa da default duration, ak s 2 tak sa nastavi nami zadana hodnota
    this.snackBar.open(msg, "SUCESS", {duration, panelClass:"sucessSnackBar"}); //trti parameter je config -- material angular snackbar config 
    //duration - ako dlho sa snackbar bude zobrazovat 
  }

  errorMessage(msg:string, duration=this.defaultDuration) {
    this.snackBar.open(msg, "ERROR", {duration, panelClass:"errorSnackBar"});
  }
}
