import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Code } from 'src/app/doc-item';

@Component({
  selector: 'app-modal-code-tafsili',
  templateUrl: './modal-code-tafsili.component.html',
  styleUrls: ['./modal-code-tafsili.component.scss']
})
export class ModalCodeTafsiliComponent implements OnInit {

  selectID: Code | undefined
  dataSource = []
  sentMoein: Code | undefined

  displayedColumns = [
    'کد معین',
    'عنوان'
  ];

  constructor(public modalRef: MdbModalRef<ModalCodeTafsiliComponent>) {}

  onAdmit() {
    this.sentMoein = this.selectID
    this.modalRef.close(this.sentMoein)
  }

  ngOnInit(): void {
      
  }

}
