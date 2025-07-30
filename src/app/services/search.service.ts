import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // BehaviorSubject Keeps the last value sent
  private searchTermSource = new BehaviorSubject<string>('');

  // We make it listenable from the outside as an Observable
  public searchTerm$ = this.searchTermSource.asObservable();

  constructor() { }

  //Function to update the search value from any component
  updateSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }
}