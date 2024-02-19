import { Component, OnInit } from '@angular/core';
import { CatassApiService } from '../../cataas-api/catass-api.service';
import { CommonModule } from '@angular/common';
import { CardPostComponent } from '../../components/card-post/card-post.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { WikipediaService } from '../../wikipediaService/wikipedia-service.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, CardPostComponent, PageTitleComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  wikipedia_pages: any[] = [];
  blogTitle: string = environment.blogTitle;

  constructor(
    private _catassAPIService: CatassApiService,
    private _wikipediaService: WikipediaService
  ) {}

  ngOnInit(): void {
    this._wikipediaService.fetchRandomPages().subscribe((pages) => {
      this.wikipedia_pages = pages;
      if (this.wikipedia_pages && this.wikipedia_pages.length > 0) {
        this._catassAPIService.fetchAndStoreMissingCatImages(
          this.wikipedia_pages.map((page) => ({ pageid: page.pageid }))
        );
      }
    });
  }

  getCatImageUrl(storyId: number): string {
    const catImageUrl = this._catassAPIService.getStoredCatImage(storyId);

    return catImageUrl || environment.notFoundPlaceholderImage || '';
  }
}
