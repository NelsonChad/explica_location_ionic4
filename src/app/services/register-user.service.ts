import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  authSubject = new BehaviorSubject(false);

  private apiUrl: any;
  constructor(private http: HttpClient, private env: EnvService) {
    this.apiUrl = this.env.API_URL;
    // console.log('Complete URL: ', this.apiUrl);
  }

  public addExplainer(explainer: any): Observable<any> {
    console.log('Explainer: ' + JSON.stringify(explainer));
    return this.http.post(this.apiUrl + '/explainers/store', JSON.stringify(explainer), httpOptions).pipe(
      tap(async (res) => {
        console.log(`added explainer named: ${res.explainer.name}`);
        console.log(`Message: ${res.message}`);
      }));
  }

  public addStudent(student: any): Observable<any> {
    console.log('Explainer: ' + JSON.stringify(student));
    return this.http.post(this.apiUrl + '/student/store', JSON.stringify(student), httpOptions).pipe(
      tap(async (res) => {
        console.log(`added student named: ${res.student.name}`);
        console.log(`Message: ${res.message}`);
      }));
  }

  public addContact(contact: any): Observable<any> {
    console.log('CONTACT: ' + JSON.stringify(contact));

    return this.http.post(this.apiUrl + '/explainers/contact/store', JSON.stringify(contact), httpOptions).pipe(
      tap(async (res) => {
        console.log(`Message: ${res.message}`);
      }));
  }

  public addRequest(req: any): Observable<any> {
    console.log('REQUEST: ' + JSON.stringify(req));

    return this.http.post(this.apiUrl + '/enrollment/store', JSON.stringify(req), httpOptions).pipe(
      tap(async (res) => {
        console.log(`Message: ${res.message}`);
      }));
  }

  addSubject(contact): Observable<any> {
    return this.http.post(this.apiUrl + '/explainers/subject/store', JSON.stringify(contact), httpOptions).pipe(
      tap(async (res) => {
        console.log(`Message: ${res.message}`);
      }));
  }

}
