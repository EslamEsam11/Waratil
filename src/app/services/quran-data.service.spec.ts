import { TestBed } from '@angular/core/testing';

import { QuranDataService } from './quran-data.service';

describe('QuranDataService', () => {
  let service: QuranDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuranDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
