import { Component, Input } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [PageTitleComponent, RouterModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  constructor(private router: Router) {}

  @Input() title: string = 'Loading...';
  @Input() photo_url: string = environment.notFoundPlaceholderImage || '';
  @Input() content_url: string = '';
  @Input() content_text: string = 'Loading...';

  ngOnInit() {
    const data = history.state;

    if (!data.title || !data.content_url) this.router.navigateByUrl('/');

    this.title = data.title;
    this.photo_url = data.photo_url || this.photo_url;
    this.content_url = data.content_url;
    this.content_text = data.content_text;
  }
}
