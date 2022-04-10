import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateDocComponent } from './components/create-doc/create-doc.component';
import { DocsComponent } from './components/docs/docs.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { EditDocComponent } from './components/edit-doc/edit-doc.component';
import { EditDraftComponent } from './components/edit-draft/edit-draft.component';
import { ReadDocComponent } from './components/read-doc/read-doc.component';
import { ModalCodeComponent } from './components/modal-code/modal-code.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { ModalCodeTafsiliComponent } from './components/modal-code-tafsili/modal-code-tafsili.component';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';




const appRoutes: Routes = [
  {path: '', component: DocsComponent},
  {path: 'drafts', component: DraftsComponent},
  {path: 'create', component: CreateDocComponent},
  {path: 'read/:id', component: ReadDocComponent},
  {path: 'edit/:id', component: EditDocComponent},
  {path: 'drafts/edit/:id', component: EditDraftComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    CreateDocComponent,
    DocsComponent,
    DraftsComponent,
    EditDocComponent,
    EditDraftComponent,
    ReadDocComponent,
    ModalCodeComponent,
    ModalCodeTafsiliComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true}),
    FormsModule,
    MatTableModule,
    HttpClientModule,
    NgPersianDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
