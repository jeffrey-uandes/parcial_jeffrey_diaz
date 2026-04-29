import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserDetailComponent } from './user-detail.component';
import { Usuario } from '../user.model';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockUser: Usuario;

  beforeEach(async () => {
    mockUser = new Usuario(
      7,
      'jdiaz',
      'Jeffrey Diaz',
      'jeffrey@correo.com',
      'https://example.com/avatar.jpg',
      'frontend developer',
      'Bogota',
      [10, 25, 30]
    );

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [UserDetailComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    component.userDetail = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the user name', () => {
    const name = fixture.debugElement.query(By.css('.profile-name')).nativeElement as HTMLElement;
    expect(name.textContent).toContain('Jeffrey Diaz');
  });

  it('should render the username with @ prefix', () => {
    const username = fixture.debugElement.query(By.css('.profile-username')).nativeElement as HTMLElement;
    expect(username.textContent).toContain('@jdiaz');
  });

  it('should render the user email in profile information', () => {
    const emailEntries = fixture.debugElement
      .queryAll(By.css('.profile-meta li'))
      .map((el) => (el.nativeElement as HTMLElement).textContent ?? '');

    expect(emailEntries.some((text) => text.includes('jeffrey@correo.com'))).toBe(true);
  });

  it('should render avatar image alt as user name', () => {
    const avatar = fixture.debugElement.query(By.css('.profile-avatar')).nativeElement as HTMLImageElement;
    expect(avatar.getAttribute('alt')).toBe('Jeffrey Diaz');
  });

  it('should compute followers based on user id', () => {
    expect(component.followers).toBe('21.2k');
  });

  it('should compute following based on user id', () => {
    expect(component.following).toBe(15);
  });

  it('should compute repositories from repoIds length', () => {
    expect(component.repositories).toBe(3);
  });

  it('should return 0 repositories when repoIds is undefined', () => {
    component.userDetail = new Usuario(8, 'ana', 'Ana', 'ana@mail.com', 'https://example.com/a.png', 'qa', 'Lima', undefined as unknown as number[]);
    expect(component.repositories).toBe(0);
  });

  it('should compute stars from repo ids', () => {
    expect(component.stars).toBe('1.0k');
  });

  it('should return minimum stars value when repos are missing', () => {
    component.userDetail = new Usuario(3, 'sam', 'Sam', 'sam@mail.com', 'https://example.com/s.png', 'devops', 'Quito', undefined as unknown as number[]);
    expect(component.stars).toBe('1.0k');
  });

  it('should compute companyTag from username', () => {
    expect(component.companyTag).toBe('@jdiaz-labs');
  });

  it('should compute website from username', () => {
    expect(component.website).toBe('jdiaz.dev');
  });

  it('should compute joinedDate in expected format', () => {
    expect(component.joinedDate).toBe('2017-08-08');
  });

  it('should return first two repositories as pinnedRepos', () => {
    expect(component.pinnedRepos).toEqual([10, 25]);
  });

  it('should return empty pinnedRepos when repoIds is undefined', () => {
    component.userDetail = new Usuario(5, 'mia', 'Mia', 'mia@mail.com', 'https://example.com/m.png', 'designer', 'Medellin', undefined as unknown as number[]);
    expect(component.pinnedRepos).toEqual([]);
  });

  it('should format repository name with repo prefix', () => {
    expect(component.repoName(45)).toBe('repo-45');
  });

  it('should format repository stars as k values', () => {
    expect(component.repoStars(25)).toBe('5.5k');
  });

  it('should render one card per pinned repository', () => {
    const cards = fixture.debugElement.queryAll(By.css('.col-12.col-md-6'));
    expect(cards.length).toBe(2);
  });

  it('should validate required Usuario fields used in the detail view', () => {
    expect(component.userDetail.id).toBeGreaterThan(0);
    expect(component.userDetail.username.trim().length).toBeGreaterThan(0);
    expect(component.userDetail.name.trim().length).toBeGreaterThan(0);
    expect(component.userDetail.email.trim().length).toBeGreaterThan(0);
    expect(component.userDetail.avatarUrl.trim().length).toBeGreaterThan(0);
    expect(component.userDetail.role.trim().length).toBeGreaterThan(0);
    expect(component.userDetail.location.trim().length).toBeGreaterThan(0);
    expect(Array.isArray(component.userDetail.repoIds)).toBe(true);
  });
});
