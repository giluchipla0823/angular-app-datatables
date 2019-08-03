import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublishersService {

  constructor(private _http: HttpClient) {
  	
  }

  getPublishers(){
  	const url = 'http://127.0.0.1:8000/api/publishers';

  	return this._http.get(url);
  }
}
