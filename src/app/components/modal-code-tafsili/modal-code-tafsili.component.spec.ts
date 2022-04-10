import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodeTafsiliComponent } from './modal-code-tafsili.component';

describe('ModalCodeTafsiliComponent', () => {
  let component: ModalCodeTafsiliComponent;
  let fixture: ComponentFixture<ModalCodeTafsiliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCodeTafsiliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCodeTafsiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
