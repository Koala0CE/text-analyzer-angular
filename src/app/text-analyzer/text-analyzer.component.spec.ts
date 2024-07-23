import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextAnalyzerComponent } from './text-analyzer.component';
import { TextAnalyzerService } from '../text-analyzer.service';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextAnalyzerComponent', () => {
  let component: TextAnalyzerComponent;
  let fixture: ComponentFixture<TextAnalyzerComponent>;
  let textAnalyzerService: jasmine.SpyObj<TextAnalyzerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TextAnalyzerService', [
      'analyzeTextOffline',
      'analyzeTextOnline',
    ]);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FormsModule,
        TextAnalyzerComponent,
        HttpClientTestingModule,
        TextAnalyzerComponent,
        CommonModule,
        FormsModule,
        MatSlideToggleModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatRadioModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: TextAnalyzerService, useValue: spy },
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextAnalyzerComponent);
    component = fixture.componentInstance;
    textAnalyzerService = TestBed.inject(
      TextAnalyzerService
    ) as jasmine.SpyObj<TextAnalyzerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should analyze text offline', () => {
    textAnalyzerService.analyzeTextOffline.and.returnValue(
      "Offline Analysis:\n\nLetter 'H' appears 1 times\nLetter 'E' appears 1 times\nLetter 'L' appears 3 times\nLetter 'O' appears 2 times\nLetter 'W' appears 1 times\nLetter 'R' appears 1 times\nLetter 'D' appears 1 times"
    );

    component.text = 'hello world';
    component.isOnline = false;
    component.isVowels = false;
    component.analyzeText();

    expect(textAnalyzerService.analyzeTextOffline).toHaveBeenCalledWith(
      'hello world',
      false
    );
    expect(component.analysisResult).toContain("Letter 'H' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'E' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'L' appears 3 times");
    expect(component.analysisResult).toContain("Letter 'O' appears 2 times");
    expect(component.analysisResult).toContain("Letter 'W' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'R' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'D' appears 1 times");
  });

  it('should analyze text online', () => {
    const onlineResult =
      "Online Analysis:\n\nLetter 'H' appears 1 times\nLetter 'E' appears 1 times\nLetter 'L' appears 3 times\nLetter 'O' appears 2 times\nLetter 'W' appears 1 times\nLetter 'R' appears 1 times\nLetter 'D' appears 1 times";
    textAnalyzerService.analyzeTextOnline.and.returnValue(of(onlineResult));

    component.text = 'hello world';
    component.isOnline = true;
    component.isVowels = false;
    component.analyzeText();

    expect(textAnalyzerService.analyzeTextOnline).toHaveBeenCalledWith(
      'hello world',
      false
    );
    expect(component.analysisResult).toContain("Letter 'H' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'E' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'L' appears 3 times");
    expect(component.analysisResult).toContain("Letter 'O' appears 2 times");
    expect(component.analysisResult).toContain("Letter 'W' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'R' appears 1 times");
    expect(component.analysisResult).toContain("Letter 'D' appears 1 times");
  });

  it('should handle errors when analyzing text online', () => {
    const errorResponse =
      'Server returned code: 500, error message is: Server Error';
    textAnalyzerService.analyzeTextOnline.and.returnValue(
      throwError(() => new Error(errorResponse))
    );

    component.text = 'hello world';
    component.isOnline = true;
    component.isVowels = true;
    component.analyzeText();

    expect(textAnalyzerService.analyzeTextOnline).toHaveBeenCalledWith(
      'hello world',
      true
    );
    expect(component.error).toBe(errorResponse);
  });

  it('should update analysis history correctly', () => {
    textAnalyzerService.analyzeTextOffline.and.returnValue(
      "Offline Analysis:\n\nLetter 'H' appears 1 times\nLetter 'E' appears 1 times\nLetter 'L' appears 3 times\nLetter 'O' appears 2 times\nLetter 'W' appears 1 times\nLetter 'R' appears 1 times\nLetter 'D' appears 1 times"
    );

    component.text = 'hello world';
    component.isOnline = false;
    component.isVowels = false;
    component.analyzeText();

    expect(component.analysisHistory.length).toBe(1);
    expect(component.analysisHistory[0].text).toBe('hello world');
    expect(component.analysisHistory[0].isVowels).toBe(false);
    expect(component.analysisHistory[0].result).toContain(
      "Letter 'H' appears 1 times"
    );
  });

  it('should render analysis results', () => {
    component.analysisResult = [
      "Letter 'H' appears 1 times",
      "Letter 'E' appears 1 times",
      "Letter 'L' appears 3 times",
      "Letter 'O' appears 2 times",
      "Letter 'W' appears 1 times",
      "Letter 'R' appears 1 times",
      "Letter 'D' appears 1 times",
    ];

    fixture.detectChanges();

    const analysisResultDiv = fixture.debugElement.queryAll(
      By.css('div div div')
    );
    expect(analysisResultDiv.length).toBe(7);
    expect(analysisResultDiv[0].nativeElement.textContent).toContain(
      "Letter 'H' appears 1 times"
    );
    expect(analysisResultDiv[1].nativeElement.textContent).toContain(
      "Letter 'E' appears 1 times"
    );
    expect(analysisResultDiv[2].nativeElement.textContent).toContain(
      "Letter 'L' appears 3 times"
    );
  });
});
