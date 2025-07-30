import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reciter } from './quran-data.service';
import { Title } from '@angular/platform-browser';
import { LibraryService } from './library.service';
import { Observable } from 'rxjs';
// New interface clearly depicts audio clip data
export interface TrackInfo {
  reciterName: string;
  surahName: string;
  audioUrl: string;
    surahNumber: number;
      reciterId: string;
       duration?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
    private currentReciter: Reciter | null = null;
  private currentSurahList: { number: number, name: string }[] = [];
   private audio: HTMLAudioElement;
     private readonly PLAYER_STATE_KEY = 'quran_player_state';

  // private audio = new Audio();
    public volume$ = new BehaviorSubject<number>(1); 
  public currentTrack$ = new BehaviorSubject<TrackInfo | null>(null);
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public progress$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<string>('0:00');
  public currentTime$ = new BehaviorSubject<string>('0:00');
    public isMuted$ = new BehaviorSubject<boolean>(false);
  private titleService = inject(Title);
  private libraryService = inject(LibraryService);
  private defaultTitle = 'Waratil';
 public get duration(): number {
    return this.audio.duration;
  }
  
  // List of surah names for ease of presentation
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
  public getTrackDuration(audioUrl: string): Observable<string> {
    return new Observable(observer => {
      const audio = new Audio();
      audio.src = audioUrl;

      //When the clip data is loaded successfully
      audio.addEventListener('loadedmetadata', () => {
        const duration = this.formatTime(audio.duration);
        observer.next(duration); // Send the duration
        observer.complete(); // Complete the process
      });

      audio.addEventListener('error', (err) => {
        observer.error(err);
      });
    });
  }
constructor() {
    this.audio = new Audio();

    this.audio.addEventListener('timeupdate', () => {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.progress$.next(progress || 0);
      this.currentTime$.next(this.formatTime(this.audio.currentTime));
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const duration = this.formatTime(this.audio.duration);
      this.duration$.next(duration);

      const currentTrack = this.currentTrack$.value;
      if (currentTrack && !currentTrack.duration) {
        const updatedTrack = { ...currentTrack, duration: duration };
        this.currentTrack$.next(updatedTrack);
        this.libraryService.updateTrackInLibrary(updatedTrack);
        this.saveState();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.playNext();
    });

    this.audio.addEventListener('volumechange', () => {
      this.volume$.next(this.audio.volume);
      this.isMuted$.next(this.audio.muted);
    });

    this.loadState();

    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
  }
  seekTo(timeInSeconds: number): void {
    if (!isNaN(timeInSeconds)) {
      this.audio.currentTime = timeInSeconds;
    }
  }
    setVolume(volumeLevel: number): void {
    if (volumeLevel >= 0 && volumeLevel <= 1) {
      this.audio.volume = volumeLevel;
    }
      this.saveState();
  }
  play(reciter: Reciter, surahNumber: number, surahList?: { number: number, name: string }[]): void {
        this.currentReciter = reciter;
    this.currentSurahList = surahList || [];
    // Verify reader data validity
    if (!reciter.moshaf || reciter.moshaf.length === 0) {
      console.error("This reciter has no audio sources (moshaf).", reciter);
      return;
    }

    //  Extract basic data
    const serverUrl = reciter.moshaf[0].server;
    const formattedSurah = surahNumber.toString().padStart(3, '0');
    const audioUrl = `${serverUrl}/${formattedSurah}.mp3`;
    const surahName = this.surahNames[surahNumber - 1] || `Surah ${surahNumber}`;

    //Solution to [object Object]: Check the type of the reader name
    const reciterName = typeof reciter.name === 'string'
      ? reciter.name
      : (reciter.name as any).ar;

    //  Create a clean, custom data object for the operator.
    const trackData: TrackInfo = {
      reciterName: reciterName,
      surahName: surahName,
      audioUrl: audioUrl,
      surahNumber: surahNumber,
      reciterId: reciter.id 
    };
    this.titleService.setTitle(`${trackData.surahName} • ${trackData.reciterName}`);

    // Send clean data to the operator and play audio.
    this.currentTrack$.next(trackData);
    this.audio.src = trackData.audioUrl;
    this.audio.play().catch(e => console.error("Error playing audio:", e));
    this.isPlaying$.next(true);
     this.saveState();
  }
 public playNext(): void {
    const currentTrack = this.currentTrack$.value;
    
    if (!currentTrack || !this.currentReciter || this.currentSurahList.length === 0) {
      this.isPlaying$.next(false);
      return;
    }

    const currentIndex = this.currentSurahList.findIndex(
      surah => surah.number === currentTrack.surahNumber
    );

    if (currentIndex !== -1 && currentIndex < this.currentSurahList.length - 1) {
      const nextSurah = this.currentSurahList[currentIndex + 1];
      this.play(this.currentReciter, nextSurah.number, this.currentSurahList);
    } else {
      this.isPlaying$.next(false);
            this.titleService.setTitle(this.defaultTitle);

    }
  }
  public playPrevious(): void {
    const currentTrack = this.currentTrack$.value;

    if (!currentTrack || !this.currentReciter || this.currentSurahList.length === 0) {
      return;
    }

    if (this.audio.currentTime > 3) {
      this.seekTo(0);
      return;
    }

    const currentIndex = this.currentSurahList.findIndex(
      surah => surah.number === currentTrack.surahNumber
    );

    if (currentIndex > 0) {
      const previousSurah = this.currentSurahList[currentIndex - 1];
      this.play(this.currentReciter, previousSurah.number, this.currentSurahList);
    } else {
      this.seekTo(0);
    }
  }

  togglePlayPause(): void {
    if (!this.currentTrack$.value) return; 
        const track = this.currentTrack$.value;

    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying$.next(true);
            this.titleService.setTitle(`${track.surahName} • ${track.reciterName}`);

    } else {
      this.audio.pause();
      this.isPlaying$.next(false);
    this.titleService.setTitle(`${track.reciterName} • ${this.defaultTitle}`);
      this.saveState();
    }
     if (this.audio.paused) {
    this.saveState();
  }
  }
   public toggleMute(): void {
    this.audio.muted = !this.audio.muted;
    this.isMuted$.next(this.audio.muted);
      this.saveState();
  }
  private formatTime(time: number): string {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
    private saveState(): void {
    //Don't save anything if there is no clip playing.
    if (!this.currentTrack$.value) return;

    const state = {
      reciter: this.currentReciter,
      surahList: this.currentSurahList,
      track: this.currentTrack$.value,
      time: this.audio.currentTime,
      volume: this.audio.volume,
      muted: this.audio.muted,
    };
    // Convert the object to JSON text and store it
    localStorage.setItem(this.PLAYER_STATE_KEY, JSON.stringify(state));
  }

  private loadState(): void {
    const savedStateJSON = localStorage.getItem(this.PLAYER_STATE_KEY);
    if (savedStateJSON) {
      const state = JSON.parse(savedStateJSON);
      if (state.track && state.reciter) {
        // Recover all saved data
        this.currentReciter = state.reciter;
        this.currentSurahList = state.surahList;
        this.currentTrack$.next(state.track);

        // Download the audio file and restore it without playing it.
        this.audio.src = state.track.audioUrl;
        this.audio.currentTime = state.time;
        this.audio.volume = state.volume;
        this.audio.muted = state.muted;
      }
    }
  }
}