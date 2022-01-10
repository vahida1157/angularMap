import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: Map;

  constructor() {
    this.map = new Map({
      target: 'map'
    });
   }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0.0],
        zoom: 1
      })
    });
  }
}
