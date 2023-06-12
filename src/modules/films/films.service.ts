import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { FilmDetail } from 'src/entities/filmDetail';
import { UsersService } from 'src/services/users.service';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  url = this.usersService.url;
  apiKey = "4e6ddde";
  urlOMDData = "http://www.omdbapi.com/?apikey="+this.apiKey+"&";
  urlOMDImg = "http://img.omdbapi.com/?apikey="+this.apiKey+"&"; //musi nasledovat id z imbd

  get token() {
    return this.usersService.token;
  }

  constructor(private http: HttpClient, private usersService: UsersService) { }

  getHeader() {
    if (this.token) {
      return {headers: {'X-Auth-Token': this.token}}
    }
    return undefined;
  }

  getDetail(imdbID:string): Observable<FilmDetail> {
    return this.http.get<FilmDetail>(this.urlOMDData + "i=" + imdbID).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  getFilms(orderBy?:string, descending?:boolean, indexFrom?: number, indexTo?: number, search?: string, isfirst?: boolean): Observable<FilmsResponse> {
    let options: {
      headers? : {[header:string]: string},
      params?: HttpParams
    } | undefined = this.getHeader();

    if(isfirst){
      indexFrom=0;
      indexTo=123;
    }
    
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = { ...(options || {}), params: new HttpParams()}
      if (orderBy) options.params = options.params?.set('orderBy', orderBy);
      if (descending) options.params = options.params?.set('descending', descending);
      if (indexFrom) options.params = options.params?.set('indexFrom', indexFrom);
      if (indexTo) options.params = options.params?.set('indexTo', indexTo);
      if (search) options.params = options.params?.set('search', search);
    }
    

    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }
}
