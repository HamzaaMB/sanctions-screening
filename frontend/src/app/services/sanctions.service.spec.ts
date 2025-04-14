import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SanctionsService } from './sanctions.service';

describe('SanctionsService', () => {
  let service: SanctionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SanctionsService]
    });
    service = TestBed.inject(SanctionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchSanctions', () => {
    it('should make GET request with correct parameters', () => {
      const mockQuery = 'test';
      const mockPage = 1;
      const mockPageSize = 5;
      const mockResponse = { results: [], count: 0 };

      service.searchSanctions(mockQuery, mockPage, mockPageSize).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        req => req.url === 'http://localhost:8000/api/search/' &&
          req.params.get('name') === mockQuery &&
          req.params.get('page') === mockPage.toString() &&
          req.params.get('page_size') === mockPageSize.toString()
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('saveRiskDecision', () => {
    it('should make POST request with correct data', () => {
      const mockData = {
        entity_id: '123',
        source: 'test',
        source_id: '456',
        target_type: 'individual',
        matched_name: 'Test Name',
        risk_score: 50,
        risk_level: 'medium',
        listed_on: '2023-01-01'
      };

      service.saveRiskDecision(mockData).subscribe();

      const req = httpMock.expectOne('http://localhost:8000/api/save-decision/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush({});
    });
  });
});