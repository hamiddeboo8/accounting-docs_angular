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
  docs: Doc[] = []

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

  createDoc(): Observable<DocToSend> {
    return this.http.get<DocToSend>(`${this.apiURL}/create`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
  }

  validateDocItem(item: DocItem): Observable<Codes> {
    return this.http.post<Codes>(`${this.apiURL}/validate_doc_item`, item, httpOptions).pipe(
      catchError(this.errorHandler3)
    )
  }

  updateMoeins(): void {
    let x = this.http.get<Code[]>(`${this.apiURL}/moeins`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    )
    x.subscribe((items) => this.moeins = items, (error) => alert(error.message))
  }

  updateTafsilis(): void {
    let x = this.http.get<Code[]>(`${this.apiURL}/tafsilis`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
    x.subscribe((items) => this.tafsilis = items, (error) => alert(error.message))
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
    console.log(errorHandler2)
    throw new Error(errorHandler2.error.message);
  }

  errorHandler3(errorHandler3: HttpErrorResponse): Observable<any> {
    console.log(errorHandler3)
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
