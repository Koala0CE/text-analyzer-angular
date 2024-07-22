import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TextAnalyzerService } from '../text-analyzer.service';

describe('TextAnalyzerService', () => {
  let service: TextAnalyzerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TextAnalyzerService],
    });
    service = TestBed.inject(TextAnalyzerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return offline analysis result', () => {
    const result = service.analyzeTextOffline('test');
    expect(result).toBe('Offline Analysis: test');
  });

  it('should handle online analysis', () => {
    const dummyResponse = 'Online Analysis: test';
    service.analyzeTextOnline('test').subscribe((response) => {
      expect(response).toBe(dummyResponse);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/analyze');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should handle error for online analysis', () => {
    service.analyzeTextOnline('test').subscribe(
      () => fail('should have failed with the network error'),
      (error) => {
        expect(error).toBe(
          'Server returned code: 500, error message is: Internal Server Error'
        );
      }
    );
    const req = httpMock.expectOne('http://localhost:8080/api/analyze');
    req.flush('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
