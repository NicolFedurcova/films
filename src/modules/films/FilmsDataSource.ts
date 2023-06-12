import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Film } from 'src/entities/film';
import { Observable, Subject, mergeAll, tap, switchMap, map, of } from 'rxjs';
import { FilmsService } from 'src/modules/films/films.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FilmDetailComponent } from './film-detail/film-detail.component';

export class FilmsDataSource implements DataSource<Film> {
    futureObservables = new Subject<Observable<Query>>();
    paginator?: MatPaginator;
    orderBy?: string;
    descending?: boolean;
    search?: string; 
    pageSize = 10;
      
    constructor(private filmsService:FilmsService, private filmDetail?:FilmDetailComponent){    }
  
    addEventsSources(paginator: MatPaginator, sort: MatSort, filter: Observable<string>){
      this.paginator = paginator;
      this.pageSize = paginator.pageSize;
      this.futureObservables.next(of(new Query(undefined,undefined,0,this.pageSize)));  // first query
      this.futureObservables.next(paginator.page.pipe(
        map(pageEvent =>{
          this.pageSize = pageEvent.pageSize;
          const indexFrom = pageEvent.pageIndex * pageEvent.pageSize;
          const indexTo = indexFrom + pageEvent.pageSize;
          return new Query(this.orderBy, this.descending, indexFrom, indexTo, this.search)
        })
      ));
      this.futureObservables.next(sort.sortChange.pipe(
        map(sortEvent => {
          if (sortEvent.direction === '') {
            this.orderBy = undefined;
            this.descending = undefined;
            return new Query();
          }
          this.descending = sortEvent.direction === 'desc';
          this.orderBy = sortEvent.active;
          if (sortEvent.active === 'afi1998') this.orderBy = 'poradieVRebricku.AFI 1998';
          if (sortEvent.active === 'afi2007') this.orderBy = 'poradieVRebricku.AFI 2007';
          return new Query(this.orderBy,this.descending, 0, this.pageSize, this.search);
        })
      ));
      this.futureObservables.next(filter.pipe(
        tap(event=> this.search = event),
        map(event => new Query(this.orderBy, this.descending, 0, this.pageSize, event)))
      );
    }
  
    connect(): Observable<Film[]>{
      return this.futureObservables.pipe(
        mergeAll(),
        switchMap(query => this.filmsService.getFilms(query.orderby, 
                                                      query.descending, 
                                                      query.indexFrom, 
                                                      query.indexTo, 
                                                      query.search)),
        map(response => {
          if (this.paginator)
            this.paginator.length = response.totalCount;
          
          this.filmDetail?.fillDetails(response.items);
          return response.items;
        })
      );
    }
  
    disconnect(collectionViewer: CollectionViewer): void {
    }
}

class Query {
    constructor(
      public orderby?: string,
      public descending?: boolean,
      public indexFrom = 0,
      public indexTo = 10,
      public search?: string 
    ){}
}