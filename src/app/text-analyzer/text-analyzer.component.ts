import { Component, OnDestroy } from '@angular/core';
import { TextAnalyzerService } from '../text-analyzer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-text-analyzer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
  ],
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
