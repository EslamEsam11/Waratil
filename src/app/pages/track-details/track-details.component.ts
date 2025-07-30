import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuranDataService, Reciter } from '../../services/quran-data.service';
import { PlayerService, TrackInfo } from '../../services/player.service';
import { reciterImageMap, defaultReciterImage } from '../../services/reciter-images';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.scss'
})
export class TrackDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quranService = inject(QuranDataService);
  public playerService = inject(PlayerService);

  public reciter: Reciter | null = null;
  public surahName: string = '';
  public surahNumber: number = 0;
  public isPlaying$: Observable<boolean> | undefined;
  public suggestions: TrackInfo[] = [];
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

ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const reciterId = params.get('reciterId')!;
        this.surahNumber = Number(params.get('surahNumber')!);

        return forkJoin({
          mainReciterResponse: this.quranService.getReciterDetails(reciterId),
          allRecitersResponse: this.quranService.getReciters()
        });
      })
    ).subscribe(({ mainReciterResponse, allRecitersResponse }) => {
      // --- Update current page data---
      this.reciter = mainReciterResponse.reciters[0];
      this.surahName = this.surahNames[this.surahNumber - 1];
      this.setupIsPlayingObservable();

      // --- Create a suggestion list---
      this.suggestions = allRecitersResponse.reciters
        .filter(r => r.id !== this.reciter!.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map(reciter => {
              const surahListString = reciter.moshaf[0]?.suras || reciter.moshaf[0]?.surah_list;
          let randomSurahNumber = 1; 

          if (surahListString) {
            //Convert a list of text surahs to a number array
            const availableSurahs = surahListString.split(',').map(Number);
            if (availableSurahs.length > 0) {
              // Choose a random surah number from the list available to the reader.
              randomSurahNumber = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
            }
          }          
          // Call the function with the random surah number.
          return this.createTrackInfoFromReciter(reciter, randomSurahNumber);
        });
    });
  }
    private createTrackInfoFromReciter(reciter: Reciter, surahNumber: number): TrackInfo {
    const serverUrl = reciter.moshaf[0]?.server;
    const formattedSurah = surahNumber.toString().padStart(3, '0');
    const audioUrl = `${serverUrl}/${formattedSurah}.mp3`;
    const reciterName = typeof reciter.name === 'string' ? reciter.name : (reciter.name as any).ar;

    return {
      reciterId: reciter.id,
      surahNumber: surahNumber,
      surahName: this.surahNames[surahNumber - 1],
      reciterName: reciterName,
      audioUrl: audioUrl,
    };
  }
 private setupIsPlayingObservable(): void {
    this.isPlaying$ = combineLatest([
      this.playerService.currentTrack$,
      this.playerService.isPlaying$
    ]).pipe(
      map(([track, isPlaying]) => 
        isPlaying && 
        track?.reciterId === this.reciter?.id && 
        track?.surahNumber === this.surahNumber
      )
    );
  }
  getReciterImage(reciterId: string): string {
    return reciterImageMap[reciterId] || defaultReciterImage;
  }

  playCurrentTrack(): void {
    if (this.reciter) {
      // Here you can bring the full list of Surahs to activate the next playback feature.
      this.quranService.getSurahListForReciter(this.reciter.id).subscribe(surahList => {
        this.playerService.play(this.reciter!, this.surahNumber, surahList);
      });
    }
  }
   togglePlayback(): void {
    if (this.reciter) {
      const currentTrack = this.playerService.currentTrack$.value;
      // If this surah is already working, switch
      if (currentTrack?.reciterId === this.reciter.id && currentTrack?.surahNumber === this.surahNumber) {
        this.playerService.togglePlayPause();
      } else {
        // If it doesn't work, turn it on.
        this.quranService.getSurahListForReciter(this.reciter.id).subscribe(surahList => {
          this.playerService.play(this.reciter!, this.surahNumber, surahList);
        });
      }
    }
  }
  
}