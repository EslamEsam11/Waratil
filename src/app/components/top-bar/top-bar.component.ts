import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// ✅ 1. استيراد ما نحتاجه للـ Forms
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged ,Subscription  } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  private searchService = inject(SearchService);
  private subscriptions = new Subscription();

  public searchControl = new FormControl('');

  ngOnInit(): void {
    // Listen for search field changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged() 
    ).subscribe(term => {
      this.searchService.updateSearchTerm(term || '');
    });
        // Second subscription: When the value in the service changes, update the field.
    const serviceSub = this.searchService.searchTerm$.subscribe(term => {
      //Check if the value is different to avoid unnecessary update.
      if (this.searchControl.value !== term) {
        // { emitEvent: false }To prevent an infinite loop
        this.searchControl.setValue(term, { emitEvent: false });
      }
    });
    this.subscriptions.add(serviceSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  }
