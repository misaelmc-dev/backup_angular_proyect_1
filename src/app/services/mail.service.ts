import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  sendMail(para: string, subject: string, body: string, cc: string, files: File[]) {
    let ENDPOINT = `${this.globals.backend_base_url}/mail/simple`;
    let formData = new FormData();
    formData.append('para', para)
    formData.append('subject', subject)
    formData.append('body', body)
    formData.append('cc', cc)
    files.forEach((file) => {
      formData.append(file.name, file, file.name)
    })
    console.log(formData)
    return this.http.post(ENDPOINT, formData);
  }
}
