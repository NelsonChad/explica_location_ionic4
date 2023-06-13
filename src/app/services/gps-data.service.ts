import { Injectable, Inject } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GpsDataService {

  getPosition = this.geolocation.getCurrentPosition();
  addressDetails = new BehaviorSubject(0);
  public address: any;

  constructor(
    @Inject(Geolocation) private geolocation: Geolocation,
    public alertController: AlertController

  ) { }

  public getLocation(): any {
    return;
  }

  getCoordsCityName(latlng) {
    new google.maps.Geocoder().geocode({ 'latLng': latlng }, (results, status) => {

      if (status == google.maps.GeocoderStatus.OK) {

        if (results[1]) {
          let country = null, countryCode = null, city = null, cityAlt = null, administrativArea = null;
          let c, lc, component;

          for (let r = 0, rl = results.length; r < rl; r += 1) {
            let result = results[r];
            if (!city && result.types[0] === 'locality') {
              for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];
                if (component.types[0] === 'locality') {
                  city = component.long_name;
                  break;
                }
              }
            } else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
              for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];
                if (component.types[0] === 'administrative_area_level_1') {
                  cityAlt = component.long_name;
                  break;
                }
              }
            } else if (!country && result.types[0] === 'country') {
              country = result.address_components[0].long_name;
              administrativArea = result.address_components[0].administrative_area_level_1;
              countryCode = result.address_components[0].short_name;
            }
            if (city && country) {
              break;
            }
          }

          this.address = 'Localização: ' + country + ', ' + city + ', ' + countryCode;
          console.log('ADDRESS Details: ' + this.address);

        }
      }
    }
    );
    console.log('ADDRESS Details FORA: ' + this.address);

    return this.address;

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Messagem!',
      message: 'Ainda tendando obter a sua localização,' +
        'verifique se o GPS do seu celular está ligado e se permitiu nas definições!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  public getCity(): any {

  }


}
