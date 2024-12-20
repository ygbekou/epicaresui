import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-featured-blogs',
  templateUrl: './featured-blogs.component.html',
  styleUrls: ['./featured-blogs.component.scss']
})
export class FeaturedBlogsComponent implements OnInit {
  @Input('properties') featuredBlogs;
  constructor() { }

  ngOnInit() {
  }

}
