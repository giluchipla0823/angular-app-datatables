import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Select2Helper from '../../helpers/select2.helper';

@Component({
  selector: 'app-books-modal',
  templateUrl: './books-modal.component.html',
  styles: []
})
export class BooksModalComponent implements OnInit {

  @Input('modal') modal: any;
  @Input('authors') authors: any[];
  @Input('publishers') publishers: any[];
  @ViewChild('selectAuthors') selectAuthors: any;
  @ViewChild('selectPublishers') selectPublishers: any;

  options: Select2Options;

  bookForm: FormGroup;
  submitted:boolean = false;

  private _select2Helper: any = Select2Helper();

  form: any = {
    data: {}
  };

  constructor(private formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.form.data = this.modal.content.data;

    this.bookForm = this.formBuilder.group({
  		title: ['', Validators.required],
  		description: ['', Validators.required],
  		author_id: ['', Validators.required],
  		publisher_id: ['', Validators.required]
  	});

    this.configSelect2();
  }

  configSelect2(): void{
    const authorId: number = this.form.data.authorId;
    const publisherId: number = this.form.data.publisherId;

    if(authorId){
      this.form.data.author_id = authorId;
      this.bookForm.controls['author_id'].setValue(authorId);

      this.authors = this.authors.map(author => {
        author.selected = author.id === authorId;

        return author;
      })
    }

    if(publisherId){
      this.form.data.publisher_id = publisherId;
      this.bookForm.controls['publisher_id'].setValue(publisherId);

      this.publishers = this.publishers.map(publisher => {
        publisher.selected = publisher.id === publisherId

        return publisher;
      })
    }

    this.options = this._select2Helper.getDefaultOptions();

    setTimeout(() => {        
        this._select2Helper.setAttributesToValidate(this.selectAuthors.element, 'author_id');
        this._select2Helper.setAttributesToValidate(this.selectPublishers.element, 'publisher_id');
    }, 0);
  }

  // convenience getter for easy access to form fields
  get formControls(): any { return this.bookForm.controls; }

  cancel(): void{
    this.modal.hide();
  }

  accept(): void{

  	this.submitted = true;

    console.log('accept', this.bookForm.controls);
  }

  clear(): void{
    const select2Elements = [
      {
        element: this.selectAuthors.element,
        field: 'author_id'
      },
      {
        element: this.selectPublishers.element,
        field: 'publisher_id'
      }
    ];

    select2Elements.forEach((item) => {
      item.element.val(null).trigger('change');

      this.eventChangeSelect({
        value: null,
        data: []
      }, item.field);
    })

    this.bookForm.reset();
  	this.submitted = false;
  }

  eventChangeSelect(e: any, field: string): void {
    const value = e.value;
    const control = this.bookForm.controls[field];
    
    delete this.form.data[field];
    
    control.setValue('');
    
    if(value){
      this.form.data[field] = value;
      control.markAsDirty();
      control.setValue(value);
    }
  }
}