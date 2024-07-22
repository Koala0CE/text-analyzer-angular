import { Component, OnDestroy } from '@angular/core';
import { TextAnalyzerService } from '../text-analyzer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-text-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.scss'],
})
export class TextAnalyzerComponent implements OnDestroy {
  text: string = '';
  analysisResult: string[] = [];
  error: string | null = null;
  isOnline: boolean = false;
  isLoading: boolean = false; // New loading state indicator
  private subscription: Subscription = new Subscription();

  constructor(private textAnalyzerService: TextAnalyzerService) {}

  analyzeText(): void {
    this.isLoading = true; // Indicate loading state
    if (this.isOnline) {
      this.subscription.add(
        this.textAnalyzerService.analyzeTextOnline(this.text).subscribe({
          next: (result) => {
            this.analysisResult = [result, ...this.analysisResult]; // Immutable update pattern
            this.error = null;
            this.isLoading = false; // Reset loading state
          },
          error: (error) => {
            this.handleError(error);
            this.isLoading = false; // Reset loading state
          },
        })
      );
    } else {
      const result = this.textAnalyzerService.analyzeTextOffline(this.text);
      this.analysisResult = [result, ...this.analysisResult]; // Immutable update pattern
      this.error = null;
      this.isLoading = false; // Reset loading state
    }
  }

  toggleMode(): void {
    this.isOnline = !this.isOnline;
  }

  private handleError(error: string): void {
    this.error = error;
    this.analysisResult = []; // Clear previous results on error
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
