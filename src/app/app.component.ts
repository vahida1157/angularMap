import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Style } from 'ol/style';
import View from 'ol/View';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  map?: Map;
  @ViewChild('popup') popp?: ElementRef;

  ngAfterViewInit(): void {
    const element = this.popp?.nativeElement;
    const popup = new Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false
    })
    this.map!.addOverlay(popup)
    this.map!.on('click', (e) => {
      console.log(e.coordinate);

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
          animation: false,
          content: feature.get('name')
        });
        // @ts-ignore
        $(element).popover('show');
      }
    })
  }
  ngOnInit(): void {

    var feature = new Feature({
      geometry: new Point(fromLonLat([51.33767203120139, 35.69984125123995])),
      name: 'Marker'
    });

    feature.setStyle(this.markerStyle);
    var layer = new VectorLayer({
      source: new VectorSource({
        features: [
          feature
        ]
      })
    });

    const tileLayer = new TileLayer({
      source: new OSM(),
    })

    this.map = new Map({
      layers: [tileLayer, layer],
      view: new View({
        center: fromLonLat([51.33767203120139, 35.69984125123995]),
        zoom: 17,
      })
    });


  }

  private markerStyle() {
    return new Style({
      image: new Circle({
        radius: 50,
        fill: new Fill({
          color: 'rgba(255,0,0,0.4)'
        })
      })
    })
  }
}
