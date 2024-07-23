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
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatRadioModule,
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.scss'],
})
export class TextAnalyzerComponent {
  text: string = '';
  analysisResult: string[] = [];
  isLoading: boolean = false;
  isOnline: boolean = false;
  error: string | null = null;
  isVowels: boolean = true; // Default to vowels ; true for vowels, false for consonants

  constructor(private textAnalyzerService: TextAnalyzerService) {}

  analyzeText(): void {
    this.isLoading = true;
    this.error = null;

    // Log the data being sent to the backend
    console.log('Sending data to backend:', {
      text: this.text,
      isVowels: this.isVowels,
    });

    this.textAnalyzerService
      .analyzeTextOnline(this.text, this.isVowels)
      .subscribe({
        next: (result) => {
          // Split result into lines for display
          this.analysisResult = result.split('\n');
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err;
          this.isLoading = false;
        },
      });
  }
}
