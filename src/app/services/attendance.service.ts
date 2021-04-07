import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(
    private storage:NativeStorage
  ) { }

  save(projectId:string, date:string, applctnNo:string,attendance:attendance){
    return this.storage.setItem(projectId+"_attendance",{'date':date,'appNo':applctnNo,'att':attendance})
    .then(
      data=>{return true}
    )
  }

  get(projectId:string){
    return this.storage.getItem(projectId+"_attendance")
    .then(
      data=>{return data},
      error=>{return console.log('error',error)}
    )
  }
}

export interface attendance{
  name:string,
  position:string,
  company:string,
  contact:string,
  signature:string
}