import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private readonly apiUrl = 'http://localhost:8080/api/analyze';

  constructor(private http: HttpClient) {}

  // Method to analyze text offline
  analyzeTextOffline(text: string, analyzeVowels: boolean): string {
    const vowels = 'aeiouAEIOU';
    const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';

    const characterSet = analyzeVowels ? vowels : consonants;
    const counts = this.countCharacters(text, characterSet);

    // Format results
    const results = Object.entries(counts)
      .map(([char, count]) => `Letter '${char}' appears ${count} times`)
      .join('\n');

    return `Offline Analysis:\n\n${results}`;
  }

  // Method to analyze text online using the backend API
  analyzeTextOnline(text: string, isVowels: boolean): Observable<string> {
    // Encode parameters to avoid issues with special characters
    const encodedText = encodeURIComponent(text);
    const url = `${this.apiUrl}?text=${encodedText}&isVowels=${isVowels}`;

    return this.http.get<any>(url).pipe(
      catchError(this.handleError),
      map((response) => {
        // Convert the response object to a string
        if (typeof response === 'object') {
          // Assuming response is in the format of a map of letters to counts
          return `Online Analysis:\n\n${Object.entries(response)
            .map(([char, count]) => `Letter '${char}' appears ${count} times`)
            .join('\n')}`;
        }
        return `Online Analysis:\n\n${response}`;
      })
    );
  }

  // Helper method to count characters
  private countCharacters(
    text: string,
    characters: string
  ): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const char of text) {
      if (characters.includes(char)) {
        const upperChar = char.toUpperCase();
        counts[upperChar] = (counts[upperChar] || 0) + 1;
      }
    }
    return counts;
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle different error types accordingly
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
