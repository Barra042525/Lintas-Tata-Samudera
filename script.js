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
      const nomorWA = "6289626400913";

      const nama = document.getElementById('nama').value;
      const rute = document.getElementById('rute').value;
      const jenisBarang = document.getElementById('jenisBarang').value;

      const teksPesan = `Halo Admin LINTAS TATA SAMUDRA, saya ingin meminta informasi tarif pengiriman:\n\n` +
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
      const nomorWA = "62895350718365";
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
  // 4. HANDLER MONITORING CEK RESI (GOOGLE SHEETS API)
  // ==========================================
  const resiForm = document.getElementById("resiForm");
  const noResiInput = document.getElementById("noResi") || document.getElementById("inputResi");
  const trackingResult = document.getElementById("trackingResult") || document.getElementById("resultResi");

  const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycby51HkDQG-sIlBa0hC_tKut2amG0upZcrTXtxXmv4xtjpF98AT2wGX4hYpeUaB3G8MyGg/exec";

  if (resiForm) {
    resiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const noResi = noResiInput ? noResiInput.value.trim() : "";

      if (!noResi || !trackingResult) return;

      trackingResult.style.display = "block";
      trackingResult.innerHTML = '<p style="color: #64748b;">Sedang Memproses Data Resi</p>';

      fetch(GOOGLE_SHEET_API_URL)
        .then((response) => {
          if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheets");
          return response.json();
        })
        .then((data) => {
          // Bersihkan spasi & jadikan kapital untuk pencocokan fleksibel
          const cleanInput = noResi.replace(/\s+/g, '').toUpperCase();

          // Cari key yang cocok di objek data dari Apps Script
          const matchedKey = Object.keys(data).find(
            (key) => key.replace(/\s+/g, '').toUpperCase() === cleanInput
          );

     if (matchedKey) {
      const item = data[matchedKey];
      let historyHTML = (item.history || [])
        .map(h => {
          // 1. Ekstrak teks dalam kurung siku [...] sebagai tanggal
          const matchTanggal = h.match(/\[(.*?)\]/);
          let tanggalTeks = "";
          let statusTeks = h;

          if (matchTanggal) {
            // Ambil tanggal murni tanpa kurung siku
            const rawDateStr = matchTanggal[1];
            // Ambil teks status setelah kurung siku
            statusTeks = h.replace(/\[.*?\]\s*/, "").trim();

            // Formating tanggal ke format Indonesia yang rapi
            const d = new Date(rawDateStr);
            if (!isNaN(d.getTime())) {
              const tgl = String(d.getDate()).padStart(2, '0');
              const bulanArr = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
              const bulan = bulanArr[d.getMonth()];
              const tahun = d.getFullYear();
              const jam = String(d.getHours()).padStart(2, '0');
              const menit = String(d.getMinutes()).padStart(2, '0');
              
              tanggalTeks = `${tgl} ${bulan} ${tahun} ${jam}:${menit} WIB`;
            } else {
              tanggalTeks = rawDateStr; // Fallback jika bukan objek Date valid
            }
          }

          // 2. Tampilkan tanggal rapi & status saja
          return `
            <div class="timeline-item active">
              <div class="timeline-icon"></div>
              <div class="timeline-title">
                ${tanggalTeks ? `<strong>${tanggalTeks}</strong> - ` : ''}${statusTeks}
              </div>
            </div>`;
        })
        .join("");

            trackingResult.innerHTML = `
              <div class="tracking-header-info">
                <h3>No. Resi: <strong>${matchedKey}</strong></h3>
                <span class="tracking-status-badge">${item.status || "DIPROSES"}</span>
                <p style="font-size: 13px; color: #64748b; margin-top: 8px;">
                  <strong>Pengirim:</strong> ${item.pengirim || "-"} | <strong>Penerima:</strong> ${item.penerima || "-"} | <strong>Tujuan:</strong> ${item.tujuan || "-"}
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
          trackingResult.innerHTML = `<p style="color: #dc2626;">Gagal memuat data resi. Pastikan koneksi internet Anda stabil.</p>`;
        });
    });
  }

  // ==========================================
  // 5. HANDLER DOKUMENTASI & GALERI DINAMIS
  // ==========================================
  const galleryContainer = document.getElementById("galleryContainer");

  if (galleryContainer) {
    fetch("galeri-data.json")
      .then((response) => response.json())
      .then((data) => {
        const activeImages = data.filter((item) => item.active === true);

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

}); // <-- PENUTUP DOMContentLoaded

// ==========================================
// 6. HANDLER CEK ONGKIR WA (FUNGSI GLOBAL)
// ==========================================
function kirimCekOngkirWA() {
  var asal = document.getElementById('asal') ? document.getElementById('asal').value.trim() : '';
  var tujuan = document.getElementById('tujuan') ? document.getElementById('tujuan').value.trim() : '';

  if (asal === '' || tujuan === '') {
    alert('Harap isi Kota Asal dan Kota Tujuan terlebih dahulu!');
    return;
  }

  var noWA = '6289626400913';
  var pesan = 'Halo Admin PT Lintas Tata Samudra, saya ingin cek tarif pengiriman barang:\n' +
              '- Kota Asal: ' + asal + '\n' +
              '- Kota Tujuan: ' + tujuan;

  window.open('https://wa.me/' + noWA + '?text=' + encodeURIComponent(pesan), '_blank');
}
// HANDLER FLOATING WA MULTI-CONTACT
const waToggleBtn = document.getElementById("waToggleBtn");
const waPopup = document.getElementById("waPopup");

if (waToggleBtn && waPopup) {
  waToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    waPopup.classList.toggle("show");
  });

  // Tutup popup jika klik di luar widget
  document.addEventListener("click", function (e) {
    if (!waPopup.contains(e.target) && !waToggleBtn.contains(e.target)) {
      waPopup.classList.remove("show");
    }
  });
}