import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertService } from 'src/app/services/alert.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage implements OnInit {

  documents: any;
  projectId: any;

  connection: string;

  constructor(
    private storage: NativeStorage,
    private downloader: Downloader,
    private file:File,
    private alert:AlertService,
    private fileOpener: FileOpener,
    private api:ApiService,
    ) {}

  ngOnInit() {
    
  }
  
  ionViewWillEnter() {
    this.initializeData();
  }

  async initializeData(){

    await this.storage.getItem("projectId").then(
      data=>{
        this.projectId = data;
      }
    );

    await this.storage.getItem(this.projectId+'_documents').then(
      data =>{
        this.documents = data;
      },
      error => console.error(error)
    );

  }

  async download(url, id, name) {
    await this.alert.startLoading('Downloading file(s)')
    var request: DownloadRequest = {
      uri: url,
      title: name,
      description: 'Task Document Dowload on ' + Date.now(),
      mimeType: 'application/pdf',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationUri:this.file.externalDataDirectory+'/Download/'+name+'.pdf'
    };

    console.log(this.file.externalDataDirectory+'/Download/'+name+'.pdf')

    this.api.isServerConnected()
        .subscribe(
          data => {    
            if(data.status == 'OK'){ 
              this.downloader.download(request)
                .then(
                  async (location: string) => {
                    this.documents[id].status = 'Downloaded';
                    this.storage.remove(this.projectId+'_documents');
                    this.storage.setItem(this.projectId+'_documents', this.documents);
                    await this.alert.stopLoading()
                  })
                .catch(
                  async (error: any) => {
                    console.error('error',error)
                    this.documents[id].status = 'Failed';
                    this.storage.remove(this.projectId+'_documents');
                    this.storage.setItem(this.projectId+'_documents', this.documents);
                    await this.alert.stopLoading();
                  });
            }else{
              this.documents[id].status = 'Failed';
              this.storage.remove(this.projectId+'_documents');
              this.storage.setItem(this.projectId+'_documents', this.documents);
              this.alert.stopLoading();
              this.alert.alertStatus("Warning", 'You need internet connection to download document.')
            }
          },
          error => {
            this.documents[id].status = 'Failed';
            this.storage.remove(this.projectId+'_documents');
            this.storage.setItem(this.projectId+'_documents', this.documents);
            this.alert.stopLoading();
            this.alert.alertStatus("Warning", 'You need internet connection to download document.')
          }
        )

  }

  async openPdf(name){
    console.log('/Download/'+name+'.pdf')
    this.fileOpener.open(this.file.externalDataDirectory+'/Download/'+name+'.pdf', 'application/pdf')
      .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
  }

}
