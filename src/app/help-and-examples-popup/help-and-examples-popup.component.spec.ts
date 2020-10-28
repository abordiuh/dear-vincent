import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpAndExamplesPopupComponent } from './help-and-examples-popup.component';

describe('HelpAndExamplesPopupComponent', () => {
  let component: HelpAndExamplesPopupComponent;
  let fixture: ComponentFixture<HelpAndExamplesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpAndExamplesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpAndExamplesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
