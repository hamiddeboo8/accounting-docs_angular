import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DocService } from '../../services/doc.service';
import { convertFrom, Doc, DocEdit } from '../../doc';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Code, DocItem } from '../../doc-item';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCodeComponent } from '../modal-code/modal-code.component';
import { ModalCodeTafsiliComponent } from '../modal-code-tafsili/modal-code-tafsili.component';

@Component({
  selector: 'app-edit-doc',
  templateUrl: './edit-doc.component.html',
  styleUrls: ['./edit-doc.component.scss']
})
export class EditDocComponent implements OnInit, OnDestroy  {
  
  selectID: number = -1
  docModel: Doc = new Doc(0, 1, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", [])
  x: number = 0
  idCount: number = 0
  dataSource: MatTableDataSource<DocItem> = new MatTableDataSource
  flag: number = 0;
  docItemModel = new DocItem(this.idCount, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  errors = null;

  addDocItems : DocItem[] = []
  removeDocItems : number[] = []

  editDocItems : DocItem[] = []
  
  bedehbestan: string = ""
  meghdar: number = 0

  filledWithDocDesc: boolean = false

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

  constructor(private docService: DocService, private route: ActivatedRoute, private router: Router, private modalService: MdbModalService) { }
  
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    let pageReloaded = window.performance
                 .getEntriesByType('navigation')
                 .map((nav) => (nav as any).type)
                 .includes('reload');
    if (!pageReloaded) {
      this.exit()
    }
  }

  ngOnDestroy(): void {
    this.exit()
  }

  ngOnInit(): void {
    this.dataSource.data = this.docModel?.DocItems
    this.route.paramMap.subscribe(params => {
       this.docService.getDoc(params.get('id')).subscribe(doc =>{
        console.log("Edit doc: ", doc)
        this.docModel = convertFrom(doc);
        this.dataSource.data = this.docModel?.DocItems
        if (this.docModel?.DocItems != null) {
          this.x = this.docModel?.DocItems.length + 1
          this.idCount = this.docModel?.DocItems[this.docModel?.DocItems.length - 1].ID + 1
        }
        this.docItemModel.Num = this.x
        this.docItemModel.ID = this.idCount
      }, 
      (error) => {
        this.errors = error
      })
      this.total_moein = this.docService.getMoeins()
      this.total_tafsili = this.docService.getTafsilis()
    })
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

  deleteItem(){
    this.x -= 1
    let data: DocItem[] = this.dataSource.data
    if (this.selectID == -1) {
      return
    }
    let removedID = this.dataSource.data[this.selectID - 1].ID
    data.splice(this.selectID - 1, 1)
    for (let i = this.selectID - 1; i < data.length; i++) {
      data[i].Num -= 1
    }
    this.dataSource.data = data;
    this.docModel.DocItems = data;
    let x = 0
    let index = -1
    if (removedID != -1) {
      for(let i = 0; i < this.addDocItems.length; i++){
        if (this.addDocItems[i].ID == removedID){
          x = 1
          index = i
          break
        }
      }
      if (x == 0) {
        x = 0
        index = -1
        this.removeDocItems.push(removedID)
        for(let i = 0; i < this.editDocItems.length; i++){
          if (this.editDocItems[i].ID == removedID){
            x = 1
            index = i
            break
          }
        }
        if (x == 1) {
          this.editDocItems.splice(index, 1)
        }
      } else {
        this.addDocItems.splice(index, 1)
      }
    }
    this.selectID = -1
  } 

  onSubmit(): void {
    let docEdit = new DocEdit(this.docModel.ID, this.docModel.DocNum, this.docModel.Date, this.docModel.AtfNum, this.docModel.MinorNum, this.docModel.Desc, this.docModel.State, this.docModel.DailyNum, this.docModel.DocType, this.docModel.EmitSystem, this.addDocItems, this.removeDocItems, this.editDocItems)
    this.docService.changeDoc(docEdit).subscribe(
      () => this.router.navigateByUrl('/'), 
      (error) => alert(error.message))
  }

  exit(): void {
    this.docService.changeIsChange(this.docModel.ID).subscribe(() => this.router.navigateByUrl('/'), (error) => {
      alert("نمیتوان خارج شد.")
    })
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
    let copy = {...this.docItemModel}
    if (this.filledWithDocDesc) {
      copy.Desc = this.docModel.Desc
      this.docItemModel.Desc = copy.Desc
    }
    this.docService.validateDocItem(this.docItemModel).subscribe(
      (item) => {
        const newItem ={
          ID: this.idCount,
          Num: this.x,
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
        this.docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.x += 1
        this.idCount += 1
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;
        this.docModel.DocItems = data;
        this.addDocItems.push(newItem)
      }, (error) => alert(error.message)
    )
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
        this.docItemModel = new DocItem(this.idCount, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.meghdar = 0
        this.bedehbestan = ""
        const data = this.dataSource.data;
        data[idx - 1] = newItem;
        this.dataSource.data = data;
        this.docModel.DocItems = data;
        let x = 0
        let index = -1
        for(let i = 0; i < this.editDocItems.length; i++){
          if (this.editDocItems[i].ID == newItem.ID){
            x = 1
            index = i
            break
          }
        }
        if (x == 1) {
          this.editDocItems[index] = newItem
        } else {
          let x = 0
          let index = -1
          for(let i = 0; i < this.addDocItems.length; i++){
            if (this.addDocItems[i].ID == newItem.ID){
              x = 1
              index = i
              break
            }
          }
          if (x == 1) {
            this.addDocItems[index] = newItem
          } else {
            this.editDocItems.push(newItem)
          }
        }
      }, (error) => alert(error.message)
    )
  }

}
