import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  public name:string;
  public email:string;
  public id:string;
  public role:string;

  constructor() { }
}
