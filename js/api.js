// ==========================================
// 1. FUNGSI PEMBANTU & VALIDASI GLOBAL
// ==========================================

// Fungsi semakan format emel menggunakan Regex
function sahkanEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fungsi pembantu untuk memaparkan mesej status pada skrin
function tampilMesej(teks, kelasWarna) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.classList.remove('hidden');
        statusMessage.className = `p-4 rounded-xl mb-5 text-sm font-medium text-center shadow-sm ${kelasWarna}`;
        statusMessage.innerText = teks;
    }
}

// ==========================================
// 2. LOGIK BORANG DAFTAR (daftar.html)
// ==========================================
const daftarForm = document.getElementById('daftarForm');
if (daftarForm) {
    daftarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validasi input di bahagian hadapan
        if (nama.length < 3) {
            tampilMesej('Nama mesti melebihi 2 aksara.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }
        if (username.length < 3) {
            tampilMesej('Username mesti melebihi 2 aksara.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }
        if (!sahkanEmail(email)) {
            tampilMesej('Format emel tidak sah.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }

        try {
            tampilMesej('Sedang memproses...', 'bg-blue-50 text-blue-700 border border-blue-200');

            // Simulasi hantar data ke API luar
            const respon = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama, username, email })
            });

            if (!respon.ok) throw new Error('Respons pelayan gagal.');

            const data = await respon.json();

            // Simpan data pendaftaran baharu ke dalam localStorage
            const penggunaBaru = {
                id: data.id,
                name: nama,
                username: username,
                email: email,
                company: { name: "Pendaftaran Tempatan" }
            };

            // Ambil data sedia ada dari storan lokal atau sediakan array kosong
            let senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            senaraiLokal.push(penggunaBaru);
            localStorage.setItem('penggunaLokal', JSON.stringify(senaraiLokal));

            tampilMesej(`🎉 Pendaftaran Berjaya! Data anda telah disimpan ke sistem lokal.`, 'bg-green-50 text-green-700 border border-green-200');
            daftarForm.reset();

        } catch (error) {
            tampilMesej(`❌ Ralat Sistem: ${error.message}`, 'bg-red-50 text-red-700 border border-red-200');
        }
    });
}

// ==========================================
// 3. LOGIK INTEGRASI CARIAN (carian.html)
// ==========================================
const btnCari = document.getElementById('btnCari');
if (btnCari) {
    btnCari.addEventListener('click', async () => {
        const input = document.getElementById('carianInput').value.trim();
        const hasilCarian = document.getElementById('hasilCarian');

        if (!input) {
            hasilCarian.innerHTML = `<p class="text-sm text-red-500 font-medium text-center">Sila masukkan nama untuk dicari.</p>`;
            return;
        }

        try {
            hasilCarian.innerHTML = `<p class="text-sm text-blue-500 font-medium text-center animate-pulse">Sedang mencari maklumat...</p>`;

            // 1. Ambil data asal daripada API luar
            const respon = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!respon.ok) throw new Error('Gagal mengambil data daripada pelayan.');
            let senaraiAPI = await respon.json();

            // 2. Ambil data pendaftaran yang disimpan dalam localStorage
            const senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            
            // Gabungkan kedua-dua sumber data untuk carian menyeluruh
            const semuaPengguna = [...senaraiLokal, ...senaraiAPI];
            
            // Tapis data berdasarkan input nama atau username
            const hasilTapis = semuaPengguna.filter(user => 
                user.name.toLowerCase().includes(input.toLowerCase()) || 
                user.username?.toLowerCase().includes(input.toLowerCase())
            );

            if (hasilTapis.length === 0) {
                hasilCarian.innerHTML = `<p class="text-sm text-amber-600 font-medium text-center">Tiada rekod sepadan dengan "${input}".</p>`;
                return;
            }

            // Bina struktur kad HTML paparan hasil carian
            let htmlKad = `<div class="space-y-4">`;
            hasilTapis.forEach(user => {
                htmlKad += `
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition">
                        <h4 class="font-bold text-slate-800 text-base">${user.name}</h4>
                        <p class="text-xs text-slate-500 mt-1">👤 Username: <span class="font-medium text-slate-700">${user.username || '-'}</span></p>
                        <p class="text-xs text-slate-500">📧 Emel: <span class="font-medium text-slate-700">${user.email}</span></p>
                        <p class="text-xs text-slate-500">🏢 Syarikat: <span class="font-medium text-slate-700">${user.company.name}</span></p>
                    </div>
                `;
            });
            htmlKad += `</div>`;
            hasilCarian.innerHTML = htmlKad;

        } catch (error) {
            hasilCarian.innerHTML = `<p class="text-sm text-red-500 font-medium text-center">❌ Ralat Carian: ${error.message}</p>`;
        }
    });
}

// ==========================================
// 4. LOGIK SEMAKAN LOG MASUK (login.html)
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mengambil nilai input username dan email daripada login.html
        const usernameInput = document.getElementById('loginUsername').value.trim();
        const emailInput = document.getElementById('loginEmail').value.trim();
        
        // Pengesahan awal format emel di bahagian hadapan
        if (!sahkanEmail(emailInput)) {
            tampilMesej('Format emel tidak sah.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }

        try {
            tampilMesej('Menyemak kelayakan log masuk...', 'bg-blue-50 text-blue-700 border border-blue-200');

            // Ambil data API luar & data local storage
            const respon = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!respon.ok) throw new Error('Gagal mengambil data daripada pelayan.');
            
            const senaraiAPI = await respon.json();
            const senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            
            // Gabungkan kedua-dua sumber data sebelum membuat semakan padanan
            const semuaPengguna = [...senaraiLokal, ...senaraiAPI];

            // Semakan berkembar: Medan EMEL dan USERNAME mesti betul dan sepadan dalam satu objek data
            const penggunaWujud = semuaPengguna.find(user => 
                user.email.toLowerCase() === emailInput.toLowerCase() && 
                user.username?.toLowerCase() === usernameInput.toLowerCase()
            );

            if (penggunaWujud) {
                tampilMesej(`✅ Log Masuk Berjaya! Selamat kembali, ${penggunaWujud.name}.`, 'bg-green-50 text-green-700 border border-green-200');
            } else {
                tampilMesej('❌ Log Masuk Gagal: Nama pengguna atau emel tidak sepadan.', 'bg-red-100 text-red-700 border border-red-200');
            }

        } catch (error) {
            tampilMesej(`❌ Ralat Sistem: ${error.message}`, 'bg-red-100 text-red-700 border border-red-200');
        }
    });
}

// Eksport modul untuk unit testing Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sahkanEmail };
}