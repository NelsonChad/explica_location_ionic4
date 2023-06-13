import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  })
};

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  authSubject = new BehaviorSubject(false);
  isExplainer = new BehaviorSubject(false);

  constructor(
    private env: EnvService,
    private httpClient: HttpClient,
    private storage: Storage,
  ) { }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  public getUser(id): Observable<any> {
    return this.httpClient.get(this.env.API_URL + '/auth/user/' + id, httpOptions).pipe(
      map(this.extractData));
  }

  public register(body): Observable<any> {
    return this.httpClient.post(this.env.API_URL + '/auth/register', body).pipe(
      tap(async (res) => {
        console.log('USER: ', res.return);
        if (res) {
          await this.storage.set('ACCESS_TOKEN', res.access_token);
          await this.storage.set('EXPIRES_IN', res.expires_in);
          await this.storage.set('USER_ID', res.user_id);
          await this.storage.set('USER', res.return);
          this.authSubject.next(true);
        }
      }));
  }

  public update(body, id): Observable<any> {
    return this.httpClient.put(this.env.API_URL + '/auth/update/' + id, body, httpOptions).pipe(
      tap(async (res) => {
        console.log('USER UPDATED: ', res.message);
        console.log('Status: ', res.status);
      }));
  }

  public updateAvatar(body, id): Observable<any> {
    return this.httpClient.post(this.env.API_URL + '/auth/updateavatar/' + id, body).pipe(
      tap(async (res) => {
        // console.log('Avatar UPDATED: ', res.message);
        // console.log('Status: ', res.status);
        // console.log('Returned User: ', res.return);

        if (res.status) {
          // Get the entire data
          this.storage.get('USER').then(valueStr => {
            const value = valueStr;

            // Modify just that property
            value.avatar = res.return;

            // Save the entire data again
            this.storage.set('USER', value);
            console.log('USER FROM STORAGE: ', value);
            setTimeout(() => {
              this.authSubject.next(true);
            }, 1000);
          });
        }
      }));
  }

  public login(body): Observable<any> {
    return this.httpClient.post(this.env.API_URL + '/auth/student/login', body, httpOptions).pipe(
      tap(async (res) => {
        console.log('USER: ', res.return);
        if (res) {
          await this.storage.set('ACCESS_TOKEN', res.access_token);
          await this.storage.set('EXPIRES_IN', res.expires_in);
          await this.storage.set('USER_ID', res.user_id);
          await this.storage.set('USER', res.return);
          this.authSubject.next(true);
        }
      }));
  }

  public loginStudent(body): Observable<any> {
    console.log('Boby: ', body);

    return this.httpClient.post(this.env.API_URL + '/auth/student/login', body, httpOptions).pipe(
      tap(async (res) => {
        console.log('USER: ', res.return);
        if (res) {
          // await this.storage.set('ACCESS_TOKEN', res.access_token);
          // await this.storage.set('EXPIRES_IN', res.expires_in);
          await this.storage.set('STUDENT_ID', res.id);
          await this.storage.set('STUDENT', res.return);
          await this.storage.set('TYPE', res.type);
          this.authSubject.next(true);
        }
      }));
  }

  public loginExplainer(body): Observable<any> {
    console.log('Boby: ', body);

    return this.httpClient.post(this.env.API_URL + '/auth/explainer/login', body, httpOptions).pipe(
      tap(async (res) => {
        console.log('USER: ', res.return);
        if (res) {
          // await this.storage.set('ACCESS_TOKEN', res.access_token);
          // await this.storage.set('EXPIRES_IN', res.expires_in);
          await this.storage.set('STUDENT_ID', res.id);
          await this.storage.set('STUDENT', res.return);
          await this.storage.set('TYPE', res.type);
          this.authSubject.next(true);
          this.isExplainer.next(true);
        }
      }));
  }

  public getBadges(id): Observable<any> {
    return this.httpClient.get(this.env.API_URL + '/products/count/' + id, httpOptions).pipe(
      map(this.extractData));
  }

  async logoutStudent() {
    await this.storage.remove('STUDENT_ID');
    await this.storage.remove('STUDENT');

    this.authSubject.next(false);
  }

  async logoutExplainer() {
    await this.storage.remove('EXPLAINER_ID');
    await this.storage.remove('EXPLAINER');

    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
