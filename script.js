// Function Switch Tab Widget Cek Ongkir / Resi
function switchTab(type) {
  const tabs = document.querySelectorAll('.tab-btn');
  if (tabs.length >= 2) {
    tabs.forEach(tab => tab.classList.remove('active'));
    if (type === 'ongkir') {
      tabs[0].classList.add('active');
      document.getElementById('asal').placeholder = "Kota Asal (ex: Jakarta)";
      document.getElementById('tujuan').placeholder = "Kota Tujuan (ex: Surabaya)";
    } else {
      tabs[1].classList.add('active');
      document.getElementById('asal').placeholder = "Masukkan No. Resi STT";
      document.getElementById('tujuan').placeholder = "Kode Pelanggan (Opsional)";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. SLIDESHOW BACKGROUND HERO DASHBOARD
  // ==========================================
  const heroSection = document.querySelector('.hero-section') || document.querySelector('.hero');

  const heroImages = [
    'hero-kapal.jpg',
    'hero-pesawat.jpg',
    'hero-truck.jpg'
  ];

  let currentImageIndex = 0;

  if (heroSection && heroImages.length > 0) {
    heroSection.style.backgroundImage = `linear-gradient(rgba(13, 44, 84, 0.35), rgba(13, 44, 84, 0.35)), url('${heroImages[0]}')`;

    setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      heroSection.style.backgroundImage = `linear-gradient(rgba(13, 44, 84, 0.35), rgba(13, 44, 84, 0.35)), url('${heroImages[currentImageIndex]}')`;
    }, 4000);
  }

  // ==========================================
  // 2. HANDLER SUBMIT FORM KONSULTASI UTAMA
  // ==========================================
  const waForm = document.getElementById('waForm');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nomorWA = "6289665710803";

      const nama = document.getElementById('nama').value;
      const rute = document.getElementById('rute').value;
      const jenisBarang = document.getElementById('jenisBarang').value;

      const teksPesan = `Halo Admin LINTAS TATA SAMUDERA, saya ingin meminta informasi tarif pengiriman:\n\n` +
        `*Nama Pengirim:* ${nama}\n` +
        `*Rute Pengiriman:* ${rute}\n` +
        `*Detail Barang/Muatan:* ${jenisBarang}`;

      window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(teksPesan)}`, '_blank');
    });
  }

  // ==========================================
  // 3. HANDLER KRITIK & SARAN
  // ==========================================
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nomorWA = "6289665710803";
      const nama = document.getElementById('fbNama').value;
      const wa = document.getElementById('fbWa').value;
      const pesan = document.getElementById('fbPesan').value;

      const teksWA = `Halo Admin, ada kritik & saran baru:\n\n` +
        `*Nama:* ${nama}\n` +
        `*No WA:* ${wa}\n` +
        `*Pesan:* ${pesan}`;

      window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(teksWA)}`, '_blank');
    });
  }

// ==========================================
  // 4. HANDLER MONITORING CEK RESI (resi-data.json)
  // ==========================================
  const resiForm = document.getElementById("resiForm");
  const noResiInput = document.getElementById("noResi") || document.getElementById("inputResi");
  const trackingResult = document.getElementById("trackingResult") || document.getElementById("resultResi");

  if (resiForm) {
    resiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const noResi = noResiInput ? noResiInput.value.trim().toUpperCase() : "";

      if (!noResi || !trackingResult) return;

      trackingResult.style.display = "block";
      trackingResult.innerHTML = '<p style="color: #64748b;">Mencari data resi...</p>';

      fetch("resi-data.json")
        .then((response) => {
          if (!response.ok) throw new Error("Gagal mengambil data");
          return response.json();
        })
        .then((data) => {
          // Cari kunci resi yang cocok (case-insensitive & abaikan spasi)
          const matchedKey = Object.keys(data).find(
            (key) => key.trim().toUpperCase() === noResi
          );

          if (matchedKey) {
            const item = data[matchedKey];
            let historyHTML = item.history
              .map(
                (h) => `
                <div class="timeline-item active">
                  <div class="timeline-icon"></div>
                  <div class="timeline-title">${h}</div>
                </div>`
              )
              .join("");

            trackingResult.innerHTML = `
              <div class="tracking-header-info">
                <h3>No. Resi: <strong>${matchedKey}</strong></h3>
                <span class="tracking-status-badge">${item.status || "DIPROSES"}</span>
                <p style="font-size: 13px; color: #64748b; margin-top: 8px;">
                  <strong>Pengirim:</strong> ${item.pengirim || "-"} | <strong>Penerima:</strong> ${item.penerima || "-"}
                </p>
              </div>
              <div class="timeline-tracking">${historyHTML}</div>
            `;
          } else {
            trackingResult.innerHTML = `
              <div style="padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626;">
                <p>Nomor resi <strong>${noResi}</strong> tidak ditemukan di sistem.</p>
              </div>
            `;
          }
          trackingResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
        })
        .catch((err) => {
          console.error(err);
          trackingResult.innerHTML = `<p style="color: #dc2626;">Gagal memuat data resi. Pastikan file resi-data.json sudah tersedia.</p>`;
        });
    });
  }
  
// Handler Dokumentasi & Galeri Dinamis
const galleryContainer = document.getElementById("galleryContainer");

if (galleryContainer) {
  fetch("galeri-data.json")
    .then((response) => response.json())
    .then((data) => {
      // Filter hanya gambar yang statusnya ACTIVE
      const activeImages = data.filter((item) => item.active === true);

      // Render ke dalam HTML
      galleryContainer.innerHTML = activeImages
        .map(
          (item) => `
          <div class="gallery-card">
            <img src="${item.image}" alt="${item.title}">
            <p>${item.title}</p>
          </div>
        `
        )
        .join("");
    })
    .catch((err) => {
      console.error("Gagal memuat galeri:", err);
    });
}

}); // Penutup DOMContentLoaded yan
