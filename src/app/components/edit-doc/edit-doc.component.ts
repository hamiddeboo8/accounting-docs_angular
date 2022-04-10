import { Component, Input, OnInit, Output } from '@angular/core';
import { DocService } from '../../services/doc.service';
import { convertFrom, Doc } from '../../doc';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Code, DocItem } from '../../doc-item';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCodeComponent } from '../modal-code/modal-code.component';

@Component({
  selector: 'app-edit-doc',
  templateUrl: './edit-doc.component.html',
  styleUrls: ['./edit-doc.component.scss']
})
export class EditDocComponent implements OnInit {
  
  selectID: number = -1
  docModel: Doc = new Doc(0, 0, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", [])
  x: number = 0
  dataSource: MatTableDataSource<DocItem> = new MatTableDataSource
  flag: number = 0;
  docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  errors = null;


  modalRef: MdbModalRef<ModalCodeComponent> | null = null;

  total_tafsili: Code[] = []
  total_moein: Code[] = []

  displayedColumns = [
    '#',
    'کد معین',
    'کد تفصیلی',
    'بدهکار',
    'بستانکار',
    'شرح'/*,
    'مبلغ ارز',
    'ارز',
    'نرخ ارز',*/
  ];

  constructor(private docService: DocService, private route: ActivatedRoute, private router: Router, private modalService: MdbModalService) { }

  ngOnInit(): void {
    this.dataSource.data = this.docModel?.DocItems
    this.route.paramMap.subscribe(params => {
       this.docService.getDoc(params.get('id')).subscribe(doc =>{
        this.docModel = convertFrom(doc);
        this.dataSource.data = this.docModel?.DocItems
        if (this.docModel?.DocItems != null) {
          this.x = this.docModel?.DocItems.length + 1
        }
        this.docItemModel.Num = this.x
      }, 
      (error) => {
        this.errors = error
      })
      this.docService.getMoeins().subscribe((items) => {
        this.total_moein = items
      }, (error) => alert(error.message))
      this.docService.getTafsilis().subscribe((items) => {
        this.total_tafsili = items
      }, (error) => alert(error.message))   
    });
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

  addItem(item: DocItem){
    this.x += 1
    let data = this.dataSource.data;
    data.push(item);
    this.dataSource.data = data;
    this.docModel.DocItems = data;
  } 

  deleteItem(){
    this.x -= 1
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

  onSubmit(): void {
    this.docService.changeDoc(this.docModel).subscribe(
      (doc) => this.router.navigateByUrl('/'), 
      (error) => alert(error.message))
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
        const newItem ={
          ID: this.x,
          Num: this.x,
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
     
        this.docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.addItem(newItem)
      } else {
        alert ("کد تفصیلی اشتباه است.")
      }
    } else {
      alert ("کد معین اشتباه است.")
    }

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

  checkCode(str: string): boolean {
    console.log(str)
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
    console.log(str)
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
    if (this.docItemModel.Bedehkar == 0 && this.docItemModel.Bestankar == 0){
      return false
    }
    return true
  }

}
