
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:    { term: '', countries: [] },
    byCountries:  { term: '', countries: [] },
    byRegion:     { region: '', countries: [] },
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
   }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore =  JSON.parse(localStorage.getItem('cacheStore')!);
  }

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
    return this.getCountriesRequest(`${this.apiURL}/capital/${term}`)
    .pipe(
      tap( countries => this.cacheStore.byCapital = { term, countries} ),
      tap( () => this.saveToLocalStorage() )
    );
  };

  searchRegion( term: Region ): Observable<Country[]> {
    return this.getCountriesRequest(`${this.apiURL}/region/${term}`)
    .pipe(
      tap( countries => this.cacheStore.byRegion = { region: term, countries} ),
      tap( () => this.saveToLocalStorage() )
    );
  };

  searchName( term: string ): Observable<Country[]> {
    return this.getCountriesRequest(`${this.apiURL}/name/${term}`)
    .pipe(
      tap( countries => this.cacheStore.byCountries = { term, countries} ),
      tap( () => this.saveToLocalStorage() )
    );
  };

}
