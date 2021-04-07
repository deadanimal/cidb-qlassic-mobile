import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit, AfterViewInit  {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;

  constructor(
    public modalCtrl: ModalController,
    private elementRef: ElementRef,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';
  }

  ionViewWillEnter() {    
    this.platform.ready().then((readySource) => {

      if(this.platform.width() < 768 ){
        this.resizeCanvas(this.platform.width()*0.8,this.platform.height()*0.75)
      }else{
        this.resizeCanvas(590,420)
      }
      
    });
  }

  ngAfterViewInit(){
    this.signaturePad.clear();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if(event.target.innerWidth < 768 ){
      this.resizeCanvas(event.target.innerWidth*0.8,event.target.innerHeight*0.75)
    }else{
      this.resizeCanvas(590,510)
    }
    
  }

  resizeCanvas(w,h){
    this.elementRef.nativeElement.querySelector('canvas').width = w;
    this.elementRef.nativeElement.querySelector('canvas').height = h;
  }

  dismissModal() {  
    const img = this.signaturePad.toDataURL();
    this.modalCtrl.dismiss(img);  
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

}