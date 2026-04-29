import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Usuario } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  standalone: false
})
export class UserListComponent implements OnInit {
  users: Usuario[] = [];
  selectedUser: Usuario | null = null;
  wasSelected: boolean = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.cdr.detectChanges();
    });
  }

  getTimestamp(index: number): string {
    const hoursAgo = (index + 1) * 2;
    if (hoursAgo >= 48) return `${Math.floor(hoursAgo / 24)}d`;
    if (hoursAgo >= 1) return `${hoursAgo}h`;
    return `${hoursAgo * 60}m`;
  }

  selectUser(user: Usuario) {
    this.selectedUser = user;
    this.wasSelected = true;
  }
}