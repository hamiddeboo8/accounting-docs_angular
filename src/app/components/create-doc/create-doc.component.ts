import { Component, Input, OnInit } from '@angular/core';
import { DocService } from '../../services/doc.service';
import { convertFrom, Doc } from '../../doc';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Code, DocItem } from '../../doc-item';
import { ModalCodeComponent } from '../modal-code/modal-code.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss']
})
export class CreateDocComponent implements OnInit {
  @Input() docModel: Doc = new Doc(1, 1, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", []) 
  
  count: number = 1
  docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  dataSource: MatTableDataSource<DocItem>
  flag: number = 0;
  selectID: number = -1;

  bedehbestan: string = ""
  meghdar: number = 0

  errors = null;

  dated = new Date()

  modalRef: MdbModalRef<ModalCodeComponent> | null = null;

  total_tafsili: Code[] = []
  total_moein: Code[] = []

  displayedColumns = [
    '#',
    'کد معین',
    'کد تفصیلی',
    'بدهکار',
    'بستانکار',
    'شرح',
    'مقدار ارز',
    'ارز',
    'نرخ ارز',
  ];


  constructor(private docService: DocService, private router:Router, private modalService: MdbModalService) {
    this.dataSource = new MatTableDataSource(this.docModel?.DocItems)
   }

  ngOnInit(): void {
    this.docService.createDoc().subscribe((doc) => {
      console.log(doc)
      this.docModel = convertFrom(doc)
    }
    , (error) => alert(error.message))
    this.docService.getMoeins().subscribe((items) => {
      this.total_moein = items
    }, (error) => alert(error.message))
    this.docService.getTafsilis().subscribe((items) => {
      this.total_tafsili = items
    }, (error) => alert(error.message))
  }

  openMoeinModal() {
    this.modalRef = this.modalService.open(ModalCodeComponent, {
      data : {
        dataSource : this.total_moein,
        sentMoein: this.docItemModel.Moein
      }
    })
    this.modalRef.onClose.subscribe((message: any) => {
      if (message != undefined) {
        this.docItemModel.Moein = message
      }
    });
  }

  openTafsiliModal() {
    this.modalRef = this.modalService.open(ModalCodeComponent, {
      data : {
        dataSource : this.total_tafsili,
        sentMoein: this.docItemModel.Tafsili
      }
    })
    this.modalRef.onClose.subscribe((message: any) => {
      if (message != undefined) {
        this.docItemModel.Tafsili = message
      }
    });
  }


  createDocItem() {
    let moeinIdx = -1
    let tafsilIdx = -1
    for (let i = 0; i < this.total_moein.length; i++) {
      const element = this.total_moein[i];
      if(element.CodeVal == this.docItemModel.Moein.CodeVal){
        moeinIdx = i
        break
      }
    }
    for (let i = 0; i < this.total_tafsili.length; i++) {
      const element = this.total_tafsili[i];
      if(element.CodeVal == this.docItemModel.Tafsili.CodeVal){
        tafsilIdx = i
        break
      }
    }
    if(moeinIdx != -1){  
      if(tafsilIdx != -1){
        const moein = {...this.total_moein[moeinIdx]}
        const tafsili = {...this.total_tafsili[tafsilIdx]}
        if(this.bedehbestan != undefined) {
          if(this.bedehbestan == 'true') {
            this.docItemModel.Bestankar = this.meghdar
            this.docItemModel.Bedehkar = 0
          } else {
            this.docItemModel.Bestankar = 0
            this.docItemModel.Bedehkar = this.meghdar
          }
        }
        const newItem ={
          ID: this.count,
          Num: this.count,
          Moein: moein,
          Tafsili: tafsili,
          Bedehkar: this.docItemModel.Bedehkar,
          Bestankar: this.docItemModel.Bestankar,
          Desc: this.docItemModel.Desc,
          CurrPrice: this.docItemModel.CurrPrice,
          Curr: this.docItemModel.Curr,
          CurrRate: this.docItemModel.CurrRate,
          SaveDB: this.docItemModel.SaveDB
        }
        console.log(newItem)
        this.docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.addItem(newItem)
      } else {
        alert ("کد تفصیلی اشتباه است.")
      }
    } else {
      alert ("کد معین اشتباه است.")
    }

  }

  onSubmit(): void {
    this.docService.addDoc(this.docModel).subscribe(
      (doc) => this.router.navigateByUrl('/'), 
      (error) => alert(error.message))
  }

  minusPositive(x: number): boolean {
    const str = x.toString()
    for (let i = 0; i < str.length; i++) {
      console.log(str.charAt(i))
      if (str.charAt(i) < '0' || str.charAt(i) > '9'){
        return true
      }
    }
    return false
  }

  addItem(item: DocItem){
    this.count += 1
    const data = this.dataSource.data;
    data.push(item);
    this.dataSource.data = data;
    this.docModel.DocItems = data;
  } 

  deleteItem(){
    this.count -= 1
    let data: DocItem[] = []
    let j = 1
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].Num == this.selectID){
        continue
      }
      let element = this.dataSource.data[i]
      element.Num = j
      element.ID = j
      data.push(element)
      j += 1
    }
    this.dataSource.data = data;
    this.docModel.DocItems = data;
  } 

  checkCode(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) < '0' || str.charAt(i) > '9'){
        return true
      }
    }
    return false
  }

  checkCode2(str: string): boolean {
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

  checkDocItem(): boolean {
    if (this.meghdar == 0){
      return false
    }
    return true
  }

  /*onDelete(): void {
    this.docService.removeDoc(this.docModel).subscribe(
      (doc) => this.router.navigateByUrl('/'), 
      (error) => alert(error.message))
  }

  onSubmitDraft(): void {
    this.docService.saveDocDraft(this.docModel).subscribe(
      (doc) => this.router.navigateByUrl('/'), 
      (error) => alert(error))
  }*/

  convertCurr() {
    this.meghdar = this.docItemModel.CurrPrice * this.docItemModel.CurrRate
  }

}
