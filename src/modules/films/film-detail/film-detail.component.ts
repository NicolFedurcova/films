import { OnInit, Component, AfterViewInit, EventEmitter,ViewChild } from '@angular/core';
import { Film } from 'src/entities/film';
import { FilmsDataSource } from '../FilmsDataSource';
import { FilmsService } from '../films.service';
import { UsersService } from 'src/services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FilmDetail } from 'src/entities/filmDetail';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class FilmDetailComponent implements OnInit, AfterViewInit {

  filterEmitter = new EventEmitter<string>();
  columnsToDisplay = ['id','nazov','rok'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: FilmExpanded | null = null; 
  films: Film[] = [];
  details: FilmDetail[] = [];
  detail : FilmDetail = new FilmDetail();
  filmsDataSource: FilmsDataSource;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private filmsService: FilmsService, 
    private usersService: UsersService){
    this.filmsDataSource = new FilmsDataSource(filmsService, this);
  }

  ngOnInit(): void {
    if (this.usersService.isLoggedIn()) {
      this.columnsToDisplay = ['id','nazov','slovenskyNazov','rok','afi1998','afi2007'];
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
    }

    this.filmsService.getFilms().subscribe(
      {next: (resp) => {
        this.films = [...resp.items];     
      }, 
      complete: () => this.fillDetails(this.films),  
      }) ;
  }

  getDetailFromServer(film: Film): void{
    this.filmsService.getDetail(film.imdbID).subscribe(odv => {
      this.details= [...this.details, odv];
    });
  }

  fillDetails(filmy: Film[]){
    filmy.forEach(film => this.getDetailFromServer(film));
  }

  getDetail(imdbID:string): FilmDetail | undefined {
    return this.details.find(det => det.imdbID==imdbID);
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.filmsDataSource.addEventsSources(this.paginator,this.sort, this.filterEmitter.asObservable());
    }
  }

  onFilter(event:any){
    this.filterEmitter.emit(event.target.value.trim().toLowerCase());
  }

  getImageUrl(imdbID:string) {
    return this.filmsService.urlOMDImg+"i="+imdbID;
  }

  ifNotValue(val: string | undefined): string {
    if (val=="N/A" || val==undefined) {
      return "nedostupný údaj"
    }
    return val;
  }

  createLink(text:string){
    return "https://translate.google.com/?sl=en&tl=sk&text="+text+"%0A&op=translate";
  }

  
}

export interface FilmExpanded {
  nazov: string,
  slovenskyNazov: string,
  rok: number,
  afi1998: string,
  afi2007: string,
  imbdID: string
}
