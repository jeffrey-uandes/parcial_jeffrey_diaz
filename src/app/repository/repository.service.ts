import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment.development';
import { Repositorio } from './repository.model';

@Injectable({
  providedIn: 'root'
})

export class RepositoryService {
  private baseUrl = environment.repositoriesUrl;

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<Repositorio[]> {
    return this.http.get<Repositorio[]>(this.baseUrl);
  }

  getRepositoryById(id: string): Observable<Repositorio> {
    const repositoryId = Number(id);

    if (Number.isNaN(repositoryId)) {
      return throwError(() => new Error('El id del repositorio es invalido'));
    }

    return this.getRepositories().pipe(
      map((repositories) => {
        const repository = repositories.find((r) => r.id === repositoryId);

        if (!repository) {
          throw new Error(`No se encontro el repositorio con id ${id}`);
        }

        return repository;
      })
    );
  }
}