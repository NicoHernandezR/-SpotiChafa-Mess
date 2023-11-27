import { TestBed } from '@angular/core/testing';

import { AudioReproducerService } from './audio-reproducer.service';

describe('AudioReproducerService', () => {
  let service: AudioReproducerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioReproducerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
