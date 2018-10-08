import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CanvasFuncComponent } from './canvas-func/canvas-func.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasFuncComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
