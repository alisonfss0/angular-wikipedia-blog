import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CatassApiService {
  private baseUrl = 'https://cataas.com/api/cats';
  private CATAAS_IMAGE_COUNT: number = 1300;

  constructor(private http: HttpClient) {}

  /**
   * Fetch a cat image for the given seed number.
   *
   * @param {number} seed - The seed to use for generating the cat image URL.
   * @returns {Observable<string>} An Observable that emits the cat image URL.
   *
   * @throws {Error} If no cat image is found for the given seed, or if there is an error fetching the image.
   */
  fetchCatImage(seed: number): Observable<string> {
    const value = seededRandom(seed, this.CATAAS_IMAGE_COUNT);
    console.log(`seededRandom generated value ${value} for seed ${seed}`);
    const url = `${this.baseUrl}?skip=${Math.round(value)}&limit=1`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && response.length > 0) {
          return `https://cataas.com/cat/${response[0]._id}`;
        } else {
          throw new Error('No cat image found');
        }
      })
    );
  }

  /**
   * Stores a cat image url for a given page ID.
   *
   * @param {number} pageId - The ID of the page to store the image for.
   * @param {string} imageUrl - The URL of the image to store.
   *
   */
  storeCatImage(pageId: number, imageUrl: string): void {
    const catImages = JSON.parse(localStorage.getItem('catImages') || '{}');
    catImages[pageId] = imageUrl;
    localStorage.setItem('catImages', JSON.stringify(catImages));
  }

  /**
   * Retrieves the stored cat image for a given page ID.
   *
   * @param {number} pageId - The ID of the page to retrieve the associated cat image for.
   * @returns {string | null} The stored cat image for the given page ID, or null if not found.
   */
  getStoredCatImage(pageId: number): string | null {
    const catImages = JSON.parse(localStorage.getItem('catImages') || '{}');
    return catImages[pageId] || null;
  }

  /**
   * Fetches and stores cat images for the given page IDs.
   *
   * @param pageIds An array of page IDs to fetch cat images for.
   * @returns An observable that emits when all cat images have been fetched and stored.
   */
  fetchAndStoreCatImages(pageIds: { pageid: number }[]): Observable<void> {
    const catImageObservables = pageIds.map((page) =>
      this.fetchCatImage(page.pageid).pipe(
        map((imageUrl) => {
          this.storeCatImage(page.pageid, imageUrl);
          return undefined;
        })
      )
    );

    return forkJoin(catImageObservables).pipe(map(() => undefined));
  }

  /**
   * Verifies if there are missing cat image urls for the entered page ids in the localstorage, and calls fetchAndStoreCatImages() to fetch and store the ids for the missing images
   *
   * @param pageIds An array of page IDs for which to fetch and store missing cat images.
   * @returns void
   */
  fetchAndStoreMissingCatImages(pageIds: { pageid: number }[]): void {
    const missingImages = pageIds.filter(
      (item) => !this.getStoredCatImage(item.pageid)
    );

    if (missingImages.length > 0) {
      this.fetchAndStoreCatImages(missingImages).subscribe(() => {
        console.log('Fetched and stored missing cat images');
      });
    }
  }
}

/**
 * Generates a random number between 0 (inclusive) and the upperLimit (exclusive) using the seed provided.
 *
 * The algorithm uses the linear congruential method to generate a pseudo-random number.
 *
 * @param seed A number used to initialize the generating sequence.
 * @param upperLimit The upper bound of the random number to be generated (exclusive).
 * @returns A pseudo-random number between 0 (inclusive) and the upperLimit (exclusive).
 */
function seededRandom(seed: number, upperLimit: number): number {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32); //  2^32
  return (((a * seed + c) % m) / m) * upperLimit;
}
