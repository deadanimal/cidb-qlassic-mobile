import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import {ApiService} from 'src/app/services/api.service';
import {ProjectDetailService} from 'src/app/services/project-detail.service';
import {UserDetailService} from 'src/app/services/user-detail.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token:any;

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
    private api: ApiService,
    private projectDetail: ProjectDetailService,
    private userDetail: UserDetailService,
  ) { }

  login(email: string, password: string) {
    let formData = new FormData();
    formData.append('email',email);
    formData.append('password',password);
    return this.api.login(formData).pipe(
      tap(data=>{
        console.log('lg', data)
        if(data.status == "success"){
            this.token = data.token;
            this.storage.setItem('token', this.token)
            this.isLoggedIn = true;
            this.projectDetail.projectList = data.project;
            this.userDetail.name = data.name;
            this.userDetail.id = data.nric;
            this.userDetail.email = data.email;
            this.userDetail.role = data.role;
            this.storage.setItem('token', this.token)
            if (this.projectDetail.projectList) {
              this.projectDetail.initProjectDetail();
            }
            this.storage.setItem('isLoggedIn',data);
        }
      },
      error=>{}
      )
    );
  }

  continue(){
    return this.storage.getItem('isLoggedIn').then(
    data=>{
      this.token = data.token;
      this.storage.setItem('token', this.token)
      this.isLoggedIn = true;
      this.projectDetail.projectList = data.project;
      this.userDetail.name = data.name;
      this.userDetail.id = data.nric;
      this.userDetail.email = data.email;
      this.userDetail.role = data.role;
      this.storage.setItem('token', this.token)
      this.projectDetail.initProjectDetail();
      return true;
    },err=>{
      return false;
    });
  }

  logout() {
    this.storage.remove('isLoggedIn');
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get('../../assets/token.json')
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    )
  }

  user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>('../../assets/user.json')
    .pipe(
      tap(user => {
        return user;
      })
    )
  }

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }

}
