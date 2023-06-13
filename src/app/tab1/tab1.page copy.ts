import { Component, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from "rxjs"; // First you need to import Observable
import { Router } from '@angular/router';
import { PlacesService } from '../services/places.service';

declare var google: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  map: any;
  marker: any;
  latitude: any = "";
  longitude: any = "";
  timestemp: any;

  public places: any;

  constructor(
    private platform: Platform,
    private router: Router,
    @Inject(Geolocation) private geolocation: Geolocation,
    public placesService: PlacesService) {
    this.initMap();
  }

  /**
   * Pega a localizacao para o mapa
   */
  GetLocation() {
    this.getPoints();

    var ref = this;
    let watch = this.geolocation.watchPosition();

    var infowindowUser = new google.maps.InfoWindow();

    watch.subscribe((position) => {

      console.log('Position: ', position.coords.longitude, ',', position.coords.latitude);

      var gps = new google.maps.LatLng(
        -25.880188, 32.613484
      );

      /*var gps = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude
      );*/

      console.log('GPS: ', gps);
      // -----------------------------------------------------------------------------
      /**
       * Marker da posicao do utilizador
       */
      if (this.marker == null) {
        ref.marker = new google.maps.Marker({
          position: gps,
          map: ref.map,
          title: 'Minha Posicao',
          icon: {
            url: "https://img.icons8.com/ultraviolet/40/000000/map-pin.png"
          },
          animation: google.maps.Animation.BOUNCE
          ,
          click: { // Evento emprestado para o outro marker
            clickElementId: 'infoWindowButton1', clickFunction1: () => {
              this.teste();
            }
          }
        });

        // Evento do Marker
        google.maps.event.addListener(ref.marker, 'click', (function (marker) {
          return function () {
            infowindowUser.setContent(`<b>Voce Aqui</b>`);
            infowindowUser.open(ref.map, ref.marker);
          };
        })(ref.marker));

      } else {
        ref.marker.setPosition(gps);
      }

      ref.map.panTo(gps);
      ref.latitude = position.coords.latitude.toString();
      ref.longitude = position.coords.longitude.toString();
      ref.timestemp = (new Date(position.timestamp)).toString();
    })
  }

  async getPoints() {
    var ref = this;

    // DATABASE

    await this.placesService.getPlaces(10)
      .subscribe(res => {
        console.log(res.data);
        this.places = res.data;
        console.log('DADOS: ', this.places);
      }, err => {
        console.log('ERROR GETTING:: ' + err);
      });


    // -----------------------------------------------------------------------------
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // array de locais exemplo
    var locations = [
      ['Bondi Beach', -25.878530, 32.610941, 4],
      ['Coogee Beach', -25.877739, 32.614267, 5],
      ['Cronulla Beach', -25.876191, 32.611000, 3],
      ['Ibiza Bar', -25.883849, 32.611369, 2],
      ['Maroubra Beach', -25.873724, 32.611305, 1]
    ];
    var gps = new google.maps.LatLng(
      -25.880188, 32.613484
    );
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    let destin = new google.maps.LatLng(locations[1][1], locations[1][2]);
    this.displayDirection(directionsService, directionsDisplay, gps, destin);
    /**
     * Tela de detalhes
     */
    // var infowindow = new google.maps.InfoWindow(); Original

    var infowindow = new google.maps.InfoWindow({
      /*content: '<center><img src="https://img.icons8.com/nolan/96/school.png" height="42" width="42"></center>'+
      '</br><label>Britness School</label>'+
      '</br><ion-button>Ver</ion-button>'
      });*/
      content: `<ion-item lines="none">
                 <ion-thumbnail slot="start">
                   <img src="https://img.icons8.com/nolan/96/school.png">
                 </ion-thumbnail>
                 <ion-label>
                   <h3>Britness School</h3>
                   <ion-badge color="success">100-1000MT</ion-badge>
                   <p>+1km</p>
                 </ion-label>
               </ion-item></br>
               <ion-button size="small" color="danger" id="infoWindowButton1">
               <ion-icon name="navigate-circle-outline"></ion-icon>
               Rota
               </ion-button>
               <ion-button size="small" id="infoWindowButton2">
               <ion-icon name="eye-outline"></ion-icon>
               Ver +
               </ion-button>`
    });

    /**
     * Markers da posicao dos locais
     */
    var marker, i;

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: ref.map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        },
        animation: google.maps.Animation.DROP,
        click: { // Add a click event to the marker
          clickElementId: 'infoWindowButton2', clickFunction: () => {
            this.openDetails();
          }
        },
        clickR: { // Evento emprestado para o outro marker
          clickElementId2: 'infoWindowButton1', clickFunction1: () => {
            this.teste();
          }
        }
      });

      // Evento do marker
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.open(ref.map, marker);
        }
      })(marker, i));

      // Evento do infowindowUser
      infowindow.addListener('domready', () => {
        const element = document.getElementById('infoWindowButton2');
        const element2 = document.getElementById('infoWindowButton1');
        if (element) {
          // console.log('ELEMENTO: ', element)
          element.addEventListener('click', marker.click.clickFunction);
        }
        if (element2) {
          console.log('ROTA');
          element.addEventListener('click', ref.marker.click.clickFunction1);// emprestou evento do outro marker
        }
      });
    }
  }

  /**
   * Direcoes
  */
  // tslint:disable-next-line: variable-name
  displayDirection(directionsService, directionsDisplay, _origin, destin) {
    console.log('DIRECTION');
    directionsService.route({
      origin: _origin,
      destination: destin,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

  teste() {
    console.log('CLICOUs');
  }

  openDetails() {
    this.router.navigate(['/loc-details']);
  }

  /**
   * Inicializa o mapa
   */
  initMap() {
    this.platform.ready().then(() => {
      let mapOptions = {
        center: { lat: -25.8784532, lng: 32.6055336 },
        zoom: 16,
        myLocationButton: true,
        myLocation: true,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.HIBRID
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      this.GetLocation();
    });
  }
}
