import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasFuncComponent } from './canvas-func.component';

describe('CanvasFuncComponent', () => {
  let component: CanvasFuncComponent;
  let fixture: ComponentFixture<CanvasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
