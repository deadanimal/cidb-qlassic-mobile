import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // API_URL = 'http://localhost:8080/api/v1';
  API_URL = 'https://qlassic.cidb.gov.my/api/v1';
  // API_URL = 'https://qlassic.cidb.gov.my/api/v1';
  // API_URL = 'http://test.caravel.space/testapi_new.php';
  // API_URL = 'http://test.caravel.space/testapi.php';
  //API_URL = 'http://127.0.0.1:8000/api/v1';
  constructor() { }
}
