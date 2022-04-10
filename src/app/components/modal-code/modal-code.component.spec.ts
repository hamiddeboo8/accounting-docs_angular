import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodeComponent } from './modal-code.component';

describe('ModalCodeComponent', () => {
  let component: ModalCodeComponent;
  let fixture: ComponentFixture<ModalCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
