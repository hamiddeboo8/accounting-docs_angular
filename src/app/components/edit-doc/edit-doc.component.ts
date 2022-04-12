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
  dataSource: MatTableDataSource<DocItem> = new MatTableDataSource
  flag: number = 0;
  docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  errors = null;
  addDocItems : DocItem[] = []
  removeDocItems : number[] = []

  bedehbestan: string = ""
  meghdar: number = 0

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
        }
        this.docItemModel.Num = this.x
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
    let data: DocItem[] = []
    let j = 1
    let removedID = -1
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].Num == this.selectID){
        removedID = this.dataSource.data[i].ID
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
    if (removedID != -1) {
      this.removeDocItems.push(removedID)
    }
  } 

  onSubmit(): void {
    let docEdit = new DocEdit(this.docModel.ID, this.docModel.DocNum, this.docModel.Date, this.docModel.AtfNum, this.docModel.MinorNum, this.docModel.Desc, this.docModel.State, this.docModel.DailyNum, this.docModel.DocType, this.docModel.EmitSystem, this.addDocItems, this.removeDocItems)
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
    this.docService.validateDocItem(this.docItemModel).subscribe(
      (item) => {
        const newItem ={
          ID: this.x,
          Num: this.x,
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
        this.docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
        this.x += 1
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;
        this.docModel.DocItems = data;
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
    this.docService.updateMoeins()
    this.docService.updateTafsilis()
    this.total_moein = this.docService.getMoeins()
    this.total_tafsili = this.docService.getTafsilis()
  }

}
