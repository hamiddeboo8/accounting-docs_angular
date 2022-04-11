import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertFrom, Doc } from '../../doc';
import { DocService } from '../../services/doc.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  @Output() selectID: number = -1
  @Output() docInitCreate: Doc = new Doc(1, 1, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", [])
  dataSource: Doc[] = [];
  flag: number = 0;
  errors = null

  displayedColumns = [
    'شماره سند',
    'شماره عطف',
    'شماره فرعی',
    'تاریخ سند',
    'شماره روزانه',
    'نوع سند',
    'وضعیت',
    'توضیحات',
  //  'توضیحات (2)',
    'سیستم صادرکننده'
  ];

  constructor (private docService: DocService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log("X")
    this.docService.getDocs().subscribe((docs) => {
      let docs_2: Doc[] = []
      for (let i = 0; docs != null && i < docs.length; i++) {
        let doc = docs[i]
        docs_2.push(convertFrom(doc))
      }
      this.dataSource = docs_2}, 
      (error) => {
        this.errors = error
      })
  }

  Edit(id: number): void{
    this.flag = 0
    if(id != 0){
      for(var doc of this.dataSource){
        if(doc.ID === id) {
          if(doc.State !== "دائمی"){
            this.flag = 1}
          break
        }
      }
    }
    if(this.flag === 1)
    { 
      this.docService.editDocs(id)
    }
    else{
      alert("تغییر سند امکان پذیر نیست")
    }
  }

  Create(): void{
    this.router.navigateByUrl('/create')
  }

  /*Drafts(): void{
    this.router.navigateByUrl('/drafts');
  }*/

  Read(id: number): void {
    this.flag = 0
    if(id != 0){
      let x = id.toString()
      this.docService.getDoc(x).subscribe((doc)=> this.router.navigateByUrl('/read/' + String(id)), (error) => alert(error))
    } else{
      alert("مشاهده سند امکان پذیر نیست")
    }
  }

  changeState(): void {
    this.docService.changeState(this.selectID).subscribe((doc) => {
      this.docService.getDocs().subscribe((docs) => {
        let docs_2: Doc[] = []
        for (let i = 0; docs != null && i < docs.length; i++) {
          let doc = docs[i]
          docs_2.push(convertFrom(doc))
        }
        this.dataSource = docs_2}, 
        (error) => {
          this.errors = error
        })
    }, (error) => {
      alert("این سند دائمی است.")
    })
  }

}
