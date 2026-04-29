import { Routes, RouterModule } from '@angular/router';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { NgModule } from '@angular/core';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';

const routes: Routes = [
  { 
    path: '',
    component: RepositoryListComponent
  },
  { 
    path: ':id',
    component: RepositoryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RepositoryRoutingModule {}