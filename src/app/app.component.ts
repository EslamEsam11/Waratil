import { Component , inject } from '@angular/core';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { RouterModule } from '@angular/router';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from "./components/header/header.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LeftSidebarComponent,
    MainViewComponent,
    RightSidebarComponent,
    PlayerControlsComponent,
    RouterModule 
    ,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'spotify-clone';
  private router = inject(Router);
    public isMainViewHovered = false;
  private scrollTimer: any;
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
    onMainViewEnter(): void {
    //When the mouse enters cancel any existing timer and show the bar immediately
    clearTimeout(this.scrollTimer);
    this.isMainViewHovered = true;
  }

  onMainViewLeave(): void {
    // When the mouse is out, start a 1-second timer to hide the bar
    this.scrollTimer = setTimeout(() => {
      this.isMainViewHovered = false;
    }, 1000); 
  }
}