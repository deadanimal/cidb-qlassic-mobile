import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { ProjectDetailService } from 'src/app/services/project-detail.service';
import { AuthService } from 'src/app/services/auth.service';
import SignaturePad from 'signature_pad';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit,AfterViewInit {

  @Input() formData: FormData;
  @ViewChild("agreement") agreement: ElementRef;
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;
  signatureConfirmValue:any;
  dateSign: string;
  completeText: string;
  today: any;

  constructor(
    public modalCtrl: ModalController,
    private storage: NativeStorage,
    private router: Router,
    private alertService:AlertService,
    private project: ProjectDetailService,
    private api:ApiService,
    private authService: AuthService,
    private navCtrl: NavController,
    private platform: Platform,
    private elementRef: ElementRef,
    public datepipe: DatePipe
    ) { }

  async ngOnInit() {
    
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';

    await this.storage.getItem("projectId").then(data=>{
      this.api.getAgreement(data).subscribe(
        agrmnt=>{
          this.completeText = agrmnt.agreement
          this.agreement.nativeElement.innerHTML = decodeURI(this.completeText);
        }
      );
    });
  }

  ionViewWillEnter() {    
    this.platform.ready().then((readySource) => {

      if(this.platform.width() <= 576 ){
        this.resizeCanvas(this.platform.width()*0.7,this.platform.height()*0.3)
      }else if(this.platform.width() > 576 && this.platform.width() < 768 ){
        this.resizeCanvas(this.platform.width()*0.7,this.platform.height()*0.5)
      }else{
        this.resizeCanvas(500,300)
      }
      
    });
    
    this.today =this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.today)
  }

  ngAfterViewInit(){    
    this.signaturePad.clear();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if(event.target.innerWidth <= 576 ){
      this.resizeCanvas(event.target.innerWidth*0.7,event.target.innerHeight*0.3)
    }else if(event.target.innerWidth > 576 && event.target.innerWidth < 768 ){
      this.resizeCanvas(event.target.innerWidth*0.7,event.target.innerHeight*0.5)
    }else{
      this.resizeCanvas(500,300)
    }
    
  }

  resizeCanvas(w,h){
    this.elementRef.nativeElement.querySelector('canvas').width = w;
    this.elementRef.nativeElement.querySelector('canvas').height = h;
  }

  dismissModal() {  
    this.modalCtrl.dismiss();  
  }

  clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  async saveCompletionConfirmation(dateSignComplete){
    
    this.signatureConfirmValue = this.signaturePad.toDataURL();
    this.dateSign = dateSignComplete;
    await this.alertService.confirmToComplete("Submit Completion", "Once you submit, you cannot edit or view this project. Do you want to proceed?",(data)=>this.submitFunction(data));

  }

  async submitFunction(bool){
    if(bool == true){
      await this.alertService.startLoading("Please wait...");
      await this.storage.getItem("projectId").then(data=>{
        this.formData.append('projectID',data);
        this.formData.append('dateSigned',this.dateSign);
        this.formData.append('signature',this.signatureConfirmValue);
      });
      this.api.completeTask(this.formData).subscribe(
        data=>{
          this.alertService.stopLoading();
          console.log("data completeTask ConfirmationPage", data);
          if(data.result == "true"){
            console.log("data.result", data.result);
            this.alertService.promptUser("Complete","You have completed the task",(button)=>{
              if(button == true){
                this.logout();
              }
            },this);
            // this.alertService.alertStatus("Complete","You have completed the task");
            this.getAllLocal(data.projectId);
          } else if (data.result == "false"){
            console.log("data.result", data.result);
            this.alertService.alertStatus("Error",data.message);
          }/*else{
            this.alertService.alertStatus("Error","Some error occurs, please try again");
          }*/
        },
        error=>{
          this.alertService.stopLoading();
          // this.alertService.alertStatus("Error","Some error occurs, please try again, please make sure you are connected to the internet: "+ error);
          this.alertService.alertStatus("Error","Some error occurs, please try again");
        }
      );
      // await this.alertService.stopLoading();
      // this.modalCtrl.dismiss();

      // this.authService.logout().subscribe(
      //   data => {
      //     this.alertService.presentToast("Project Completed!! System auto logged out");        
      //   },
      //   error => {
      //     console.log(error);
      //   },
      //   () => {
      //     this.navCtrl.navigateRoot('login');
      //   }
      // );

    }else if(bool == false){
      this.modalCtrl.dismiss();  
      this.router.navigateByUrl('app/tab/dashboard');
    }
  }

  logout() {
    this.modalCtrl.dismiss();

    this.authService.logout().subscribe(
      data => {
        this.alertService.presentToast("Project Completed!! System auto logged out");        
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('login');
      }
    );
  }

  async getAllLocal(projectId){
    await this.storage.keys().then((d)=>{
      for(let i=0; i<d.length ; i++){
        if(d[i].includes(projectId)){
          this.storage.remove(d[i]);
        }
      }
      console.log('init project detail')
      this.project.initProjectDetail();
    },(e)=>{
      console.log('getting err',e);
    })
  }

}
