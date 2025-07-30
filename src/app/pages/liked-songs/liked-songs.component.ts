import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // ✅ استيراد RouterLink
import { LibraryService } from '../../services/library.service';
import { PlayerService, TrackInfo } from '../../services/player.service';
import { reciterImageMap, defaultReciterImage } from '../../services/reciter-images';

@Component({
  selector: 'app-liked-songs',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './liked-songs.component.html',
  styleUrl: './liked-songs.component.scss'
})
export class LikedSongsComponent {
  public libraryService = inject(LibraryService);
  public playerService = inject(PlayerService);

  //Image fetch function
  getReciterImage(track: TrackInfo): string {
    return reciterImageMap[track.reciterId] || defaultReciterImage;
  }

  // Operator function
  playTrack(track: TrackInfo, event: MouseEvent): void {
    console.log("Play functionality for individual liked tracks needs further implementation.");
  }

  // Function to stop the event transition when the link is clicked
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
    removeTrack(track: TrackInfo, event: MouseEvent): void {
    event.stopPropagation();
    this.libraryService.toggleLike(track);
  }
}