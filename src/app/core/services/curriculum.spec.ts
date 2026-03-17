import { TestBed } from '@angular/core/testing';

import { Curriculum } from './curriculum';

describe('Curriculum', () => {
  let service: Curriculum;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Curriculum);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
