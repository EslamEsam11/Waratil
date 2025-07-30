import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, map, switchMap,forkJoin  } from 'rxjs';
import { QuranDataService, Reciter } from '../../services/quran-data.service';
import { PlayerService, TrackInfo } from '../../services/player.service';
import { reciterImageMap, defaultReciterImage } from '../../services/reciter-images';
import { LibraryService } from '../../services/library.service'; 

@Component({
  selector: 'app-reciter-details',
  standalone: true,
  imports: [CommonModule,RouterLink,],
  templateUrl: './reciter-details.component.html',
  styleUrl: './reciter-details.component.scss'
})
export class ReciterDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quranService = inject(QuranDataService);
  public playerService = inject(PlayerService);
  public suggestedReciters: Reciter[] = [];
  public reciter$!: Observable<Reciter>;
  public surahList: { number: number, name: string }[] = [];
  public libraryService = inject(LibraryService); 
  private reciter?: Reciter; 
  readonly initialDisplayCount = 5;
  visibleCount = this.initialDisplayCount; 
  //List of surah names for ease of presentation
  private surahNames: string[] = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء",
    "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان",
    "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف",
    "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر",
    "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن",
    "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة",
    "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج",
    "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق",
    "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش",
    "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
  ];
  private createTrackInfoFromSurah(surah: { number: number, name: string }): TrackInfo | null {
    if (!this.reciter) return null;

    const serverUrl = this.reciter.moshaf[0]?.server;
    if (!serverUrl) return null;

    const formattedSurah = surah.number.toString().padStart(3, '0');
    const audioUrl = `${serverUrl}/${formattedSurah}.mp3`;
    const reciterName = typeof this.reciter.name === 'string' ? this.reciter.name : (this.reciter.name as any).ar;

    return {
      reciterId: this.reciter.id,
      surahNumber: surah.number,
      surahName: surah.name,
      reciterName: reciterName,
      audioUrl: audioUrl,
    };
  }

ngOnInit(): void {
    this.reciter$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        this.visibleCount = this.initialDisplayCount;

        // Run two API calls at the same time using forkJoin
        return forkJoin({
          mainReciterResponse: this.quranService.getReciterDetails(id),
          allRecitersResponse: this.quranService.getReciters()
        });
      }),
      map(({ mainReciterResponse, allRecitersResponse }) => {
        // Receive results from both calls
        
        const reciter = mainReciterResponse.reciters[0];
        this.reciter = reciter; // <-- Assign the reciter to the property
        if (reciter.moshaf && reciter.moshaf.length > 0) {
          const moshaf = reciter.moshaf[0];
          const surahString = moshaf.suras || moshaf.surah_list;
          if (surahString) {
            const surahs = surahString.split(',');
            this.surahList = surahs.map(s => {
              const surahNumber = parseInt(s, 10);
              const surahName = this.surahNames[surahNumber - 1] || `Surah ${surahNumber}`;
              return { number: surahNumber, name: surahName };
            });
          } else {
            console.warn("لم يتم العثور على خاصية 'suras' أو 'surah_list'", moshaf);
            this.surahList = [];
          }
        } else {
          console.warn("هذا القارئ لا يملك بيانات مصاحف 'moshaf'", reciter);
          this.surahList = [];
        }

        //  Suggestion List Logic (New Part)
        this.suggestedReciters = allRecitersResponse.reciters
          .filter(r => r.id !== reciter.id) // Filter the current reader
          .sort(() => 0.5 - Math.random()) //random shuffle
          .slice(0, 4); // Choose only the first 4

        return reciter; // Return the main reader to be displayed in the interface.
      })
    );
    
  }
  getReciterImage(reciterId: string): string {
    return reciterImageMap[reciterId] || defaultReciterImage 
    
  }
  showMore(): void {
    this.visibleCount = this.surahList.length; // Make the number of items shown the length of the entire list.
  }
    showLess(): void {
    this.visibleCount = this.initialDisplayCount; // Returns the number of displayed elements, the initial value.
  }
  playSurah(reciter: Reciter, surahNumber: number) {
    //  Pass the full list of surahs (this.surahList) to the service.
    this.playerService.play(reciter, surahNumber, this.surahList);
  }

  onToggleLike(surah: { number: number, name: string }, event: MouseEvent): void {
    event.stopPropagation();
    
    let trackInfo = this.createTrackInfoFromSurah(surah);
    if (!trackInfo) return;

    // If you already like the surah, delete it immediately.
    if (this.libraryService.isLiked(trackInfo)) {
      this.libraryService.toggleLike(trackInfo);
      return; 
    }

    // --- If it is a new surah ---

    // Add it to your likes "instantly" without any delay
    this.libraryService.toggleLike(trackInfo);

    //In the background, start fetching the duration.
    this.playerService.getTrackDuration(trackInfo.audioUrl).subscribe({
      next: (duration) => {
        // When the duration reaches, update the clip information.
        const updatedTrack = { ...trackInfo!, duration: duration };
        
        // Tell the library service to update the section with new data.
        this.libraryService.updateTrackInLibrary(updatedTrack);
      },
      error: (err) => {
        console.error("Failed to fetch duration in background:", err);
      }
    });
  }
    isLiked(surah: { number: number, name: string }): boolean {
    const trackInfo = this.createTrackInfoFromSurah(surah);
    return trackInfo ? this.libraryService.isLiked(trackInfo) : false;
  }

}