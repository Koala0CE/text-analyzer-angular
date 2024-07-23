import { Component } from '@angular/core';
import { TextAnalyzerService } from '../text-analyzer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';

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
    MatInputModule,
    MatGridListModule,
    MatRadioModule,
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.scss'],
})
export class TextAnalyzerComponent {
  // The text input to be analyzed
  text: string = '';
  // The result of the analysis
  analysisResult: string[] = [];
  // The history of all analyses performed
  analysisHistory: Array<{ text: string; isVowels: boolean; result: string }> =
    [];
  // Loading state to show progress indicator
  isLoading: boolean = false;
  // Flag to toggle between online and offline mode
  isOnline: boolean = false;
  // Error message if an error occurs
  error: string | null = null;
  // Flag to determine whether to analyze vowels or consonants
  isVowels: boolean = true; // Default to vowels; true for vowels, false for consonants

  constructor(private textAnalyzerService: TextAnalyzerService) {}

  /**
   * Analyzes the text either online or offline based on the isOnline flag.
   * If online, sends a request to the backend API. If offline, processes the text locally.
   */
  analyzeText(): void {
    this.isLoading = true; // Show loading indicator
    this.error = null; // Reset any previous errors

    // Check if analysis should be performed online
    if (this.isOnline) {
      // Perform online analysis by calling the service method
      this.textAnalyzerService
        .analyzeTextOnline(this.text, this.isVowels)
        .subscribe({
          next: (result) => {
            // Split result into lines for display
            this.analysisResult = result.split('\n');
            this.isLoading = false;

            // Save the result in history
            this.analysisHistory.push({
              text: this.text,
              isVowels: this.isVowels,
              result: result,
            });
          },
          error: (err) => {
            // Handle errors
            this.error = err;
            this.isLoading = false; // Hide loading indicator
          },
        });
      // Log the data being processed offline
      // } else {
      //   console.log('Processing data offline:', {
      //     text: this.text,
      //     isVowels: this.isVowels,
      //   });

      // Perform offline analysis by calling the service method
      const result = this.textAnalyzerService.analyzeTextOffline(
        this.text,
        this.isVowels
      );
      this.analysisResult = result.split('\n');
      this.isLoading = false; // Hide loading indicator

      // Save the result in history
      this.analysisHistory.push({
        text: this.text,
        isVowels: this.isVowels,
        result: result,
      });
    }
  }
}
