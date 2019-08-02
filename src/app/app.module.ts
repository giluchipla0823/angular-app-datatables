import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

// Modules ngx-boostrap
import { ModalModule } from 'ngx-bootstrap/modal';

import { Select2Module } from 'ng2-select2';

import { AppComponent } from './app.component';
import { ZeroConfigComponent } from './components/zero-config/zero-config.component';
import { WithAjaxComponent } from './components/with-ajax/with-ajax.component';
import { RenderNewColumnsComponent } from './components/render-new-columns/render-new-columns.component';
import { InitViewChildComponent } from './components/init-view-child/init-view-child.component';
import { BooksComponent } from './components/books/books.component';
import { BooksModalComponent } from './components/books/books-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ZeroConfigComponent,
    WithAjaxComponent,
    RenderNewColumnsComponent,
    InitViewChildComponent,
    BooksComponent,
    BooksModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    Select2Module
  ],
  exports: [ModalModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
