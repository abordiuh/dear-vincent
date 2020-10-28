import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MainCanvasComponent } from './main-canvas/main-canvas.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'draw', component: MainCanvasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
