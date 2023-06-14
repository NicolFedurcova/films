import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsListComponent } from './films-list/films-list.component';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { DirectorsToStringPipe } from '../../pipes/directors-to-string.pipe';
import { CharacterToStringPipe } from '../../pipes/character-to-string.pipe';


@NgModule({
  declarations: [
    FilmsListComponent,
    FilmDetailComponent,
    DirectorsToStringPipe,
    CharacterToStringPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FilmsRoutingModule
  ]
})
export class FilmsModule { }
