import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.development';
import { Usuario } from './user.model';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private baseUrl = environment.usersUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }
}