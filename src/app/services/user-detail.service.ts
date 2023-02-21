import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  public name:string;
  public email:string;
  public id:string;
  public role:string;

  constructor() { }

  async getUserLocation(){

  return  Geolocation.getCurrentPosition();
  

  }
}
