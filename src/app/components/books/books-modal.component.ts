import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'app-books-modal',
  templateUrl: './books-modal.component.html',
  styles: []
})
export class BooksModalComponent implements OnInit {

  @Input('modal') modal: any;
  @Input('authors') authors: any[];

  public options: Select2Options;

  bookForm: FormGroup;
  submitted:boolean = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
  	this.options = {
      theme: 'bootstrap',
      placeholder: 'Seleccionar',
      allowClear: true,
      width: '100%',
      language: "es"
    }


	this.bookForm = this.formBuilder.group({
		title: ['', Validators.required],
		description: ['', Validators.required],
	});
  }

  // convenience getter for easy access to form fields
  get form(): any { return this.bookForm.controls; }

  cancel(): void{
    this.modal.hide();
  }

  accept(): void{

  	this.submitted = true;
    // console.log('Aceptando...', this.modal.content.data);
    console.log('invalid...', this.bookForm.invalid);
    console.log('submitted...', this.bookForm.submitted);
  }

  clear(): void{
  	this.bookForm.reset();
  	this.submitted = false;
  }

  eventChangeAuthor(e: any): void {

  	console.log('modal eventChangeAuthor', e);

    const value = e.value;
    
    delete this.modal.content.data.author_id;

    if(value){
      this.modal.content.data.author_id = value;
    }
  }
}