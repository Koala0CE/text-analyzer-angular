import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private readonly apiUrl = 'http://localhost:8080/api/analyze';

  constructor(private http: HttpClient) {}

  /**
   * Analyzes the provided text offline by counting the occurrence of either vowels or consonants.
   * @param text - The text to analyze.
   * @param analyzeVowels - Boolean indicating whether to analyze vowels (true) or consonants (false).
   * @returns A formatted string containing the analysis results.
   */

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

  /**
   * Analyzes the provided text online by sending a request to the backend API.
   * @param text - The text to analyze.
   * @param isVowels - Boolean indicating whether to analyze vowels (true) or consonants (false).
   * @returns An observable that emits the analysis results as a formatted string.
   */
  analyzeTextOnline(text: string, isVowels: boolean): Observable<string> {
    // Encode parameters to avoid issues with special characters
    const encodedText = encodeURIComponent(text);
    const url = `${this.apiUrl}?text=${encodedText}&isVowels=${isVowels}`;

    return this.http.get<any>(url).pipe(
      catchError(this.handleError),
      map((response) => {
        // Convert the response object to a string
        if (typeof response === 'object') {
          return `Online Analysis:\n\n${Object.entries(response)
            .map(([char, count]) => `Letter '${char}' appears ${count} times`)
            .join('\n')}`;
        }
        return `Online Analysis:\n\n${response}`;
      })
    );
  }

  /**
   * Helper method to count the occurrences of specified characters in the given text.
   * @param text - The text to analyze.
   * @param characters - A string of characters to count in the text.
   * @returns An object with characters as keys and their counts as values.
   */
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

  /**
   * Error handling method for HTTP requests.
   * @param error - The HTTP error response.
   * @returns An observable that emits a formatted error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
