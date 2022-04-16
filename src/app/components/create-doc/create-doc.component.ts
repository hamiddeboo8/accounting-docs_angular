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
  @Input() docModel: Doc = new Doc(1, 100000, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", []) 
  
  count: number = 1
  docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  dataSource: MatTableDataSource<DocItem>
  flag: number = 0;
  selectID: number = -1;

  bedehbestan: string = ""
  meghdar: number = 0

  filledWithDocDesc: boolean = false

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
    this.docModel = this.docService.createDoc()
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
    if (this.bedehbestan != undefined) {
      if (this.bedehbestan == 'true') {
        this.docItemModel.Bedehkar = 0
        this.docItemModel.Bestankar = this.meghdar
      } else {
        this.docItemModel.Bedehkar = this.meghdar
        this.docItemModel.Bestankar = 0
      }
    }
    const moein: Code = { ...this.docItemModel.Moein}
    const tafsili: Code = { ...this.docItemModel.Tafsili}
    this.docItemModel.Moein = moein
    this.docItemModel.Tafsili = tafsili
    let copy: DocItem = { ...this.docItemModel}
    if (this.filledWithDocDesc) {
      copy.Desc = this.docModel.Desc
      this.docItemModel.Desc = copy.Desc
    }
    this.docService.validateDocItem(this.docItemModel).subscribe(
      (item) => {
        const newItem ={
          ID: this.count,
          Num: this.count,
          Moein: item.Moein,
          Tafsili: item.Tafsili,
          Bedehkar: copy.Bedehkar,
          Bestankar: copy.Bestankar,
          Desc: copy.Desc,
          CurrPrice: copy.CurrPrice,
          Curr: copy.Curr,
          CurrRate: copy.CurrRate,
          SaveDB: copy.SaveDB
        }
        this.docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.bedehbestan = ""
        this.meghdar = 0
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
    this.selectID = -1
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
    this.docService.updateMoeins().then(m => this.total_moein = m)
    this.docService.updateTafsilis().then(t => this.total_tafsili = t)
  }

  updateFieldsOfDocItemModel(idx: number): void {
    this.docItemModel = {...this.docModel.DocItems[idx - 1]}
    this.docItemModel.Moein = {...this.docModel.DocItems[idx-1].Moein}
    this.docItemModel.Tafsili = {...this.docModel.DocItems[idx-1].Tafsili}

    if (this.docItemModel.Bedehkar == 0) {
      this.meghdar = this.docItemModel.Bestankar
      this.bedehbestan = "true"
    } else {
      this.meghdar = this.docItemModel.Bedehkar
      this.bedehbestan = "false"
    }
  }

  editItem(idx: number): void {
    if (this.bedehbestan != undefined) {
      if (this.bedehbestan == 'true') {
        this.docItemModel.Bedehkar = 0
        this.docItemModel.Bestankar = this.meghdar
      } else {
        this.docItemModel.Bedehkar = this.meghdar
        this.docItemModel.Bestankar = 0
      }
    }
    const moein: Code = { ...this.docItemModel.Moein}
    const tafsili: Code = { ...this.docItemModel.Tafsili}
    this.docItemModel.Moein = moein
    this.docItemModel.Tafsili = tafsili
    let copy = {...this.docItemModel}
    if (this.filledWithDocDesc) {
      copy.Desc = this.docModel.Desc
      this.docItemModel.Desc = copy.Desc
    }
    this.docService.validateDocItem(this.docItemModel).subscribe(
      (item) => {
        const newItem ={
          ID: this.docModel.DocItems[idx - 1].ID,
          Num: this.docModel.DocItems[idx - 1].Num,
          Moein: item.Moein,
          Tafsili: item.Tafsili,
          Bedehkar: copy.Bedehkar,
          Bestankar: copy.Bestankar,
          Desc: copy.Desc,
          CurrPrice: copy.CurrPrice,
          Curr: copy.Curr,
          CurrRate: copy.CurrRate,
          SaveDB: copy.SaveDB
        }
        this.docItemModel = new DocItem(this.count, this.count, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.meghdar = 0
        this.bedehbestan = ""
        const data = this.dataSource.data;
        data[idx - 1] = newItem;
        this.dataSource.data = data;
        this.docModel.DocItems = data;
      }, (error) => alert(error.message)
    )
  }

}
