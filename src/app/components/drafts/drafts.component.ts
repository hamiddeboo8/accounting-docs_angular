import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertFrom, Doc } from '../../doc';
import { DocService } from '../../services/doc.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {

  @Output() selectID: number = -1
  dataSource: Doc[] = [];
  flag: number = 0;
  errors = null

  displayedColumns = [
    'شماره سند',
    'شماره فرعی',
    'تاریخ سند',
    'نوع سند',
    'وضعیت',
    'توضیحات',
  //  'توضیحات (2)',
    'سیستم صادرکننده'
  ];

  constructor (private docService: DocService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.docService.getDraftDocs().subscribe((docs) => {
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
    if(id !== 0)
    { 
      this.docService.editDraftDoc(id)
    }
    else{
      alert("تغییر سند امکان پذیر نیست")
    }
  }

}
