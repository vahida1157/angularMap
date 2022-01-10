import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map.component';


@NgModule({
  exports:[
    MapComponent
  ],
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MapModule { }
