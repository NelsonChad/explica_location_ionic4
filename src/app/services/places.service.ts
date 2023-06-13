import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private apiUrl: any;
  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = `${this.env.API_URL}/places`;
    console.log('Complete URL: ', this.apiUrl);
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getPlaces(page): Observable<any> {
    return this.http.get(this.apiUrl, httpOptions).pipe(
      map(this.extractData),
      retry(2)
    );
  }

  getPlace(id: number): Observable<any> {
    console.log('SHOWING Place');

    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData));
  }

  getContacts(id: number): Observable<any> {
    console.log('SHOWING Contacts');

    const url = `${this.env.API_URL}/explainers/contacts/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData));
  }

  getSubjects(id: number): Observable<any> {
    console.log('SHOWING Contacts');

    const url = `${this.env.API_URL}/explainers/subjects/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData));
  }


  getEnroll(id: number): Observable<any> {
    console.log('SHOWING Enrolments: ', id);

    const url = `${this.env.API_URL}/enrollments/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData));
  }
}
