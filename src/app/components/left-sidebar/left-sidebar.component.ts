import { Component, inject } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { PlayerService } from '../../services/player.service';
import { TrackInfo } from '../../services/player.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent {
  public libraryService = inject(LibraryService);
  public playerService = inject(PlayerService);
 playTrackFromLibrary(track: TrackInfo): void {
    console.log("Playing from library is not fully implemented yet, but the track is:", track);
  }

}
