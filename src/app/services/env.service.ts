import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // API_URL = 'http://localhost:8080/api/v1';
  // API_URL = 'https://qlassicstg.cidb.gov.my/api/v1';
  API_URL = 'https://qlassic.cidb.gov.my/api/v1';
  // API_URL = 'http://test.caravel.space/testapi_new.php';
  // API_URL = 'http://test.caravel.space/testapi.php';
  constructor() { }
}
