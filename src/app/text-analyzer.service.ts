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
  analyzeTextOffline(text: string): string {
    const vowels = 'aeiouAEIOU';
    const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';

    const vowelCounts = this.countCharacters(text, vowels);
    const consonantCounts = this.countCharacters(text, consonants);

    // Format results
    const vowelResults = Object.entries(vowelCounts)
      .map(([char, count]) => `Letter '${char}' appears ${count} times`)
      .join('\n');

    const consonantResults = Object.entries(consonantCounts)
      .map(([char, count]) => `Letter '${char}' appears ${count} times`)
      .join('\n');

    return `Offline Analysis:\n\n${vowelResults}\n\n${consonantResults}`;
  }

  // Method to analyze text online using the backend API
  analyzeTextOnline(text: string): Observable<string> {
    return this.http.post<any>(this.apiUrl, { text }).pipe(
      catchError(this.handleError),
      map((response) => {
        // Convert the response object to a string
        if (typeof response === 'object') {
          // Assuming response has a 'message' property or similar
          return `Online Analysis:\n\n${
            response.message || JSON.stringify(response)
          }`;
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
