// Inisialisasi keranjang belanja dari localStorage
let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCart() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(product, quantity) {
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    // Item sudah ada di keranjang, update kuantitas
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Tambahkan item baru ke keranjang
    cart.push({ ...product, quantity: quantity });
  }
  saveCart();
  updateCartDisplay(); // Perbarui tampilan ikon keranjang di header
}

// Fungsi untuk memperbarui kuantitas item di keranjang
function updateCartItemQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    if (item.quantity <= 0) {
      removeFromCart(productId); // Hapus jika kuantitas 0 atau kurang
    }
    saveCart();
    updateCartDisplay();
  }
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartDisplay();
}

// Fungsi untuk memperbarui tampilan jumlah item di ikon keranjang header
function updateCartDisplay() {
  const cartCountElement = document.getElementById("cart-item-count");
  if (cartCountElement) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? "flex" : "none"; // Tampilkan/sembunyikan berdasarkan jumlah
  }
}

// Panggil updateCartDisplay saat DOM selesai dimuat untuk inisialisasi
document.addEventListener("DOMContentLoaded", updateCartDisplay);

// --- Logika untuk Halaman Produk (product.html) dan Beranda (index.html) ---
document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk membuat HTML card produk
  function createProductCard(product) {
    return `
      <div class="group flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div class="relative">
          <div class="aspect-square overflow-hidden rounded-t-xl">
            <img class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                 src="${product.image}"
                 alt="${product.name}">
          </div>
        </div>

        <div class="p-4 flex-grow">
          <h3 class="font-semibold text-lg text-black mb-1">
            ${product.name}
          </h3>
          <p class="text-sm text-gray-600 mb-2">
            ${product.tastingNotes}
          </p>
          <div class="flex justify-between items-center mt-2">
            <div>
              <div class="flex justify-between items-center text-xs text-gray-600">
                <span class="mr-2">Origin:</span>
                <span class="font-medium text-black">${product.origin}</span>
              </div>
              <div class="flex justify-between items-center text-xs text-gray-600">
                <span class="mr-2">Region:</span>
                <span class="font-medium text-black">${product.region}</span>
              </div>
            </div>
            <p class="font-bold text-lg text-black">
              Rp ${product.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div class="p-4 pt-0">
          <a class="block w-full py-2 px-4 text-center text-sm font-medium rounded-lg bg-[#6D3D18] hover:bg-[#5A3214] text-white transition-colors duration-200"
             href="product-detail.html?id=${product.id}">
            Lihat Detail
          </a>
        </div>
      </div>
    `;
  }

  // Fungsi untuk memuat produk ke dalam container yang ditentukan
  function loadProducts(containerId, productsToLoad) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = ""; // Bersihkan konten yang ada
      productsToLoad.forEach((product) => {
        container.insertAdjacentHTML("beforeend", createProductCard(product));
      });
    }
  }

  // --- Logika untuk index.html ---
  const homeProductListContainer = document.getElementById("product-list-home");
  if (homeProductListContainer) {
    // Muat subset produk untuk halaman beranda (misalnya, 6 produk pertama)
    const featuredProducts = productsData.slice(0, 6);
    loadProducts("product-list-home", featuredProducts);
  }

  // --- Logika untuk product.html ---
  const allProductListContainer = document.getElementById("all-products-grid");
  if (allProductListContainer) {
    // Muat semua produk untuk halaman daftar produk
    loadProducts("all-products-grid", productsData);

    const searchInput = document.querySelector('input[placeholder="Cari produk..."]');
    const filterSelect = document.querySelector("select");

    function applyFilters() {
      let filteredProducts = [...productsData]; // Mulai dengan salinan baru dari semua produk

      // Terapkan filter pencarian
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(
          (product) => product.name.toLowerCase().includes(searchTerm) || product.tastingNotes.toLowerCase().includes(searchTerm) || product.origin.toLowerCase().includes(searchTerm) || product.region.toLowerCase().includes(searchTerm)
        );
      }

      // Terapkan filter sortir
      const sortOption = filterSelect.value;
      if (sortOption === "Harga: Rendah ke Tinggi") {
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortOption === "Harga: Tinggi ke Rendah") {
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortOption === "Populer") {
        // Untuk "Populer", kita bisa mengurutkan berdasarkan nama untuk simulasi
        // Dalam proyek nyata, ini akan berdasarkan metrik popularitas (misal: jumlah penjualan)
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      loadProducts("all-products-grid", filteredProducts);
    }

    // Tambahkan event listener untuk pencarian dan filter
    searchInput.addEventListener("input", applyFilters);
    filterSelect.addEventListener("change", applyFilters);
  }
});

// --- Logika untuk Halaman Blog (blog.html dan blog-detail.html) ---
// Data blog (dipindahkan ke sini agar terpusat)
// HAPUS BAGIAN INI:
/*
const blogPostsData = [
  {
    id: "artikel-1",
    title: "Rahasia Menyeduh Kopi Nikmat di Rumah",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=768&auto=format&fit=crop",
    excerpt: "Pelajari tips dan trik untuk menghasilkan secangkir kopi yang sempurna setiap pagi.",
    author: "Admin",
    date: "12 Januari 2025",
    content:
      "<p>Menyeduh kopi di rumah bisa menjadi ritual yang menyenangkan dan memuaskan. Dengan beberapa tips sederhana, Anda bisa meningkatkan kualitas seduhan Anda secara drastis.</p><p>Pertama, pastikan Anda menggunakan biji kopi segar yang baru digiling. Biji kopi yang baru digiling akan memberikan aroma dan rasa yang jauh lebih kaya. Kedua, perhatikan rasio kopi dan air. Umumnya, rasio 1:15 hingga 1:18 (1 gram kopi untuk 15-18 ml air) adalah titik awal yang baik. Ketiga, suhu air sangat krusial. Air dengan suhu antara 90-96°C (195-205°F) adalah ideal untuk ekstraksi optimal. Terlalu panas akan membuat kopi pahit, terlalu dingin akan membuat kopi hambar.</p><p>Eksperimenlah dengan metode seduh yang berbeda, seperti pour-over, French press, atau AeroPress, untuk menemukan favorit Anda. Setiap metode akan menonjolkan karakteristik rasa yang berbeda dari biji kopi yang sama. Jangan takut untuk mencoba hal baru dan nikmati perjalanan Anda dalam dunia kopi!</p>",
  },
  {
    id: "artikel-2",
    title: "Perjalanan Kopi Indonesia: Dari Kebun ke Cangkir",
    image: "https://images.unsplash.com/photo-1559496412-77a7b7767572?q=80&w=768&auto=format&fit=crop",
    excerpt: "Menjelajahi kekayaan kopi nusantara dan proses di baliknya.",
    author: "PojokCoffee Tim",
    date: "20 Januari 2025",
    content:
      "<p>Indonesia adalah salah satu produsen kopi terbesar di dunia, dengan beragam varietas dan profil rasa yang unik dari setiap daerah. Dari Gayo di Aceh hingga Bajawa di Flores, setiap biji kopi memiliki cerita tersendiri.</p><p>Perjalanan kopi dimulai dari kebun, di mana biji kopi dipanen dengan hati-hati. Kemudian, biji-biji ini melalui proses pasca-panen yang berbeda, seperti proses basah (washed), proses kering (natural), atau semi-washed, yang semuanya berkontribusi pada profil rasa akhir. Setelah itu, biji kopi di-roasting dengan presisi untuk mengeluarkan potensi rasa terbaiknya. Terakhir, kopi siap diseduh dan dinikmati, membawa Anda pada perjalanan rasa yang luar biasa.</p><p>Kami di PojokCoffee bangga menjadi bagian dari perjalanan ini, bekerja sama dengan petani lokal untuk membawa kopi terbaik Indonesia langsung ke cangkir Anda.</p>",
  },
];
*/

// Fungsi untuk membuat card blog
function createBlogCard(post) {
  return `
    <div class="group flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div class="relative">
        <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl">
          <img class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
               src="${post.image}"
               alt="${post.title}">
        </div>
      </div>
      <div class="p-4 flex-grow">
        <h3 class="font-semibold text-lg text-black mb-1">
          <a href="blog-detail.html?id=${post.id}" class="hover:text-[#6D3D18]">
            ${post.title}
          </a>
        </h3>
        <p class="text-sm text-gray-600 mb-2">
          ${post.excerpt}
        </p>
        <p class="text-xs text-gray-500">
          Oleh: ${post.author} | ${post.date}
        </p>
      </div>
      <div class="p-4 pt-0">
        <a class="block w-full py-2 px-4 text-center text-sm font-medium rounded-lg bg-[#6D3D18] hover:bg-[#5A3214] text-white transition-colors duration-200"
           href="blog-detail.html?id=${post.id}">
          Baca Selengkapnya
        </a>
      </div>
    </div>
  `;
}

// Logika untuk blog.html
// HAPUS BAGIAN INI (akan dipindahkan ke blog.html):
/*
document.addEventListener("DOMContentLoaded", function () {
  const blogListGrid = document.getElementById("blog-list-grid");
  if (blogListGrid) {
    blogListGrid.innerHTML = ""; // Clear existing content
    blogPostsData.forEach((post) => {
      blogListGrid.insertAdjacentHTML("beforeend", createBlogCard(post));
    });
  }
});
*/

// Logika untuk blog-detail.html
// HAPUS BAGIAN INI (akan dipindahkan ke blog-detail.html):
/*
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const post = blogPostsData.find((p) => p.id === postId);

  if (post) {
    const blogImage = document.getElementById("blog-image");
    const blogTitle = document.getElementById("blog-title");
    const blogAuthor = document.getElementById("blog-author");
    const blogDate = document.getElementById("blog-date");
    const blogContent = document.getElementById("blog-content");

    if (blogImage) blogImage.src = post.image;
    if (blogImage) blogImage.alt = post.title;
    if (blogTitle) blogTitle.textContent = post.title;
    if (blogAuthor) blogAuthor.textContent = post.author;
    if (blogDate) blogDate.textContent = post.date;
    if (blogContent) blogContent.innerHTML = post.content; // Menggunakan innerHTML untuk konten HTML
  } else {
    const blogPostContainer = document.getElementById("blog-post-container");
    if (blogPostContainer) {
      blogPostContainer.innerHTML = '<p class="text-center text-xl text-red-500">Artikel tidak ditemukan.</p>';
    }
  }
});
*/
