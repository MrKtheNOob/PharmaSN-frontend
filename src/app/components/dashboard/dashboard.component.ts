import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stocks = signal<any[]>([]);
  searchQuery = '';
  searchResults = signal<any[]>([]);
  selectedMedicine = signal<any | null>(null);
  newQty: number | null = null;
  newPrice: number | null = null;

  lowStockCount = computed(() => {
    return this.stocks().filter(s => s.quantity < 10).length;
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.http.get<any[]>('http://localhost:8080/api/stocks/my-inventory').subscribe(res => {
      this.stocks.set(res);
    });
  }

  searchMedicines() {
    if (this.searchQuery.length < 2) {
      this.searchResults.set([]);
      return;
    }
    this.http.get<any[]>(`http://localhost:8080/api/medicaments/search?query=${this.searchQuery}`).subscribe(res => {
      this.searchResults.set(res);
    });
  }

  selectMedicine(m: any) {
    this.selectedMedicine.set(m);
    this.searchResults.set([]);
    this.searchQuery = '';
  }

  addToInventory() {
    if (!this.selectedMedicine() || this.newQty == null || this.newPrice == null) return;

    const body = {
      medicamentId: this.selectedMedicine()?.id,
      quantity: this.newQty,
      price: this.newPrice
    };

    this.http.post('http://localhost:8080/api/stocks', body).subscribe({
      next: () => {
        this.loadInventory();
        this.selectedMedicine.set(null);
        this.newQty = null;
        this.newPrice = null;
      }
    });
  }

  update(item: any) {
    const url = `http://localhost:8080/api/stocks/${item.id}?quantity=${item.quantity}&price=${item.price}`;
    this.http.patch(url, {}).subscribe({
      next: () => alert('Mise à jour réussie !'),
      error: () => alert('Erreur lors de la mise à jour')
    });
  }

  delete(id: number) {
    if (!confirm('Voulez-vous supprimer ce produit de votre stock ?')) return;
    this.http.delete(`http://localhost:8080/api/stocks/${id}`).subscribe(() => {
      this.loadInventory();
    });
  }
}
