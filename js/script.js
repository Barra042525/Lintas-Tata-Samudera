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
    'assets/hero-kapal.jpg',
    'assets/hero-pesawat.jpg',
    'assets/hero-truck.jpg'
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
  // 4. HANDLER MONITORING CEK RESI (GOOGLE SHEETS)
  // ==========================================
  const resiForm = document.getElementById("resiForm");
  const noResiInput = document.getElementById("noResi") || document.getElementById("inputResi");
  const trackingResult = document.getElementById("trackingResult") || document.getElementById("resultResi");

  // URL DEPLOYMENT APPS SCRIPT TERBARU
  const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzcg1jPLV0vABpl_a0iSG3aXPC2pBe0kWOifC1UXdcgjqRFeCvv_n_kTutevF9-ec_eRA/exec";

  function normalizeResi(str) {
    if (!str) return "";
    return String(str).replace(/[\s\-_]+/g, "").toUpperCase();
  }

  if (resiForm) {
    resiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const noResi = noResiInput ? noResiInput.value.trim() : "";

      if (!noResi || !trackingResult) return;

      trackingResult.style.display = "block";
      trackingResult.innerHTML = '<p style="color: #0284c7; font-weight: bold; text-align: center;">Sedang Memproses Data Resi...</p>';

      const callbackName = "cb_" + Math.floor(Math.random() * 1000000);

      window[callbackName] = function (data) {
        delete window[callbackName];
        const oldScript = document.getElementById(callbackName);
        if (oldScript) oldScript.remove();

        if (!data || data.error) {
          trackingResult.innerHTML = `<p style="color: #dc2626; text-align: center;">Error: ${data ? data.error : 'Gagal memuat data'}</p>`;
          return;
        }

        const targetClean = normalizeResi(noResi);

        const matchedKey = Object.keys(data).find(
          (key) => normalizeResi(key) === targetClean
        );

        if (matchedKey && data[matchedKey]) {
          const item = data[matchedKey];
          let historyHTML = "";

          if (Array.isArray(item.history) && item.history.length > 0) {
            historyHTML = item.history
              .map((h) => {
                const matchTanggal = h.match(/\[(.*?)\]/);
                let tanggalTeks = "";
                let statusTeks = h;

                if (matchTanggal) {
                  const rawDateStr = matchTanggal[1];
                  statusTeks = h.replace(/\[.*?\]\s*/, "").trim();

                  const d = new Date(rawDateStr);
                  if (!isNaN(d.getTime())) {
                    const tgl = String(d.getDate()).padStart(2, "0");
                    const bulanArr = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
                    const bulan = bulanArr[d.getMonth()];
                    const tahun = d.getFullYear();
                    const jam = String(d.getHours()).padStart(2, "0");
                    const menit = String(d.getMinutes()).padStart(2, "0");

                    tanggalTeks = `${tgl} ${bulan} ${tahun} ${jam}:${menit} WIB`;
                  } else {
                    tanggalTeks = rawDateStr;
                  }
                }

                return `
                  <div class="timeline-item active" style="margin-bottom: 12px;">
                    <div class="timeline-icon"></div>
                    <div class="timeline-title" style="font-size: 14px;">
                      ${tanggalTeks ? `<strong>${tanggalTeks}</strong> - ` : ""}${statusTeks}
                    </div>
                  </div>`;
              })
              .join("");
          } else {
            historyHTML = '<div class="timeline-item"><div class="timeline-title">Belum ada riwayat pengiriman.</div></div>';
          }

          let fotoHTML = "";
          let srcUrl = item.foto || item.gambar || item.FOTO || item.GAMBAR || "";

          if (srcUrl && srcUrl.trim() !== "" && srcUrl !== "TIDAK DITEMUKAN" && srcUrl !== "-") {
            srcUrl = srcUrl.trim();

            if (srcUrl.includes("drive.google.com")) {
              const driveIdMatch = srcUrl.match(/d\/([a-zA-Z0-9_-]+)/) || srcUrl.match(/id=([a-zA-Z0-9_-]+)/);
              if (driveIdMatch && driveIdMatch[1]) {
                srcUrl = `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
              }
            }

            fotoHTML = `
              <div style="margin-top: 15px; text-align: center; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="font-weight: bold; margin-bottom: 8px; color: #ffffff;"><i class="fa-solid fa-image"></i> Bukti Foto Pengiriman:</p>
                <img src="${srcUrl}" alt="Bukti Pengiriman" style="max-width: 100%; max-height: 350px; border-radius: 6px; object-fit: contain;" onerror="this.onerror=null; this.parentElement.innerHTML='<p style=\'color:#dc2626; font-size:12px;\'>Gagal memuat gambar. Pastikan URL foto dapat diakses publik.</p>';">
              </div>
            `;
          }

          trackingResult.innerHTML = `
            <div class="tracking-header-info">
              <h3>No. Resi: <strong>${matchedKey}</strong></h3>
              <span class="tracking-status-badge">${item.status || "DIPROSES"}</span>
              <p style="font-size: 13px; color: #64748b; margin-top: 8px;">
                <strong>Pengirim:</strong> ${item.pengirim || "-"} | <strong>Penerima:</strong> ${item.penerima || "-"} | <strong>Tujuan:</strong> ${item.tujuan || "-"}
              </p>
            </div>
            <div class="timeline-tracking" style="margin-top: 15px;">${historyHTML}</div>
            ${fotoHTML}
          `;
        } else {
          trackingResult.innerHTML = `
            <div style="padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; text-align: center;">
              <p>Nomor resi <strong>${noResi}</strong> tidak ditemukan di sistem Lintas.</p>
            </div>
          `;
        }

        trackingResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };

      const jsonpScript = document.createElement("script");
      jsonpScript.id = callbackName;
      jsonpScript.src = `${GOOGLE_SHEET_API_URL}?resi=${encodeURIComponent(noResi)}&callback=${callbackName}`;
      jsonpScript.onerror = function (err) {
        console.error("JSONP Error:", err);
        trackingResult.innerHTML = `<p style="color: #dc2626; text-align: center;">Gagal memuat data resi. Silakan periksa koneksi atau deployment Apps Script.</p>`;
      };
      document.body.appendChild(jsonpScript);
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

  // ==========================================
  // 7. HANDLER KALKULATOR CEK ONGKIR GOOGLE SHEETS
  // ==========================================
  const ongkirForm = document.getElementById("ongkirForm");

  if (ongkirForm) {
    ongkirForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const asal = document.getElementById("asalKirim") ? document.getElementById("asalKirim").value.trim() : "JAKARTA";
      const tujuan = document.getElementById("tujuanKirim") ? document.getElementById("tujuanKirim").value.trim() : "";
      const beratInput = parseFloat(document.getElementById("beratBarang").value) || 1;
      const layananText = document.getElementById("jenisLayanan").value;

      if (!tujuan) {
        alert("Silakan masukkan kota tujuan!");
        return;
      }

      const hasilOngkir = document.getElementById("hasilOngkir");
      if (hasilOngkir) {
        hasilOngkir.style.display = "block";
        document.getElementById("resHarga").innerText = "Menghitung...";
      }

      const callbackOngkirName = "cb_ongkir_" + Math.floor(Math.random() * 1000000);

      window[callbackOngkirName] = function (response) {
        delete window[callbackOngkirName];
        const oldScript = document.getElementById(callbackOngkirName);
        if (oldScript) oldScript.remove();

        if (response && response.status === "success" && response.data && response.data.length > 0) {
          const item = response.data[0];

          // Cek jenis layanan (Express vs Reguler)
          const isExpress = layananText.toLowerCase().includes("udara") || layananText.toLowerCase().includes("express");
          const detailLayanan = isExpress ? item.express : item.reguler;

          const hargaPerKg = detailLayanan.price;
          const minKg = detailLayanan.minKg;

          // Perhitungan minimal charge
          const beratDihitung = Math.max(beratInput, minKg);
          const totalBiaya = beratDihitung * hargaPerKg;
          const formattedTotal = "Rp " + totalBiaya.toLocaleString("id-ID");

          // Render ke UI HTML
          if (document.getElementById("resRute")) document.getElementById("resRute").innerText = `${item.origin} ➔ ${item.destination}`;
          if (document.getElementById("resLayanan")) document.getElementById("resLayanan").innerText = `${layananText} (Min. Charge: ${minKg} Kg | Hitung: ${beratDihitung} Kg)`;
          if (document.getElementById("resHarga")) document.getElementById("resHarga").innerText = formattedTotal;

          // Pesan WhatsApp Otomatis
          const pesanWA = `Halo Admin LINTAS TATA SAMUDRA, saya mau pesan pengiriman:\nRute: ${item.origin} ke ${item.destination}\nBerat Input: ${beratInput} Kg (Terhitung Min. Charge: ${beratDihitung} Kg)\nLayanan: ${layananText}\nEstimasi Web: ${formattedTotal}`;
          
          if (document.getElementById("btnWaBooking")) {
            document.getElementById("btnWaBooking").href = `https://wa.me/6289626400913?text=${encodeURIComponent(pesanWA)}`;
          }
        } else {
          alert(`Tarif pengiriman dari ${asal} ke ${tujuan} belum ditemukan di database.`);
          if (document.getElementById("resHarga")) document.getElementById("resHarga").innerText = "Rp -";
        }
      };

      const jsonpOngkir = document.createElement("script");
      jsonpOngkir.id = callbackOngkirName;
      jsonpOngkir.src = `${GOOGLE_SHEET_API_URL}?action=cek_tarif&origin=${encodeURIComponent(asal)}&destination=${encodeURIComponent(tujuan)}&callback=${callbackOngkirName}`;
      jsonpOngkir.onerror = function () {
        alert("Gagal terhubung ke server database tarif. Silakan periksa koneksi internet.");
      };
      document.body.appendChild(jsonpOngkir);
    });

    // AUTO-RUN KALKULASI JIKA ADA PARAMETER ASAL & TUJUAN DARI HALAMAN UTAMA (INDEX.HTML)
    const urlParams = new URLSearchParams(window.location.search);
    const paramAsal = urlParams.get('asal');
    const paramTujuan = urlParams.get('tujuan');

    if (paramAsal && paramTujuan) {
      if (document.getElementById("asalKirim")) document.getElementById("asalKirim").value = paramAsal;
      if (document.getElementById("tujuanKirim")) document.getElementById("tujuanKirim").value = paramTujuan;
      
      setTimeout(() => {
        ongkirForm.dispatchEvent(new Event('submit'));
      }, 300);
    }
  }

}); // <-- PENUTUP DOMContentLoaded

// ==========================================
// 6. HANDLER WIDGET HERO CEK ONGKIR (REDIRECT KE HALAMAN CEK ONGKIR)
// ==========================================
function kirimCekOngkirWA() {
  var asal = document.getElementById('asal') ? document.getElementById('asal').value.trim() : '';
  var tujuan = document.getElementById('tujuan') ? document.getElementById('tujuan').value.trim() : '';

  if (asal === '' || tujuan === '') {
    alert('Harap isi Kota Asal dan Kota Tujuan terlebih dahulu!');
    return;
  }

  // Redirect langsung ke halaman cek-ongkir.html membawa query parameter
  window.location.href = `cek-ongkir.html?asal=${encodeURIComponent(asal)}&tujuan=${encodeURIComponent(tujuan)}`;
}

// HANDLER FLOATING WA MULTI-CONTACT
const waToggleBtn = document.getElementById("waToggleBtn");
const waPopup = document.getElementById("waPopup");

if (waToggleBtn && waPopup) {
  waToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    waPopup.classList.toggle("show");
  });

  document.addEventListener("click", function (e) {
    if (!waPopup.contains(e.target) && !waToggleBtn.contains(e.target)) {
      waPopup.classList.remove("show");
    }
  });
}