import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { Usuario } from '../user.model';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserService } from '../user.service';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
	let component: UserListComponent;
	let fixture: ComponentFixture<UserListComponent>;
	let userServiceSpy: { getUsers: () => Observable<Usuario[]> };

	const mockUsers: Usuario[] = [
		new Usuario(
			1,
			'octocat',
			'The Octocat',
			'octocat@github.com',
			'https://avatars.githubusercontent.com/u/583231?v=4',
			'developer',
			'San Francisco',
			[101, 102, 103]
		),
		new Usuario(
			2,
			'linus',
			'Linus Torvalds',
			'linus@kernel.org',
			'https://example.com/linus.png',
			'maintainer',
			'Helsinki',
			[201, 202]
		),
	];

	beforeEach(async () => {
		userServiceSpy = {
			getUsers: () => of(mockUsers),
		};
		spyOn(userServiceSpy, 'getUsers').and.returnValue(of(mockUsers));

		await TestBed.configureTestingModule({
			imports: [CommonModule],
			declarations: [UserListComponent, UserDetailComponent],
			providers: [{ provide: UserService, useValue: userServiceSpy }],
		}).compileComponents();

		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call getUsers once on init', () => {
		fixture.detectChanges();
		expect(userServiceSpy.getUsers).toHaveBeenCalledTimes(1);
	});

	it('should load users from service on init', () => {
		fixture.detectChanges();
		expect(component.users).toEqual(mockUsers);
	});

	it('should render one card per user', () => {
		fixture.detectChanges();
		const cards = fixture.debugElement.queryAll(By.css('.gh-user-list-item'));
		expect(cards.length).toBe(2);
	});

	it('should display the user name in each card', () => {
		fixture.detectChanges();
		const names = fixture.debugElement.queryAll(By.css('.gh-user-list-item .fw-semibold'));
		expect(names[0].nativeElement.textContent).toContain('The Octocat');
		expect(names[1].nativeElement.textContent).toContain('Linus Torvalds');
	});

	it('should display the username prefixed with @', () => {
		fixture.detectChanges();
		const usernames = fixture.debugElement.queryAll(By.css('.gh-user-list-item p.mb-1'));
		expect(usernames[0].nativeElement.textContent).toContain('@octocat');
		expect(usernames[1].nativeElement.textContent).toContain('@linus');
	});

	it('should display location and titlecased role', () => {
		fixture.detectChanges();
		const meta = fixture.debugElement.queryAll(By.css('.gh-user-list-item p.mb-0'));
		expect(meta[0].nativeElement.textContent).toContain('San Francisco');
		expect(meta[0].nativeElement.textContent).toContain('Developer');
	});

	it('should render avatar src and alt from model', () => {
		fixture.detectChanges();
		const avatar = fixture.debugElement.query(By.css('.gh-user-list-item img')).nativeElement as HTMLImageElement;
		expect(avatar.getAttribute('src')).toContain('avatars.githubusercontent.com');
		expect(avatar.getAttribute('alt')).toBe('octocat');
	});

	it('should calculate timestamp in hours for index 0', () => {
		expect(component.getTimestamp(0)).toBe('2h');
	});

	it('should calculate timestamp in days for 48 or more hours', () => {
		expect(component.getTimestamp(23)).toBe('2d');
	});

	it('should return 0m for index -1 edge case', () => {
		expect(component.getTimestamp(-1)).toBe('0m');
	});

	it('should set selectedUser when selectUser is called', () => {
		component.selectUser(mockUsers[0]);
		expect(component.selectedUser).toEqual(mockUsers[0]);
	});

	it('should set wasSelected to true when selecting a user', () => {
		component.selectUser(mockUsers[0]);
		expect(component.wasSelected).toBe(true);
	});

	it('should apply selected class to selected card', () => {
		component.selectedUser = mockUsers[1];
		component.wasSelected = true;
		fixture.detectChanges();

		const cards = fixture.debugElement.queryAll(By.css('.gh-user-list-item'));
		expect(cards[0].nativeElement.classList.contains('selected')).toBe(false);
		expect(cards[1].nativeElement.classList.contains('selected')).toBe(true);
	});

	it('should not have selected class before user selection', () => {
		fixture.detectChanges();
		const cards = fixture.debugElement.queryAll(By.css('.gh-user-list-item'));
		expect(cards.every((c) => !c.nativeElement.classList.contains('selected'))).toBe(true);
	});

	it('should not render detail component before any selection', () => {
		fixture.detectChanges();
		const details = fixture.debugElement.queryAll(By.directive(UserDetailComponent));
		expect(details.length).toBe(0);
	});

	it('should render desktop and mobile detail components after selection', () => {
		component.selectedUser = mockUsers[0];
		component.wasSelected = true;
		fixture.detectChanges();

		const details = fixture.debugElement.queryAll(By.directive(UserDetailComponent));
		expect(details.length).toBe(2);
	});

	it('should update selectedUser when another user is selected', () => {
		component.selectUser(mockUsers[0]);
		component.selectUser(mockUsers[1]);
		expect(component.selectedUser).toEqual(mockUsers[1]);
	});

	it('should render zero cards when service returns empty array', () => {
		(userServiceSpy.getUsers as jasmine.Spy).and.returnValue(of([]));
		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		const cards = fixture.debugElement.queryAll(By.css('.gh-user-list-item'));
		expect(cards.length).toBe(0);
	});

	it('should load users with required Usuario fields populated', () => {
		fixture.detectChanges();
		component.users.forEach((user) => {
			expect(user.id).toBeGreaterThan(0);
			expect(user.username.trim().length).toBeGreaterThan(0);
			expect(user.name.trim().length).toBeGreaterThan(0);
			expect(user.email.trim().length).toBeGreaterThan(0);
			expect(user.avatarUrl.trim().length).toBeGreaterThan(0);
			expect(user.role.trim().length).toBeGreaterThan(0);
			expect(user.location.trim().length).toBeGreaterThan(0);
			expect(Array.isArray(user.repoIds)).toBe(true);
		});
	});
});
