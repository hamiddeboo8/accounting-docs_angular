import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { Code } from '../../doc-item';


@Component({
  selector: 'app-modal-code',
  templateUrl: './modal-code.component.html',
  styleUrls: ['./modal-code.component.scss']
})
export class ModalCodeComponent {

  selectID: Code | undefined
  dataSource = []
  sentMoein: Code | undefined

  displayedColumns = [
    'کد معین',
    'عنوان'
  ];

  constructor(public modalRef: MdbModalRef<ModalCodeComponent>) {}

  onAdmit() {
    this.sentMoein = this.selectID
    this.modalRef.close(this.sentMoein)
  }

}
