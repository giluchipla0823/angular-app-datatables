import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private _http: HttpClient) {
  	
  }

  getAuthors(){
  	const url = 'http://127.0.0.1:8000/api/authors';

  	return this._http.get(url);
  }
}
