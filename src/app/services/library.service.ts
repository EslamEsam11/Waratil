import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrackInfo } from './player.service'; 
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private readonly LIBRARY_KEY = 'quran_library';
  private likedTracksSubject = new BehaviorSubject<TrackInfo[]>([]);
  public likedTracks$ = this.likedTracksSubject.asObservable();
  private toastr = inject(ToastrService);

  constructor() {
    this.loadLibraryFromStorage();
  }

  private loadLibraryFromStorage(): void {
    const storedLibrary = localStorage.getItem(this.LIBRARY_KEY);
    if (storedLibrary) {
      this.likedTracksSubject.next(JSON.parse(storedLibrary));
    }
  }

  private saveLibraryToStorage(tracks: TrackInfo[]): void {
    localStorage.setItem(this.LIBRARY_KEY, JSON.stringify(tracks));
    this.likedTracksSubject.next(tracks);
  }

  public updateTrackInLibrary(updatedTrack: TrackInfo): void {
    if (this.isLiked(updatedTrack)) {
      console.log('LibraryService: Updating track in library:', updatedTrack); 
      const currentLibrary = this.likedTracksSubject.value;
      const updatedLibrary = currentLibrary.map(track => 
        track.audioUrl === updatedTrack.audioUrl ? updatedTrack : track
      );
      this.saveLibraryToStorage(updatedLibrary);
    }
  }
  // A function to check whether the surah is liked or not
  isLiked(track: TrackInfo): boolean {
    const currentLibrary = this.likedTracksSubject.value;
    // We verify using the audio link because it is unique.
    return currentLibrary.some(t => t.audioUrl === track.audioUrl);
  }

  toggleLike(track: TrackInfo): void {
    const currentLibrary = this.likedTracksSubject.value;
    // Find the current version of the Surah in the library (if available)
    const existingTrack = currentLibrary.find(t => t.audioUrl === track.audioUrl);

    let updatedLibrary: TrackInfo[];

    if (existingTrack) {
      // ---Deletion status---
      updatedLibrary = currentLibrary.filter(t => t.audioUrl !== track.audioUrl);
      this.toastr.warning(`تم حذف "${track.surahName}" من الإعجابات`);
    } else {
      const newTrackToAdd = { ...track };

      // Add the new Surah to the library
      updatedLibrary = [...currentLibrary, newTrackToAdd];
      this.toastr.success(`تمت إضافة "${track.surahName}" إلى الإعجابات`);
    }

    this.saveLibraryToStorage(updatedLibrary);
  }
}