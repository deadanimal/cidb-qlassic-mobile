import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx/';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
// import { Capacitor } from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private geolocation: Geolocation,
    // private locationAccuracy: LocationAccuracy
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

  // async enableLocation(){
  //   try {
  //     const canRequest: boolean = await this.locationAccuracy.canRequest();
  //     console.log('canrequest:', canRequest);
  //     if(canRequest){
  //       await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
  //       console.log('request successful');
  //       return true;
  //     }
  //     return false;
  //   }catch(e){
  //     console.log(e);
  //     throw(e)
  //   }
  // }
}
