import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  query = '';
  results = signal<any[]>([]);
  loading = signal(false);
  selectedStock = signal<any | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTrending();
  }

  loadTrending() {
    this.loading.set(true);
    this.http.get<any[]>('http://localhost:8080/api/stocks').subscribe({
      next: (res) => {
        this.results.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() {
    if (this.query.length === 0) {
      this.loadTrending();
      return;
    }


    this.loading.set(true);
    this.http.get<any[]>(`http://localhost:8080/api/stocks/search?name=${this.query}`).subscribe({
      next: (res) => {
        this.results.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openDetails(item: any) {
    this.selectedStock.set(item);
  }

  closeDetails() {
    this.selectedStock.set(null);
  }
}
