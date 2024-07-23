import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private userLocation: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getLocation();
    // Polling lokasi setiap 10 detik
    setInterval(() => this.getLocation(), 10000);
  }

  getLocation() {
    const userId = 1; // Ganti dengan ID pengguna yang relevan
    this.http
      .get(
        `https://798d3f60-5f0d-4ac4-86ef-1e70e93dd969-00-2d2hykzs9a0zg.worf.replit.dev/public/get-location.php?user_id=${userId}`
      )
      .subscribe(
        (data: any) => {
          this.userLocation = data;
          console.log('Location:', this.userLocation);
          if (this.userLocation.status === 'success') {
            // Panggil updateMap jika peta sudah diinisialisasi
            if (this.map) {
              this.updateMap();
            } else {
              this.initializeMap();
            }
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  initializeMap() {
    if (!this.userLocation || !this.userLocation.location) return;

    const lat = parseFloat(this.userLocation.location.latitude);
    const lng = parseFloat(this.userLocation.location.longitude);

    // Inisialisasi peta
    this.map = L.map('map').setView([lat, lng], 13);

    // Tambahkan tile layer ke peta
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Definisikan ikon default secara eksplisit
    const defaultIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41], // ukuran ikon
      iconAnchor: [12, 41], // titik jangkar ikon
      popupAnchor: [1, -34], // titik jangkar popup relatif terhadap ikon
      shadowSize: [41, 41], // ukuran bayangan
    });

    // Tambahkan marker di lokasi dengan ikon default
    this.marker = L.marker([lat, lng], { icon: defaultIcon })
      .addTo(this.map)
      .bindPopup(
        `User Location: ${this.userLocation.location.user_location}<br>Latitude: ${lat}<br>Longitude: ${lng}`
      )
      .openPopup();
  }

  updateMap() {
    if (!this.userLocation || !this.userLocation.location || !this.map) return;

    const lat = parseFloat(this.userLocation.location.latitude);
    const lng = parseFloat(this.userLocation.location.longitude);

    // Perbarui posisi peta dan marker
    this.map.setView([lat, lng], 13);

    if (this.marker) {
      this.marker
        .setLatLng([lat, lng])
        .bindPopup(
          `User Location: ${this.userLocation.location.user_location}<br>Latitude: ${lat}<br>Longitude: ${lng}`
        )
        .openPopup();
    } else {
      // Jika marker belum ada, tambahkan marker baru
      this.marker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(
          `User Location: ${this.userLocation.location.user_location}<br>Latitude: ${lat}<br>Longitude: ${lng}`
        )
        .openPopup();
    }
  }
}
