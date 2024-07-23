import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TextAnalyzerService } from './text-analyzer.service';
import { AppComponent } from './app.component';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],
      providers: [TextAnalyzerService],
    });
    service = TestBed.inject(TextAnalyzerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should analyze text offline for vowels', () => {
    const result = service.analyzeTextOffline('hello world', true);
    expect(result).toContain("Letter 'E' appears 1 times");
    expect(result).toContain("Letter 'O' appears 2 times");
  });

  it('should analyze text offline for consonants', () => {
    const result = service.analyzeTextOffline('hello world', false);
    expect(result).toContain("Letter 'H' appears 1 times");
    expect(result).toContain("Letter 'L' appears 3 times");
    expect(result).toContain("Letter 'R' appears 1 times");
    expect(result).toContain("Letter 'D' appears 1 times");
  });

  it('should analyze text online', () => {
    const mockResponse = {
      H: 1,
      E: 1,
      L: 3,
      O: 2,
      W: 1,
      R: 1,
      D: 1,
    };

    service.analyzeTextOnline('hello world', true).subscribe((result) => {
      expect(result).toContain("Letter 'H' appears 1 times");
      expect(result).toContain("Letter 'E' appears 1 times");
      expect(result).toContain("Letter 'L' appears 3 times");
      expect(result).toContain("Letter 'O' appears 2 times");
      expect(result).toContain("Letter 'W' appears 1 times");
      expect(result).toContain("Letter 'R' appears 1 times");
      expect(result).toContain("Letter 'D' appears 1 times");
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/analyze?text=hello%20world&isVowels=true'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors', () => {
    const errorMsg = 'An unknown error occurred!';

    service.analyzeTextOnline('hello world', true).subscribe({
      next: () => fail('should have failed with the error'),
      error: (error) => expect(error).toBe(errorMsg),
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/analyze?text=hello%20world&isVowels=true'
    );
    req.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
