import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { RepositoryDetailComponent } from './repository-detail.component';
import { RepositoryService } from '../repository.service';
import { Repositorio } from '../repository.model';

const makeRepo = (overrides: Partial<Repositorio> = {}): Repositorio =>
  new Repositorio(
    overrides.id ?? 1,
    overrides.name ?? 'my-repo',
    overrides.description ?? 'A description',
    overrides.language ?? 'TypeScript',
    overrides.stars ?? 500,
    overrides.createdAt ?? '2024-06-01',
    overrides.ownerId ?? 1,
  );

const activatedRouteStub = (id: string | null) => ({
  paramMap: of(convertToParamMap(id !== null ? { id } : {})),
});

describe('RepositoryDetailComponent', () => {
  let component: RepositoryDetailComponent;
  let fixture: ComponentFixture<RepositoryDetailComponent>;
  let serviceSpy: jasmine.SpyObj<RepositoryService>;

  const setup = (id: string | null, serviceReturn: Observable<Repositorio>) => {
    serviceSpy.getRepositoryById.and.returnValue(serviceReturn as any);
    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteStub(id) });
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('RepositoryService', ['getRepositoryById']);

    TestBed.configureTestingModule({
      declarations: [RepositoryDetailComponent],
      providers: [
        { provide: RepositoryService, useValue: serviceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub('1') },
      ],
    }).compileComponents();
  });

  // 1
  it('should create', () => {
    serviceSpy.getRepositoryById.and.returnValue(of(makeRepo()));
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // 2
  it('should load repository when a valid id is provided', () => {
    setup('1', of(makeRepo({ id: 1, name: 'test-repo' })));
    expect(component.repository).toBeDefined();
    expect(component.repository!.name).toBe('test-repo');
  });

  // 3
  it('should clear errorMessage on successful load', () => {
    setup('1', of(makeRepo()));
    expect(component.errorMessage).toBe('');
  });

  // 4
  it('should set isLoading to false after successful load', () => {
    setup('1', of(makeRepo()));
    expect(component.isLoading).toBeFalse();
  });

  // 5
  it('should set errorMessage when id param is missing', () => {
    serviceSpy.getRepositoryById.and.returnValue(of(makeRepo()));
    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteStub(null) });
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('No se recibio el id del repositorio.');
  });

  // 6
  it('should set errorMessage when service returns an error', () => {
    setup('99', throwError(() => new Error('No se encontro el repositorio con id 99')));
    expect(component.errorMessage).toBe('No se encontro el repositorio con id 99');
  });

  // 7
  it('should set isLoading to false on error', () => {
    setup('99', throwError(() => new Error('fail')));
    expect(component.isLoading).toBeFalse();
  });

  // 8
  it('should return "0" for starsLabel when repository is undefined', () => {
    setup('99', throwError(() => new Error('fail')));
    expect(component.starsLabel).toBe('0');
  });

  // 9
  it('should return plain number string for starsLabel when stars < 1000', () => {
    setup('1', of(makeRepo({ stars: 750 })));
    expect(component.starsLabel).toBe('750');
  });

  // 10
  it('should return k-formatted string for starsLabel when stars >= 1000', () => {
    setup('1', of(makeRepo({ stars: 2500 })));
    expect(component.starsLabel).toBe('2.5k');
  });

  // 11
  it('should return "#" for repositoryUrl when repository is undefined', () => {
    setup('99', throwError(() => new Error('fail')));
    expect(component.repositoryUrl).toBe('#');
  });

  // 12
  it('should return a valid github URL for repositoryUrl', () => {
    setup('1', of(makeRepo({ name: 'my-repo' })));
    expect(component.repositoryUrl).toBe('https://github.com/demo/my-repo');
  });

  // 13
  it('should return empty array for topicTags when repository is undefined', () => {
    setup('99', throwError(() => new Error('fail')));
    expect(component.topicTags).toEqual([]);
  });

  // 14
  it('should return correct topic tags based on language', () => {
    setup('1', of(makeRepo({ language: 'TypeScript' })));
    expect(component.topicTags).toEqual(['typescript', 'github', 'explorer']);
  });

  // 15
  it('should format tag using special map or capitalize first letter', () => {
    serviceSpy.getRepositoryById.and.returnValue(of(makeRepo()));
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.formatTag('github')).toBe('GitHub');
    expect(component.formatTag('typescript')).toBe('TypeScript');
    expect(component.formatTag('explorer')).toBe('Explorer');
  });
});
