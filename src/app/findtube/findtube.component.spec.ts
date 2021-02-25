import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindtubeComponent } from './findtube.component';

describe('FindtubeComponent', () => {
  let component: FindtubeComponent;
  let fixture: ComponentFixture<FindtubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindtubeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindtubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
