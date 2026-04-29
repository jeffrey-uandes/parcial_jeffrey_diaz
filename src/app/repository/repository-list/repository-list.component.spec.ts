import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RepositoryListComponent } from './repository-list.component';
import { RepositoryService } from '../repository.service';
import { Repositorio } from '../repository.model';

const makeRepo = (overrides: Partial<Repositorio> = {}): Repositorio =>
  new Repositorio(
    overrides.id ?? 1,
    overrides.name ?? 'my-repo',
    overrides.description ?? 'A description',
    overrides.language ?? 'TypeScript',
    overrides.stars ?? 500,
    overrides.createdAt ?? '2024-03-15',
    overrides.ownerId ?? 1,
  );

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;
  let serviceSpy: jasmine.SpyObj<RepositoryService>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('RepositoryService', ['getRepositories']);
    serviceSpy.getRepositories.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [RepositoryListComponent],
      imports: [FormsModule, RouterModule.forRoot([])],
      providers: [{ provide: RepositoryService, useValue: serviceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
  });

  // 1
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // 2
  it('should load repositories on init', () => {
    const repos = [makeRepo({ id: 1 }), makeRepo({ id: 2 })];
    serviceSpy.getRepositories.and.returnValue(of(repos));
    fixture.detectChanges();
    expect(component.repositories.length).toBe(2);
  });

  // 3
  it('should clear errorMessage on successful load', () => {
    serviceSpy.getRepositories.and.returnValue(of([makeRepo()]));
    fixture.detectChanges();
    expect(component.errorMessage).toBe('');
  });

  // 4
  it('should set errorMessage when service fails', () => {
    serviceSpy.getRepositories.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.errorMessage).toBe('No fue posible cargar los repositorios.');
  });

  // 5
  it('should set repositories to empty array on service error', () => {
    serviceSpy.getRepositories.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.repositories.length).toBe(0);
  });

  // 6
  it('should return all repositories when searchTerm is empty', () => {
    const repos = [makeRepo({ id: 1 }), makeRepo({ id: 2 })];
    serviceSpy.getRepositories.and.returnValue(of(repos));
    fixture.detectChanges();
    component.searchTerm = '';
    expect(component.filteredRepositories.length).toBe(2);
  });

  // 7
  it('should filter repositories by name', () => {
    const repos = [makeRepo({ name: 'angular-app' }), makeRepo({ name: 'react-app' })];
    serviceSpy.getRepositories.and.returnValue(of(repos));
    fixture.detectChanges();
    component.searchTerm = 'angular';
    expect(component.filteredRepositories.length).toBe(1);
    expect(component.filteredRepositories[0].name).toBe('angular-app');
  });

  // 8
  it('should filter repositories by description', () => {
    const repos = [
      makeRepo({ description: 'backend api project' }),
      makeRepo({ description: 'frontend ui' }),
    ];
    serviceSpy.getRepositories.and.returnValue(of(repos));
    fixture.detectChanges();
    component.searchTerm = 'backend';
    expect(component.filteredRepositories.length).toBe(1);
  });

  // 9
  it('should filter repositories by language', () => {
    const repos = [makeRepo({ language: 'Python' }), makeRepo({ language: 'TypeScript' })];
    serviceSpy.getRepositories.and.returnValue(of(repos));
    fixture.detectChanges();
    component.searchTerm = 'python';
    expect(component.filteredRepositories.length).toBe(1);
    expect(component.filteredRepositories[0].language).toBe('Python');
  });

  // 10
  it('should return empty array when no repository matches search', () => {
    serviceSpy.getRepositories.and.returnValue(of([makeRepo({ name: 'angular-app' })]));
    fixture.detectChanges();
    component.searchTerm = 'xyz-nonexistent';
    expect(component.filteredRepositories.length).toBe(0);
  });

  // 11
  it('should return the correct color for a known language', () => {
    fixture.detectChanges();
    expect(component.getLangColor('TypeScript')).toBe('#3178c6');
    expect(component.getLangColor('Python')).toBe('#3572A5');
  });

  // 12
  it('should return default color for an unknown language', () => {
    fixture.detectChanges();
    expect(component.getLangColor('UnknownLang')).toBe('#8e8e8e');
  });

  // 13
  it('should format stars below 1000 as plain number string', () => {
    fixture.detectChanges();
    expect(component.formatStars(999)).toBe('999');
    expect(component.formatStars(0)).toBe('0');
  });

  // 14
  it('should format stars >= 1000 with k suffix', () => {
    fixture.detectChanges();
    expect(component.formatStars(1500)).toBe('1.5k');
    expect(component.formatStars(2000)).toBe('2k');
  });

  // 15
  it('should format date string into readable Spanish format', () => {
    fixture.detectChanges();
    const result = component.formatDate('2024-03-15');
    expect(result).toContain('15');
    expect(result).toContain('mar');
    expect(result).toContain('2024');
  });
});
