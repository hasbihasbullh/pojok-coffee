// Tampilkan loader saat DOM siap (sebelum semua aset dimuat)
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    // Menunda sedikit tampilan loader untuk menghindari flash konten kosong
    // Ini opsional, tergantung kebutuhan dan performa awal
    setTimeout(() => {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }, 50); // Tunda 50ms
  }
});

// Sembunyikan loader saat seluruh halaman (termasuk aset seperti gambar) selesai dimuat
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0"; // Mulai transisi fade-out
    setTimeout(() => {
      loader.style.display = "none"; // Sembunyikan setelah transisi selesai
    }, 300); // Durasi 300ms (sesuai CSS)
  }
});
