
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1';

  public cacheStore = {
    byCapital:    { term: '', countries: [] },
    byCountries:  { term: '', countries: [] },
    byRegion:     { term: '', countries: [] },
  }

  constructor(private http: HttpClient) { }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>( url )
    .pipe(
      catchError( () => of([]) )
    );
  }

  searchAlphaCode( code: string ): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.apiURL}/alpha/${code}`)
    .pipe(
      map( countries => countries.length > 0 ? countries[0] : null ),
      catchError( () => of(null) )
    )
  }

  searchCapital( term: string ): Observable<Country[]> {
    return this.getCountriesRequest(`${this.apiURL}/capital/${term}`);
  };

  searchRegion( term: string ): Observable<Country[]> {
    return this.getCountriesRequest(`${this.apiURL}/region/${term}`);
  };

  searchName( term: string ): Observable<Country[]> {
    return this.getCountriesRequest(`${this.apiURL}/name/${term}`);
  };

}
