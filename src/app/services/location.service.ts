import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private geolocation: Geolocation
  ) { }

  getLocation(){
    return this.geolocation.getCurrentPosition({enableHighAccuracy: true,maximumAge: 30000,timeout: 27000}).then(
      (resp) => {
        let _reply = "("+resp.coords.latitude+","+resp.coords.longitude+")";
        return _reply;
      }).catch((error) => {
        console.log('Error getting location', error);
        return "(0,0)";
      });      
  }
}
