import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    ) { }

    getWorkTask() {
      return this.http.get('../../assets/request_1.json');
    }
}
