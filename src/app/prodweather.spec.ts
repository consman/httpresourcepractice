import { TestBed } from '@angular/core/testing';
import { Prodweather } from './prodweather';

describe('Prodweather', () => {
  let service: Prodweather;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prodweather);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
