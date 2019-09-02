import { TestBed } from '@angular/core/testing';

import { NgHelpersService } from './ng-helpers.service';

describe('NgHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgHelpersService = TestBed.get(NgHelpersService);
    expect(service).toBeTruthy();
  });
});
