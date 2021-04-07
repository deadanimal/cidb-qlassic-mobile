import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-first-design',
  templateUrl: './task-first-design.page.html',
  styleUrls: ['./task-first-design.page.scss'],
})
export class TaskFirstDesignPage implements OnInit {

  @Input() category: string;
  tasks:any;

  constructor(
    public modalCtrl: ModalController,
    private storage: NativeStorage,
    private router: Router
    ) { }

  ngOnInit() {
    this.initializeData();
  }
  
  initializeData(){

    this.storage.getItem('tasks').then(
      data =>{
        let i = 0; let index = -1;
        while(i < data.length){
          if(data[i].category == this.category){
            index = i;
          }
          i++;
        }
        this.tasks = data[index].items;
      },
      error => console.error(error)
    );

  }

  dismissModal() {  
    this.modalCtrl.dismiss();  
  }

  chooseByTopic(topic, type){
    let i = 0; let index = -1;
    while(i < this.tasks.length){
      if(this.tasks[i].topic == topic){
        index = i;
      }
      i++;
    }
    let data = this.tasks[index];
    if(type == '3'){
      this.storage.setItem('temporary', data);
      this.modalCtrl.dismiss();  
      this.router.navigate(['/app/tab/task-third-design']);
    }else if(type == '2'){
      this.storage.setItem('temporary', data);
      this.modalCtrl.dismiss();  
      this.router.navigate(['/app/tab/task-second-design']);
    }else if(type == '4'){
      this.storage.setItem('temporary', data);
      this.modalCtrl.dismiss();  
      this.router.navigate(['/app/tab/task-fourth-design']);
    }
  }

}
