import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  URL_BOOKS:string = `http://127.0.0.1:8000/api/books`;

  constructor(private _http: HttpClient) {
  	
  }

  getBooks(){
  	return this._http.get(this.URL_BOOKS);
  }

  deleteBook(id: number){
  	const url = `${ this.URL_BOOKS }/${ id }`;

  	return this._http.delete(url);
  }
}
