import { Component, Input, OnInit } from '@angular/core';
import { DocService } from '../../services/doc.service';
import { convertFrom, Doc } from '../../doc';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Code, DocItem } from '../../doc-item';
import { ModalCodeComponent } from '../modal-code/modal-code.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCodeTafsiliComponent } from '../modal-code-tafsili/modal-code-tafsili.component';

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

  // change not to request for initial
  ngOnInit(): void {
    this.docService.createDoc().subscribe((doc) => {
      this.docModel = convertFrom(doc)
    }
    , (error) => alert(error.message))
    this.total_moein = this.docService.getMoeins()
    this.total_tafsili = this.docService.getTafsilis()
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
    this.modalRef = this.modalService.open(ModalCodeTafsiliComponent, {
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
    this.docService.validateDocItem(this.docItemModel).subscribe(
      (item) => {
        const newItem ={
          ID: this.count,
          Num: this.count,
          Moein: item.Moein,
          Tafsili: item.Tafsili,
          Bedehkar: this.docItemModel.Bedehkar,
          Bestankar: this.docItemModel.Bestankar,
          Desc: this.docItemModel.Desc,
          CurrPrice: this.docItemModel.CurrPrice,
          Curr: this.docItemModel.Curr,
          CurrRate: this.docItemModel.CurrRate,
          SaveDB: this.docItemModel.SaveDB
        }
        this.docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.count += 1
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;
        this.docModel.DocItems = data;
      }, (error) => alert(error.message)
    )
  }

  onSubmit(): void {
    this.docService.addDoc(this.docModel).subscribe(
      () => this.router.navigateByUrl('/'), 
      (error) => alert(error.message))
  }

  minusPositive(x: number): boolean {
    const str = x.toString()
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) < '0' || str.charAt(i) > '9'){
        return true
      }
    }
    return false
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

  convertCurr() {
    this.meghdar = this.docItemModel.CurrPrice * this.docItemModel.CurrRate
  }

  updateList() {
    this.docService.updateMoeins()
    this.docService.updateTafsilis()
    this.total_moein = this.docService.getMoeins()
    this.total_tafsili = this.docService.getTafsilis()
  }

}
