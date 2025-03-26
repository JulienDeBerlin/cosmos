import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixiSkyComponent } from './pixi-sky.component';

describe('PixiSkyComponent', () => {
  let component: PixiSkyComponent;
  let fixture: ComponentFixture<PixiSkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixiSkyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixiSkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
