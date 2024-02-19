import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-card-post',
  standalone: true,
  imports: [],
  templateUrl: './card-post.component.html',
  styleUrl: './card-post.component.css',
})
export class CardPostComponent {
  @Input() card_photo_url: string = environment.notFoundPlaceholderImage || '';
  @Input() card_title: string = 'Loading...';
  @Input() card_text: string = '';
  @Input() card_small_text: string = '';
}
