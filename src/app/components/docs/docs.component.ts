import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertFrom, Doc } from '../../doc';
import { DocService } from '../../services/doc.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit{
  @Output() selectID: number = -1
  @Output() docInitCreate: Doc = new Doc(1, 100000, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", [])
  dataSource: Doc[] = [];
  flag: number = 0;
  errors = null
  MinorNum = ""

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
    this.docService.getDocs().subscribe((docs) => {
      let docs_2: Doc[] = []
      for (let i = 0; docs != null && i < docs.length; i++) {
        let doc = docs[i]
        docs_2.push(convertFrom(doc))
      }
      this.dataSource = docs_2
    }, 
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

  Delete(id: number): void{
    this.flag = 0
    let idx = -1
    if(id != 0){
      for (let index = 0; index < this.dataSource.length; index++) {
        const doc = this.dataSource[index];
        if(doc.ID === id) {
          idx = index
          if(doc.State !== "دائمی"){
            this.flag = 1
          }
          break
        }
      }
    }
    if(this.flag === 1)
    { 
      this.docService.deleteDoc(id).subscribe(
        () => {
          let data: Doc[] = []
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].ID == this.selectID){
              continue
            }
            let element = this.dataSource[i]
            data.push(element)
          }
        this.dataSource = data;
        }, 
        (error) => alert(error))
    }
    else{
      alert("حذف سند امکان پذیر نیست")
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
    this.docService.changeState(this.selectID).subscribe(() => {
      this.docService.getDocs().subscribe((docs) => {
        let docs_2: Doc[] = []
        for (let i = 0; docs != null && i < docs.length; i++) {
          let doc = docs[i]
          docs_2.push(convertFrom(doc))
        }
        this.dataSource = docs_2
      }, 
        (error) => {
          alert(error)
        })
    }, (error) => {
      alert(error.message)
    })
  }

  checkCode3(str: string): boolean {
    if (str == null || str.length == 0) {
      return false
    }
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) < '0' || str.charAt(i) > '9'){
        return true
      }
    }
    return false
  }

  Filter(): void {
    this.docService.filterByMinorNum(this.MinorNum).subscribe((docs) => {
      let docs_2: Doc[] = []
      for (let i = 0; docs != null && i < docs.length; i++) {
        let doc = docs[i]
        docs_2.push(convertFrom(doc))
      }
      this.dataSource = docs_2
    }, 
      (error) => {
        alert(error)
    })
  }

  FilterBack(): void {
    this.docService.getDocs().subscribe((docs) => {
      let docs_2: Doc[] = []
      for (let i = 0; docs != null && i < docs.length; i++) {
        let doc = docs[i]
        docs_2.push(convertFrom(doc))
      }
      this.dataSource = docs_2
    }, 
      (error) => {
        alert(error)
      })
  }

  NumberingDocs(): void {
    this.docService.numberingDocs().subscribe(() => {
      this.docService.getDocs().subscribe((docs) => {
        let docs_2: Doc[] = []
        for (let i = 0; docs != null && i < docs.length; i++) {
          let doc = docs[i]
          docs_2.push(convertFrom(doc))
        }
        this.dataSource = docs_2
      }, 
        (error) => {
          alert(error)
        })
    }, 
      (error) => {
        alert(error)
    })
  }
}
