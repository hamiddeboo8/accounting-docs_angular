import { Injectable } from '@angular/core';
import { convertTo, Doc, DocToSend } from '../doc';
import { Observable, of, catchError, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Code } from '../doc-item';

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
  
  constructor(private http:HttpClient, private router:Router) { }

  getDoc(id: string | null): Observable<DocToSend>{
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
    let x = this.http.get(`${this.apiURL}/edit/${id}`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    )
    x.subscribe(() => this.router.navigateByUrl('/edit/' + String(id)), (error) => alert(error.message)) 
  }

  addDoc(newDoc: Doc): Observable<DocToSend> {
    const docSend = convertTo(newDoc)
    return this.http.post<DocToSend>(this.apiURL, docSend, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  changeDoc(newDoc: Doc): Observable<DocToSend> {
    const docSend = convertTo(newDoc)
    return this.http.put<DocToSend>(`${this.apiURL}/${newDoc.DocNum}`, docSend, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  changeState (x: number): Observable<DocToSend> { 
    return this.http.put<DocToSend>(`${this.apiURL}/change_state/${x}`, httpOptions).pipe(
        catchError(this.errorHandler)
    )
  }

  createDoc(): Observable<DocToSend> {
    return this.http.get<DocToSend>(`${this.apiURL}/create`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
  }

  getMoeins(): Observable<Code[]> {
    return this.http.get<Code[]>(`${this.apiURL}/moeins`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
  }

  getTafsilis(): Observable<Code[]> {
    return this.http.get<Code[]>(`${this.apiURL}/tafsilis`).pipe(
      catchError(this.errorHandler3),
      retry(5)
    ) 
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
