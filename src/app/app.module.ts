import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { ZeroConfigComponent } from './components/zero-config/zero-config.component';
import { WithAjaxComponent } from './components/with-ajax/with-ajax.component';
import { RenderNewColumnsComponent } from './components/render-new-columns/render-new-columns.component';

@NgModule({
  declarations: [
    AppComponent,
    ZeroConfigComponent,
    WithAjaxComponent,
    RenderNewColumnsComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }