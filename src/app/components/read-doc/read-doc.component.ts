import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { convertFrom, Doc } from '../../doc';
import { Code, DocItem } from '../../doc-item';
import { DocService } from '../../services/doc.service';

@Component({
  selector: 'app-read-doc',
  templateUrl: './read-doc.component.html',
  styleUrls: ['./read-doc.component.scss']
})
export class ReadDocComponent implements OnInit {

  @Input() docModel: Doc = new Doc(1, 1, "", 1, "", "", "موقت", 1, "عمومی", "سیستم حسابداری", []) 
  
  x: number = 1
  docItemModel = new DocItem(this.x, this.x, new Code(0, "", "", false, false), new Code(0, "", "", false, false), 0, 0, "", 0, "", 0, false)
  createDocValidity: boolean = false
  dataSource: MatTableDataSource<DocItem>
  flag: number = 0;
  selectID: number = -1;
  errors = null;

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

  constructor(private docService: DocService, private route: ActivatedRoute, private router: Router) { 
    this.dataSource = new MatTableDataSource(this.docModel?.DocItems)
  }

  ngOnInit(): void {
    this.dataSource.data = this.docModel?.DocItems
    this.route.paramMap.subscribe(params => {
       this.docService.getDoc(params.get('id')).subscribe(doc =>{
        this.docModel = convertFrom(doc);
        this.dataSource.data = this.docModel?.DocItems
        this.x = this.docModel?.DocItems.length + 1
        this.docItemModel.Num = this.x
      }, (error) => {
        this.errors = error
      })   
    });
  }

}
