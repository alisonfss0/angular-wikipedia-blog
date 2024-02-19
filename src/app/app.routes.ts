import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ContentComponent } from './pages/content/content.component';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    title: `${environment.blogTitle} - Home`,
  },
  {
    path: 'content',
    component: ContentComponent,
    title: `${environment.blogTitle} - Content`,
  },
];
