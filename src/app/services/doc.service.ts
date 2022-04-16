import { Injectable } from '@angular/core';
import { convertFrom, convertTo, convertToEdit, Doc, DocEdit, DocToSend } from '../doc';
import { Observable, of, catchError, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Code, Codes, DocItem } from '../doc-item';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class DocService {
  private apiURL = 'http://localhost:5710/docs'
  
  moeins: Code[] = []
  tafsilis: Code[] = []
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  errors = null

  constructor(private http:HttpClient, private router:Router) { }

  getDoc(id: string | null): Observable<DocToSend>{
    console.log("id: ", id)
    if (id != null) {
      var x: number = +id;
      return this.http.get<DocToSend>(`${this.apiURL}/${x}`).pipe(
        catchError(this.errorHandler)
      )
    } else{
      return this.http.get<DocToSend>(`${this.apiURL}/${-1}`).pipe(
        catchError(this.errorHandler)
      )
    }
  }

  getDocs(): Observable<DocToSend[]> {
    return this.http.get<DocToSend[]>(this.apiURL).pipe(
      catchError(this.errorHandler2),
      retry(5)
    )
  }

  numberingDocs(): Observable<any> {
    return this.http.get(`${this.apiURL}/numbering`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    )
  }

  filterByMinorNum(filter: string): Observable<DocToSend[]> {
    return this.http.get<DocToSend[]>(`${this.apiURL}/filter/minor_num/${filter}`).pipe(
      catchError(this.errorHandler2)
    )
  }

  editDocs(id: number): void {
    console.log("id: ", id)
    let x = this.http.get(`${this.apiURL}/edit/${id}`).pipe(
      catchError(this.errorHandler3),
      retry(3)
    )
    x.subscribe(() => this.router.navigateByUrl('/edit/' + String(id)), (error) => alert(error.message)) 
  }

  deleteDoc(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      catchError(this.errorHandler3),
      retry(3)
    )
  }

  addDoc(newDoc: Doc): Observable<DocToSend> {
    const docSend = convertTo(newDoc)
    console.log("DocSendAdd: ", docSend)
    return this.http.post<DocToSend>(this.apiURL, docSend, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  changeDoc(newDoc: DocEdit): Observable<DocToSend> {
    const docSend = convertToEdit(newDoc)
    return this.http.put<DocToSend>(`${this.apiURL}/${newDoc.ID}`, docSend, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  changeState (x: number): Observable<DocToSend> { 
    console.log("x: ", x)
    return this.http.put<DocToSend>(`${this.apiURL}/change_state/${x}`, httpOptions).pipe(
        catchError(this.errorHandler)
    )
  }

  changeIsChange(x: number): Observable<DocToSend> {
    return this.http.put<DocToSend>(`${this.apiURL}/changing/${x}`, httpOptions).pipe(
      catchError(this.errorHandler)
  )  
}

  createDoc(): Doc {
    let today = new Date().toLocaleDateString('fa-IR')
    const rExp : RegExp = new RegExp("(.+)/(.+)/(.+)");
    var matches = rExp.exec(today)
    let doc: Doc = new Doc(0, 100000, "", 0, "", "", "موقت", 0, "عمومی", "سیستم حسابداری", [])
    if (matches != null) {
      let year = +this.fixNumbers(matches[1])
      let month = +this.fixNumbers(matches[2])
      let day = +this.fixNumbers(matches[3])
      let hour = 0; let minute = 0; let second = 0;
      var date = year.toString().concat("-").concat(month.toString()).concat('-').concat(day.toString())
      date = date.concat(" ").concat(hour.toString()).concat(":").concat(minute.toString()).concat(":").concat(second.toString())
      doc.Date = date
    } else {
      alert("initialize fails")
    }
    return doc
  }

  validateDocItem(item: DocItem): Observable<Codes> {
    return this.http.post<Codes>(`${this.apiURL}/validate_doc_item`, item, httpOptions).pipe(
      catchError(this.errorHandler3)
    )
  }

  fixNumbers(str: any) {
      if(typeof str === 'string')
      {
        for(var i=0; i<10; i++)
        {
          str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
        }
      }
    return str;
  }

  async updateMoeins(): Promise<Code[]> {
    let x
    x = await this.http.get<Code[]>(`${this.apiURL}/moeins`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ).toPromise().catch(() => {x = this.moeins; return x})
    this.moeins = x
    return <Code[]>x
  }

  async updateTafsilis(): Promise<Code[]> {
    let x
    x = await this.http.get<Code[]>(`${this.apiURL}/tafsilis`).pipe(
      catchError(this.errorHandler3),
    ).toPromise().catch(() => {x = this.tafsilis; return x})
    this.tafsilis = x
    return <Code[]>x
  }

  getMoeins(): Code[] {
    return this.moeins
  }

  getTafsilis(): Code[] {
    return this.tafsilis
  }

  errorHandler(errorHandler: HttpErrorResponse): Observable<DocToSend> {
    throw new Error(errorHandler.error.message);
  }

  errorHandler2(errorHandler2: HttpErrorResponse): Observable<DocToSend[]> {
    throw new Error(errorHandler2.error.message);
  }

  errorHandler3(errorHandler3: HttpErrorResponse): Observable<any> {
    throw new Error(errorHandler3.error.message);
  }

  /*
  getDraft(id: string | null): Observable<DocToSend>{
    if (id != null) {
      var x: number = +id;
      return this.http.get<DocToSend>(`${this.apiURL}/drafts/${x}`).pipe(
        catchError(this.errorHandler)
      )
    } else{
      return this.http.get<DocToSend>(`${this.apiURL}/drafts/${-1}`).pipe(
        catchError(this.errorHandler)
      )
    }
  }

  getDraftDocs() {
    return this.http.get<DocToSend[]>(`${this.apiURL}/drafts`).pipe(
      catchError(this.errorHandler2),
      retry(5)
    )
  }

  editDraftDoc(id: number): void {
    let x = this.http.get(`${this.apiURL}/drafts/edit/${id}`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    )
    x.subscribe(() => this.router.navigateByUrl('/drafts/edit/' + String(id)), (error) => alert(error.message)) 
  }  

  saveDocDraft(docModel: Doc): Observable<DocToSend> {
    const docSend = convertTo(docModel)
    console.log(docSend)
    console.log(docSend)
    return this.http.put<DocToSend>(`${this.apiURL}/drafts/${docSend.ID}`, docSend, httpOptions).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
  }

  removeDraftDoc(docModel: Doc): Observable<DocToSend> {
    return this.http.put<DocToSend>(`${this.apiURL}/drafts/delete/${docModel.ID}`, httpOptions).pipe(
      catchError(this.errorHandler3),
      retry(5)
    )
  }

  createDoc(): Observable<DocToSend> {
    return this.http.get<DocToSend>(`${this.apiURL}/drafts/create`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
  }  
  */

}
