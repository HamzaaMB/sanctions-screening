import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SanctionsService } from '../../services/sanctions.service';
import { Sanction, RiskLevel } from '../../models/sanction.model';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  @ViewChild('modalTemplate') modalTemplate: any;

  successMessage: string = '';
  errorMessage: string = '';

  searchQuery: string = '';
  sanctions: Sanction[] = [];
  currentPage = 1;
  totalResults = 0;
  pageSize = 5;
  selectedEntity: Sanction | null = null;
  selectedRisk: string = '';
  riskCategories = ['low', 'medium', 'high'];
  riskLabels: Record<string, string> = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };
  displayedColumns: string[] = ['entity', 'source', 'matchedName', 'riskScore', 'riskLevel', 'action'];
  hasSearched = false;
  isLoading = false;

  constructor(
    private sanctionsService: SanctionsService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  searchSanctions(page = 1) {
    if (!this.searchQuery.trim()) return;
    this.isLoading = true;
    this.sanctionsService.searchSanctions(this.searchQuery, page, this.pageSize)
      .subscribe({
        next: (response) => {
          this.sanctions = response.results;
          this.totalResults = response.count;
          this.currentPage = page;
          this.hasSearched = true;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Failed to load sanctions data', 'Error');
          this.hasSearched = true;
          this.isLoading = false
          this.sanctions = [];
          this.totalResults = 0;
        }
      });
  }

  clearSearch() {
    this.searchQuery = '';
    this.sanctions = [];
    this.hasSearched = false;
    this.totalResults = 0;
    this.currentPage = 1;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.searchSanctions(event.pageIndex + 1);
  }

  openModal(entity: any) {
    this.selectedEntity = entity;
    this.selectedRisk = entity.risk_level;

    this.dialog.open(this.modalTemplate, {
      width: '500px',
      disableClose: true
    });
  }

  saveRiskDecision() {
    if (!this.selectedEntity) return;

    const payload = {
      entity_id: this.selectedEntity.entity_id,
      source: this.selectedEntity.source,
      source_id: this.selectedEntity.source_id,
      target_type: this.selectedEntity.target_type,
      matched_name: this.selectedEntity.matched_name,
      risk_score: this.selectedEntity.risk_score,
      risk_level: this.selectedRisk,
      listed_on: this.selectedEntity.listed_on
    };

    this.sanctionsService.saveRiskDecision(payload).subscribe({
      next: () => {
        this.successMessage = 'Risk decision saved successfully!';
        this.errorMessage = '';

        setTimeout(() => {
          this.successMessage = '';
          this.dialog.closeAll();
        }, 2500);
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Failed to save decision';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
  
  closeModal() {
    this.dialog.closeAll();
  }

  getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      default: return 'primary';
    }
  }
}