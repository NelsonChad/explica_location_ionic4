import { Component, Inject } from '@angular/core';
import { Platform, LoadingController, AlertController, MenuController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable, BehaviorSubject } from "rxjs"; // First you need to import Observable
import { Router } from '@angular/router';
import { PlacesService } from '../services/places.service';
import { LocationsModalPage } from '../locations-modal/locations-modal.page';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  selectedLoc: any;

  map: any;
  marker: any;
  latitude: any = "";
  longitude: any = "";
  timestemp: any;
  id: any;
  cordinates: any;
  public places: any;
  public distance: any = 0;
  public gps: any;
  f = false;

  public selectRoute = false;
  public tracking = true;
  placeID = new BehaviorSubject(0);
  latlng = new BehaviorSubject(0);

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  watch = this.geolocation.watchPosition({ enableHighAccuracy: true });
  idWatch: any;


  constructor(
    private platform: Platform,
    private router: Router,
    @Inject(Geolocation) private geolocation: Geolocation,
    public placesService: PlacesService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private menu: MenuController,
    private modalController: ModalController
  ) {
    this.initMap();
  }

  /**
   * Pega a localizacao para o mapa
   */
  GetLocation() {

    var ref = this;
    this.tracking = true;

    let infowindowUser = new google.maps.InfoWindow({ width: '200px', height: '50px' });

    this.idWatch = this.watch.subscribe((position) => {

      console.log('Position NOWW: ', position.coords.longitude, ',', position.coords.latitude);

      /*this.gps = new google.maps.LatLng(
        -25.880188, 32.613484
      );*/

      if (this.latlng.value != 0) {
        console.log('Tracking...');
        this.setRoute();
      }


      this.gps = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude
      );

      console.log('GPS: ', this.gps);
      // -----------------------------------------------------------------------------
      /**
       * Marker da posicao do utilizador
       */
      if (this.marker == null) {
        ref.marker = new google.maps.Marker({
          position: this.gps,
          map: ref.map,
          title: 'Minha Posicao',
          icon: {
            url: 'https://img.icons8.com/ultraviolet/40/000000/map-pin.png'
          },
          animation: google.maps.Animation.BOUNCE
          ,
          click: { // Evento emprestado para o outro marker
            clickElementId: 'infoWindowButton1', clickFunction1: () => {

            }
          }
        });

        // Evento do Marker
        google.maps.event.addListener(ref.marker, 'click', (function (marker) {
          return function () {
            infowindowUser.setContent(`
            <div style="width:200px; display: table;
            clear: both;">
            <div style="display : inline-flex; float: left;background-color:white;width:50px;heigth:100%">
            <img src="https://img.icons8.com/ios/50/000000/user.png"/>
            </div>
            <div style="display: inline-flex;width:150px;heigth:50px;">
            <center><h5 style="margin-left:20px; text-align: center;" >Você Aqui</b></center>
            </div>
            </div>
            `);
            infowindowUser.open(ref.map, ref.marker);
          };
        })(ref.marker));

      } else {
        ref.marker.setPosition(this.gps);
      }


      ref.map.panTo(this.gps);
      ref.latitude = position.coords.latitude.toString();
      ref.longitude = position.coords.longitude.toString();
      ref.timestemp = (new Date(position.timestamp)).toString();
    },
      (err) => {
        console.log('ERRO:' + err);
      }
    );

    this.getPoints();

  }

  async getPoints() {
    var ref = this;

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'loading-loader-class'
    });
    await loading.present();

    // DATABASE

    await this.placesService.getPlaces(10)
      .subscribe(res => {
        // console.log(res.data);
        this.places = res.data;
        loading.dismiss();
        // console.log('DADOS: ', this.places);

        /**
         * Markers da posicao dos locais
         */
        var marker, i;
        console.log('Lugares DB: ', this.places);

        for (i = 0; i < this.places.length; i++) {
          var infowindow = new google.maps.InfoWindow();

          // console.log(this.places[i].name, ' LAT: ', this.places[i].lat, ' LNG: ', this.places[i].lat);

          let lat = this.places[i].lat;
          let lng = this.places[i].lng;
          let name = this.places[i].name;

          marker = new google.maps.Marker({
            position: new google.maps.LatLng(Number(lat), Number(lng)),
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
            click2: { // Add a click event to the marker
              clickElementId: 'infoWindowButton2', clickFunction: () => {
                this.setRoute();
                infowindow.close();
              }
            }
          });
          // ref.map.panTo(name, lat, lng); // passsa paramentros para o mapa e marker

          // Evento do marker
          google.maps.event.addListener(marker, 'click', (function (marker, i, places, distance, p, latlng) {
            return function () {
              // console.log(places[i].name, ' LAT: ', places[i].lat, ' LNG: ', places[i].lat);
              console.log(' PORRA: ', i);
              p.next(places[i].id); // seta o ID no bihaviorSubject
              latlng.next(places[i]);
              infowindow.setContent(`<ion-item lines="none">
                                      <ion-thumbnail slot="start">
                                        <img src="https://img.icons8.com/nolan/96/school.png">
                                      </ion-thumbnail>
                                      <ion-label>
                                        <h3>` + places[i].name + `</h3>
                                        <ion-badge color="success">`
                + places[i].min_price + `-` + places[i].max_price +
                `MT</ion-badge>
                                        <p>` + distance + `Km</p>
                                      </ion-label>
                                    </ion-item></br>
                                    <ion-button size="small" color="danger" id="infoWindowButton1">
                                    <ion-icon name="navigate-circle-outline"></ion-icon>
                                    Rota
                                    </ion-button>
                                    <ion-button size="small" id="infoWindowButton2">
                                    <ion-icon name="eye-outline"></ion-icon>
                                    Ver +
                                    </ion-button>`);
              infowindow.open(ref.map, marker);
            };
          })(marker, i, this.places, this.distance, this.placeID, this.latlng)); // passa parametros para o evento

          // Evento do infowindowUser
          infowindow.addListener('domready', () => {
            const element = document.getElementById('infoWindowButton2');
            const element2 = document.getElementById('infoWindowButton1');
            if (element) {
              element.addEventListener('click', marker.click.clickFunction);
            }
            if (element2) {
              element2.addEventListener('click', marker.click2.clickFunction); // emprestou evento do outro marker
            }
          });
        }

      }, err => {
        console.log('ERROR GETTING:: ' + err);
        loading.dismiss();
      });
  }

  /**
   * 
   * @param directionsService Direcoes
   * @param directionsDisplay 
   * @param _origin 
   * @param destin 
   */

  displayDirection(_origin, destin) {
    var ref = this;
    console.log('DIRECTION');

    // Clear past routes
    if (this.directionsDisplay != null) {
      // console.log('ENTROU NO CLEAR');
      this.directionsDisplay.setMap(null); // Limpa o mapa
      this.directionsDisplay.setPanel(null);
    }

    this.directionsDisplay.setMap(ref.map); // Seta o mapa

    this.directionsService.route({
      origin: _origin,
      destination: destin,
      travelMode: 'WALKING'
    }, (response, status) => {
      // console.log('Response R: ' + response.routes[0].legs + ' Status: ' + status);

      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        this.findRouteDistance(response.routes[0].legs);

      } else {
        console.log('Can\'t set directions due to ' + response);
      }
    });
  }

  stopTracking() {
    this.idWatch.unsubscribe();
    this.tracking = false;
    console.log('Stop Tracking...');

  }

  restartTracking() {
    this.GetLocation();
    this.tracking = true;
    console.log('Start Tracking...');

  }

  setRoute() {
    this.tracking = true;

    this.latlng.subscribe(value => {
      // console.log('Place got:', value);
      this.cordinates = value;

    });
    // console.log('ROTA: ', this.cordinates.name, ' LAT: ', this.cordinates.lat, ' LNG: ', this.cordinates.lng);
    let destin = new google.maps.LatLng(this.cordinates.lat, this.cordinates.lng);
    this.displayDirection(this.gps, destin);
    // console.log('CLICOUs');
  }

  setRouteModal(dest) {
    this.tracking = true;

    this.latlng.subscribe(value => {
      // console.log('Place got:', value);
      this.cordinates = value;

    });
    // console.log('ROTA: ', this.cordinates.name, ' LAT: ', this.cordinates.lat, ' LNG: ', this.cordinates.lng);
    let destin = new google.maps.LatLng(dest.lat, dest.lng);
    this.displayDirection(this.gps, destin);
    // console.log('CLICOUs');
  }

  findRouteDistance(legs) {
    let flag = 0;
    let chegou = false;
    let total_distance = 0;
    let total_duration = 0;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < legs.length; i++) {
      total_distance += legs[i].distance.value; // DISTANCE
      total_duration += legs[i].duration.value; // DURATION TIME

      console.warn('ITETAROT::::::::::::::::::::::::::::' + i);
      if ((legs[i].end_address == legs[i].start_address) && flag == 0) {
        console.warn('Chegou ao destino');
        chegou = true;
        flag = 1;
      }
    }

    if (chegou) {
      this.presentAlert();
    }

    console.log('DISTANCIA: ' + total_distance / 1000 + 'Km');
    console.log('DURACAO: ' + total_duration / 60 + 'Min');
    this.distance = total_distance / 1000;
    return total_distance;
  }

  /**
   * Alerta
   */
  async presentAlert() {

    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'parabens',
      message: 'Chegou ao seu destion.',
      buttons: ['OK']
    });

    if (this.f == false) {
      await alert.present();
      this.f = true;
    }

  }



  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  openDetails() {
    // Subscrive de BS to get the value and pass do id variable
    this.placeID.subscribe(value => {
      // console.log('Place ID got:', value);
      this.id = value;

    });
    this.router.navigate(['/loc-details', this.id]);
  }

  /**
   * Inicializa o mapa
   */

  initMap() {
    this.platform.ready().then(() => {
      const mapOptions = {
        // center: { lat: -25.8784532, lng: 32.6055336 },
        center: this.gps,
        zoom: 16,
        myLocationButton: true,
        myLocation: true,
        disableDefaultUI: false,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.SATTELITE
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      this.GetLocation();
    });
  }

  center(loc) {
    const position = new google.maps.LatLng(loc.lat, loc.lng);
    this.map.setCenter(position);
    this.map.setZoom(5);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: LocationsModalPage,
      componentProps: {
        locations: this.places
      },
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      console.log('CLOSED DATA: ', data);

      this.selectedLoc = data.data.data;

      this.setRouteModal(data.data.data)
      this.center(data.data.data)
    });
    return await modal.present();

  }
}
