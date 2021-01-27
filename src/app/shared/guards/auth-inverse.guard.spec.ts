import { TestBed } from '@angular/core/testing';

import { AuthInverseGuard } from './auth-inverse.guard';

describe('AuthInverseGuard', () => {
  let guard: AuthInverseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthInverseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
