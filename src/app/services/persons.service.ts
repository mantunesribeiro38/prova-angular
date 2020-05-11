import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, take, delay } from 'rxjs/operators';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {

  private readonly API_URL = `${environment.API_URL}` ;

  constructor(
    private http: HttpClient
  ) { }
  
  
  list() {
      return this.http.get<Person[]>(`${this.API_URL}persons`).pipe(
        take(1)
      );
  }

  create(person:Person) {
    console.log("Create");
    return this.http.post<Person>(`${this.API_URL}persons/`, person).pipe(
        tap(console.log),
        take(1
     ));
  }

  update(person:Person) {
    return this.http.put(`${this.API_URL}persons/${person['id']}`, person).pipe(take(1));
  }

  remove(id) {
    return this.http.delete(`${this.API_URL}persons/${id}`).pipe(take(1));
  }

  findById(id){
    return this.http.get(`${this.API_URL}persons/${id}`).pipe(
      take(1)
    );
  }
}