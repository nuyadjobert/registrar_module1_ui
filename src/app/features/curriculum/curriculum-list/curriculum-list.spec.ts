import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumList } from './curriculum-list';

describe('CurriculumList', () => {
  let component: CurriculumList;
  let fixture: ComponentFixture<CurriculumList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
