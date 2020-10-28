import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MainCanvasComponent } from './main-canvas/main-canvas.component';
import { HelpAndExamplesPopupComponent } from './help-and-examples-popup/help-and-examples-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MainCanvasComponent,
    HelpAndExamplesPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
