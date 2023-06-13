import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //API_URL = 'http://localhost/explica/public/api';
  //API_URL = 'http://soquelasports.com/explica/api';
  API_URL = 'http://explicador.soquelasports.com/public/api';

  constructor() { }
}
