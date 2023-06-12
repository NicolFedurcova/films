import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { Page404Component } from './page404/page404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtendecUsersComponent } from './extendec-users/extendec-users.component';
import { MaterialModule } from 'src/modules/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { GroupsToStringPipe } from '../pipes/groups-to-string.pipe';
import { RegisterComponent } from './register/register.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { GroupsModule } from 'src/modules/groups/groups.module';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    Page404Component,
    ExtendecUsersComponent,
    NavbarComponent,
    GroupsToStringPipe,
    RegisterComponent,
    ConfirmDialogComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,//sme si oddelegovali importy z material stuff
    FormsModule,
    ReactiveFormsModule,
    //GroupsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
