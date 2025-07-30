import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, combineLatest, shareReplay } from 'rxjs';
import { QuranDataService, Reciter } from '../../services/quran-data.service';
import { Router, RouterLink } from '@angular/router';
import { reciterImageMap, defaultReciterImage } from '../../services/reciter-images';
import { SearchService } from '../../services/search.service';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { PlayerService } from '../../services/player.service'; 

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, TopBarComponent, RouterLink],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent implements OnInit {
  private quranService = inject(QuranDataService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  private playerService = inject(PlayerService); 
  public reciters$!: Observable<{ reciters: Reciter[] }>;
  public dummyArray = new Array(15);
  //  New variable to change menu title dynamically
  public listTitle = 'أكثر القراء استماعاً';

  private mostListenedToIds: string[] = [
    '123', '92', '102', '81', '51', '112', '86', '107', '20', '30', '231', '106', '263', '286', '70'
  ];

  ngOnInit(): void {
    //  Fetch all readers only once and store the result using shareReplay.
    const allRecitersFromApi$ = this.quranService.getReciters().pipe(
      shareReplay(1) 
    );

    //  Create an observable for your "most listened to" list
    const mostListenedReciters$ = allRecitersFromApi$.pipe(
      map(response => {
        const filtered = response.reciters.filter(reciter => this.mostListenedToIds.includes(String(reciter.id)));
        filtered.sort((a, b) => this.mostListenedToIds.indexOf(String(a.id)) - this.mostListenedToIds.indexOf(String(b.id)));
        return filtered;
      })
    );
    
    const searchTerm$ = this.searchService.searchTerm$;

    //  Combine all sources together to determine what to display.
    this.reciters$ = combineLatest([
      allRecitersFromApi$,
      mostListenedReciters$,
      searchTerm$
    ]).pipe(
      map(([apiResponse, mostListened, term]) => {
        //If there is a search term, search in "All" readers.
        if (term) {
          this.listTitle = `نتائج البحث عن "${term}"`; // Update address
          const allReciters = apiResponse.reciters;
          const searched = allReciters.filter(reciter =>
            (typeof reciter.name === 'string' ? reciter.name : (reciter.name as any).ar)
              .toLowerCase()
              .includes(term.toLowerCase())
          );
          return { reciters: searched };
        } else {
          // If there is no search, display the "Most Listened To" list.
          this.listTitle = 'أكثر القراء استماعاً'; // Reset address to default
          return { reciters: mostListened };
        }
      })
    );
  }

  onReciterClick(reciter: Reciter): void {
    this.router.navigate(['/reciter', reciter.id]);
  }

  getReciterImage(reciterId: string): string {
    return reciterImageMap[reciterId] || defaultReciterImage;
  }
    playReciter(reciter: Reciter, event: MouseEvent): void {
    event.stopPropagation(); //To prevent going to the details page when pressing the button

    // We will play the first Surah (Al-Fatihah) as the default value.
    this.playerService.play(reciter, 1); 
  }
    getReciterName(reciter: Reciter): string {
    return typeof reciter.name === 'string' ? reciter.name : (reciter.name as any).ar;
  }
   isCurrentlyPlaying(reciter: Reciter): Observable<boolean> {
    return this.playerService.currentTrack$.pipe(
      map(track => this.playerService.isPlaying$.value && track?.reciterId === reciter.id)
    );
  } 

  togglePlayback(reciter: Reciter, event: MouseEvent): void {
    event.stopPropagation(); //To prevent moving to the details page

    const currentTrack = this.playerService.currentTrack$.value;

    // New and simplified condition
    // Is the reader that was pressed the same one that is currently in the player
    if (currentTrack?.reciterId === reciter.id) {
      //If it's the same, just play or pause (resume playback)
      this.playerService.togglePlayPause();
    } else {
      // If he is a new reader, bring up his list of surahs and play it from the beginning.
      this.quranService.getSurahListForReciter(reciter.id).subscribe(surahList => {
        if (surahList && surahList.length > 0) {
          // Play the first Surah with full list scrolling
          this.playerService.play(reciter, 1, surahList);
        }
      });
    }
  }
  ngOnDestroy(): void {
    //When you leave this page, clear your search term.
    this.searchService.updateSearchTerm('');
  }

}