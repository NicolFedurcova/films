import { Rating } from "./rating";
export class FilmDetail {
    static clone(detail: FilmDetail): FilmDetail {
        return new FilmDetail(
            detail.Title, detail.Year,detail.Rated,detail.Released,detail.Runtime,detail.Genre,detail.Director,
            detail.Writer,detail.Actors, detail.Plot, detail.Language, detail.Country, detail.Awards,detail.Poster,
            detail.Ratings, detail.Metascore, detail.imdbRating, detail.imdbVotes, detail.imdbID, detail.Type,
            detail.DVD, detail.BoxOffice, detail.Production, detail.Website, detail.Response
        )

    }
    constructor(
        public Title?: string,
        public Year?: string,
        public Rated?: string,
        public Released?: string,
        public Runtime?: string,
        public Genre?: string,
        public Director?: string,
        public Writer?: string,
        public Actors?: string,
        public Plot?: string,
        public Language?: string,
        public Country?: string,
        public Awards?: string,
        public Poster?: string,
        public Ratings?: Rating[],
        public Metascore?: string,
        public imdbRating?: string,
        public imdbVotes?: string,
        public imdbID?: string,
        public Type?: string,
        public DVD?: string,
        public BoxOffice?: string,
        public Production?: string,
        public Website?: string,
        public Response?: string
      ){};

}