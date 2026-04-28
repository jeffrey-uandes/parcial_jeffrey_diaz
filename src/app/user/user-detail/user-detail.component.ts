import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  standalone: false
})
export class UserDetailComponent implements OnInit {
  
  @Input() userDetail!: User;
  
  constructor() { }

  ngOnInit() {
  }

  get followers(): string {
    return `${(20 + this.userDetail.id * 0.17).toFixed(1)}k`;
  }

  get following(): number {
    return 8 + (this.userDetail.id % 20);
  }

  get repositories(): number {
    return this.userDetail.repoIds?.length ?? 0;
  }

  get stars(): string {
    const base = (this.userDetail.repoIds?.reduce((acc, id) => acc + id, 0) ?? 0) * 0.12;
    return `${Math.max(1, Math.round(base / 10) / 10).toFixed(1)}k`;
  }

  get companyTag(): string {
    return `@${this.userDetail.username}-labs`;
  }

  get website(): string {
    return `${this.userDetail.username}.dev`;
  }

  get joinedDate(): string {
    const month = ((this.userDetail.id % 12) + 1).toString().padStart(2, '0');
    const day = ((this.userDetail.id % 27) + 1).toString().padStart(2, '0');
    return `20${10 + (this.userDetail.id % 14)}-${month}-${day}`;
  }

  get pinnedRepos(): number[] {
    return (this.userDetail.repoIds ?? []).slice(0, 2);
  }

  repoName(repoId: number): string {
    return `repo-${repoId}`;
  }

  repoStars(repoId: number): string {
    return `${(3 + (repoId % 70) / 10).toFixed(1)}k`;
  }
}