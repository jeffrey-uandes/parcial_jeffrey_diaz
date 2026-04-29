import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';
import { RepositoryRoutingModule } from './repository.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RepositoryRoutingModule,
  ],
  declarations: [RepositoryListComponent, RepositoryDetailComponent],
})
export class RepositoryModule { }