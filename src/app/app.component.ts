import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Icon, Style } from 'ol/style';
import View from 'ol/View';
import data from 'src/assets/template.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  map?: Map;
  details?: Place[];
  zoom: number = 16;
  @ViewChild('popup') popp?: ElementRef;
  @ViewChild('list') list?: ElementRef;

  ngAfterViewInit(): void {
    this.addDescriptionPopover();
  }

  private clearMarkerLayer() {
    this.map?.getLayers().getArray()
      .filter(layer => layer.getClassName() === 'marker')
      .forEach(layer => this.map?.removeLayer(layer));
  }

  private addDescriptionPopover() {
    const element = this.popp?.nativeElement;
    const popup = new Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false
    });
    this.map!.addOverlay(popup);
    this.map!.on('click', (e) => {
      const feature = this.map!.forEachFeatureAtPixel(e.pixel, function (feature: any) {
        return feature;
      });
      // @ts-ignore
      $(element).popover('dispose');
      if (feature) {
        popup.setPosition(e.coordinate);
        // @ts-ignore
        $(element).popover({
          placement: 'top',
          html: true,
          animation: true,
          content: '<div class="my-popover" dir="rtl">' +
            '<h3 style="text-align: center;">' + feature.get('detail').name + '</h3>' +
            '<p>شهر : <span>' + feature.get('detail').city + '</span></p>' +
            '<p>توضیحات : <span>' + feature.get('detail').description + '</span></p>' +
            '</div>',
        });
        // @ts-ignore
        $(element).popover('show');
      }
    });

    this.map!.on('pointerdrag', (e) => {
      // @ts-ignore
      $(element).popover('dispose');
    });
  }

  ngOnInit(): void {
    this.details = data;

    const tileLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      layers: [tileLayer],
      view: new View({
        center: fromLonLat([51.33767203120139, 35.69984125123995]),
        zoom: this.zoom,
      })
    });

  }

  onClick(detail: Place) {
    // @ts-ignore
    $(this.popp?.nativeElement).popover('dispose');
    const longitude = parseFloat(detail.longitude);
    const latitude = parseFloat(detail.latitude);

    this.clearMarkerLayer();

    this.map?.setView(new View({
      center: fromLonLat([longitude, latitude]),
      zoom: this.zoom,
    }));


    this.addMarkerLayer(longitude, latitude, detail);
  }

  private addMarkerLayer(longitude: number, latitude: number, detail: Place) {
    var feature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      name: 'Marker',
      detail: detail
    });
    feature.setStyle(this.markerStyle);

    var layer = new VectorLayer({
      source: new VectorSource({
        features: [
          feature
        ]
      }),
      className: 'marker'
    });
    this.map?.addLayer(layer);
  }

  private markerStyle() {
    return new Style({
      image: new Circle({
        radius: 50,
        fill: new Fill({
          color: 'rgba(255,0,0,0.4)'
        })
      }),
      // image: new Icon({
      //   src: 'src/assets/markerMapIcon.png',
      //   scale: [0,0]
      // })
    })
  }
}

class Place {
  name: string;
  city: string;
  description: string;
  latitude: string;
  longitude: string;
  constructor(name: string, city: string, description: string, latitude: string, longitude: string) {
    this.name = name;
    this.city = city;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
