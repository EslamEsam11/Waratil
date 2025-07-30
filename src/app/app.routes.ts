import { Routes } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';
import { ReciterDetailsComponent } from './pages/reciter-details/reciter-details.component';
import { LikedSongsComponent } from './pages/liked-songs/liked-songs.component';
import { TrackDetailsComponent } from './pages/track-details/track-details.component';
import { InstallAppComponent } from './components/install-app/install-app.component';

export const routes: Routes = [
  { path: '', component: MainViewComponent }, 
  { path: 'reciter/:id', component: ReciterDetailsComponent },
   { path: 'liked', component: LikedSongsComponent },
   { path: 'installapp', component: InstallAppComponent },
     { path: 'track/:reciterId/:surahNumber', component: TrackDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];