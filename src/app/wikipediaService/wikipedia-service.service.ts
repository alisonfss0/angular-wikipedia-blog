import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { convert } from 'html-to-text';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WikipediaService {
  private cacheKey = 'wikipediaCache';
  private cacheExpiry = 60000; //  1 minutes in milliseconds

  private pagesSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Fetches a list of random pages from Wikipedia and caches the result for a specified amount of time.
   *
   * @returns An observable that emits the list of random pages.
   */
  fetchRandomPages(): Observable<any> {
    const now = new Date().getTime();
    const cachedData = localStorage.getItem(this.cacheKey);
    const cachedDataParsed = cachedData ? JSON.parse(cachedData) : null;

    if (
      cachedDataParsed &&
      now - cachedDataParsed.timestamp < this.cacheExpiry
    ) {
      // Emit the cached data to subscribers
      this.pagesSubject.next(cachedDataParsed.data);
      return this.pagesSubject.asObservable();
    } else {
      return this.http
        .get(
          environment.corsProxyUrl +
            'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=10&prop=pageimages|extracts&piprop=original&exintro=2&format=json'
        )
        .pipe(
          tap((data) => {
            const pages = this.extractPages(data);
            localStorage.setItem(
              this.cacheKey,
              JSON.stringify({ data: pages, timestamp: now })
            );
            // Emit the new data to subscribers
            this.pagesSubject.next(pages);
          }),
          // Map the response to the extracted pages
          map((data) => this.extractPages(data))
        );
    }
  }

  /**
   * Extracts relevant information from the given wikipedia api response and returns an array of page objects.
   *
   * @param data The wikipedia api response to extract pages from
   * @returns An array of page objects, each containing the pageid, title, extract, url, and imageUrl
   */

  private extractPages(data: any): any[] {
    const pages = [];
    for (const pageId in data.query.pages) {
      const page = data.query.pages[pageId];
      const plainText = convert(page.extract, {
        wordwrap: false,
      });
      pages.push({
        pageid: page.pageid,
        title: page.title,
        extract: plainText,
        url: `https://en.wikipedia.org/?curid=${page.pageid}`,
        imageUrl: page.original ? page.original.source : undefined,
      });
    }
    return pages;
  }
}
