import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { reciterImageMap, defaultReciterImage } from '../../services/reciter-images';
import { QuranDataService, Reciter } from '../../services/quran-data.service';
import { Observable } from 'rxjs';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-player-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-controls.component.html',
  styleUrl: './player-controls.component.scss'
})
export class PlayerControlsComponent {
  public playerService = inject(PlayerService);
 public reciters$!: Observable<{ reciters: Reciter[] }>;
   public libraryService = inject(LibraryService);
  private isSeeking = false;
  private isSettingVolume = false;

  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;
  @ViewChild('volumeBar') volumeBar!: ElementRef<HTMLElement>;

  onToggleLike(): void {
    const currentTrack = this.playerService.currentTrack$.value;
    if (currentTrack) {
      this.libraryService.toggleLike(currentTrack);
    }
  }

  // When you start pressing the progress bar
  onSeekStart(event: MouseEvent): void {
    this.isSeeking = true;
    this.calculateSeek(event); //Update instantly when pressed
  }

  //When you start pressing the volume bar
  onSetVolumeStart(event: MouseEvent): void {
    this.isSettingVolume = true;
    this.calculateVolume(event); // Update immediately
  }


  //It is called when the mouse is moved anywhere on the page
  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent): void {
    if (this.isSeeking) {
      this.calculateSeek(event);
    }
    if (this.isSettingVolume) {
      this.calculateVolume(event);
    }
  }

  // It is called when you release the mouse button anywhere on the page
  @HostListener('window:mouseup')
  onWindowMouseUp(): void {
    this.isSeeking = false;
    this.isSettingVolume = false;
  }


  private calculateSeek(event: MouseEvent): void {
    const progressBarElement = this.progressBar.nativeElement;
    const rect = progressBarElement.getBoundingClientRect();
    const clickPositionX = event.clientX - rect.left; 
    const progressBarWidth = progressBarElement.clientWidth;
    
    const seekRatio = Math.max(0, Math.min(1, clickPositionX / progressBarWidth));
    
    const trackDuration = this.playerService.duration;
    if (!isNaN(trackDuration)) {
      this.playerService.seekTo(seekRatio * trackDuration);
    }
  }

  private calculateVolume(event: MouseEvent): void {
    const volumeBarElement = this.volumeBar.nativeElement;
    const rect = volumeBarElement.getBoundingClientRect();
    const clickPositionX = event.clientX - rect.left;
    const volumeBarWidth = volumeBarElement.clientWidth;

    const volume = Math.max(0, Math.min(1, clickPositionX / volumeBarWidth));
    this.playerService.setVolume(volume);
  }
    getReciterImage(reciterId: string): string {
      return reciterImageMap[reciterId] || defaultReciterImage;
    }
}

