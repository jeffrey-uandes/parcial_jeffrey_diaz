import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RepositoryService } from './repository.service';

describe('Service: Repository', () => {
  let service: RepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient(), provideHttpClientTesting() ]
    });
    service = TestBed.inject(RepositoryService);
  });

  it('should ...', () => {
    expect(service).toBeTruthy();
  });
});
