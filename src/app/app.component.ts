import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextAnalyzerComponent } from './text-analyzer/text-analyzer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TextAnalyzerComponent,
    MatToolbarModule,
    UpperCasePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'text-analyzer-angular';
}
