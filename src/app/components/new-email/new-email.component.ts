import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import Swal from "sweetalert2";
import {MailService} from "../../services/mail.service";
declare let $: any;

@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.css']
})
export class NewEmailComponent implements OnInit {

  // @ts-ignore
  @ViewChild('emailBodyDiv') ref: ElementRef;

  attachmentFileList: File[] = []
  para: string = '';
  cc: string = '';
  subject: string = '';
  body: string = '';

  constructor(private mailService: MailService) { }

  ngOnInit(): void {
  }

  openFileExplorer(){
    // @ts-ignore
    document.querySelector('#fileInput').click()
  }

  onFileInputChange(e: any) {
    for(let i = 0; i < e.files.length; i++) {
      this.attachmentFileList.push(e.files.item(i))
    }
  }

  deleteFileFromAttachments(name: string) {
    //console.log(name+'name')
    let indexToDelete = -1
    this.attachmentFileList.forEach((file, index) => {
      if (file.name === name)
        indexToDelete = index
    })
    //console.log(indexToDelete+ 'index')
    this.attachmentFileList.splice(indexToDelete,1)
    //console.log(this.attachmentFileList)
  }

  sendMail() {
    this.body = this.ref.nativeElement.innerHTML

    if (!this.para || !this.subject || !this.body) {
      Swal.fire('El correo debe tener destinatario, asunto y cuerpo. Verifique')
      return;
    }

    this.mailService.sendMail(this.para, this.subject, this.body, this.cc, this.attachmentFileList).subscribe(
      () => {
        Swal.fire('Se envió el mensaje')
      },
      (err) => {
        console.error(err)
        Swal.fire('No se pudo enviar el mensaje')
      }
    )
  }

}
