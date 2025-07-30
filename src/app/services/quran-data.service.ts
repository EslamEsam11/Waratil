import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable , map } from 'rxjs';

// (Optional but preferable) We specify the format of the data coming from the API.
export interface Moshaf {
  surahList: any;
  id: string;
  name: string;
  server: string; 
  surah_total: string;
  suras: string;
  surah_list: string;
  moshaf_type: string;
}

// Update the reader interface
export interface Reciter {
  id: string;
  name:string;
  rewaya: string; 
  moshaf: Moshaf[];
}


@Injectable({ providedIn: 'root' })
export class QuranDataService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.mp3quran.net/api/v3/reciters?language=ar';

  constructor() { }

  // Function to get all readers
  getReciters(): Observable<{ reciters: Reciter[] }> {
    return this.http.get<{ reciters: Reciter[] }>(this.apiUrl);
  }

  //New function to retrieve details of a single reader
  getReciterDetails(id: string): Observable<{ reciters: Reciter[] }> {
    // API returns array even when requested by a single reader
    return this.http.get<{ reciters: Reciter[] }>(`${this.apiUrl}&reciter=${id}`);
  }
    getSurahListForReciter(reciterId: string): Observable<{ number: number, name: string }[]> {
    return this.getReciterDetails(reciterId).pipe(
      map(response => {
        const reciter = response.reciters[0];
        const surahString = reciter.moshaf[0]?.suras || reciter.moshaf[0]?.surah_list;
        if (surahString) {
          const surahs = surahString.split(',');
          const surahNames: string[] = [  ];
          return surahs.map(s => {
            const surahNumber = parseInt(s, 10);
            return { number: surahNumber, name: surahNames[surahNumber - 1] };
          });
        }
        return []; 
      })
    );
  }
}