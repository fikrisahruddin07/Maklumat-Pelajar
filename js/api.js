function sahkanEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fungsi pembantu papar mesej
function tampilMesej(teks, kelasWarna) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.classList.remove('hidden');
        statusMessage.className = `p-4 rounded-xl mb-5 text-sm font-medium text-center shadow-sm ${kelasWarna}`;
        statusMessage.innerText = teks;
    }
}

// ==========================================
// 1. LOGIK BORANG DAFTAR (daftar.html)
// ==========================================
const daftarForm = document.getElementById('daftarForm');
if (daftarForm) {
    daftarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();

        if (nama.length < 3) {
            tampilMesej('Nama mesti melebihi 2 aksara.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }
        if (!sahkanEmail(email)) {
            tampilMesej('Format emel tidak sah.', 'bg-red-100 text-red-700 border border-red-200');
            return;
        }

        try {
            tampilMesej('Sedang memproses...', 'bg-blue-50 text-blue-700 border border-blue-200');

            const respon = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama, username, email })
            });

            if (!respon.ok) throw new Error('Respons pelayan gagal.');

            const data = await respon.json();

            // SImpan data ke dalam localStorage supaya boleh dicari dan diguna untuk login
            const penggunaBaru = {
                id: data.id,
                name: nama,
                username: username,
                email: email,
                company: { name: "Pendaftaran Tempatan" }
            };

            // Ambil data sedia ada atau mulakan dengan array kosong
            let senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            senaraiLokal.push(penggunaBaru);
            localStorage.setItem('penggunaLokal', JSON.stringify(senaraiLokal));

            tampilMesej(`🎉 Pendaftaran Berjaya! Data disimpan secara lokal.`, 'bg-green-50 text-green-700 border border-green-200');
            daftarForm.reset();

        } catch (error) {
            tampilMesej(`❌ Ralat Sistem: ${error.message}`, 'bg-red-50 text-red-700 border border-red-200');
        }
    });
}

// ==========================================
// 2. LOGIK INTEGRASI CARIAN (carian.html)
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

            // 1. Ambil data asal dari API luar
            const respon = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!respon.ok) throw new Error('Gagal mengambil data daripada pelayan.');
            let senaraiPengguna = await respon.json();

            // 2. Ambil gabungan data daripada localStorage (data yang anda daftar tadi)
            const senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            
            // Gabungkan kedua-dua senarai data
            const semuaPengguna = [...senaraiLokal, ...senaraiPengguna];
            
            // Lakukan penapisan carian
            const hasilTapis = semuaPengguna.filter(user => 
                user.name.toLowerCase().includes(input.toLowerCase()) || 
                user.username?.toLowerCase().includes(input.toLowerCase())
            );

            if (hasilTapis.length === 0) {
                hasilCarian.innerHTML = `<p class="text-sm text-amber-600 font-medium text-center">Tiada rekod sepadan dengan "${input}".</p>`;
                return;
            }

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
// 3. LOGIK SEMAKAN LOG MASUK (login.html)
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('loginEmail').value.trim();
        
        try {
            tampilMesej('Menyemak kelayakan log masuk...', 'bg-blue-50 text-blue-700 border border-blue-200');

            // Ambil data API & data local storage untuk semakan emel wujud atau tidak
            const respon = await fetch('https://jsonplaceholder.typicode.com/users');
            const senaraiAPI = await respon.json();
            const senaraiLokal = JSON.parse(localStorage.getItem('penggunaLokal')) || [];
            
            const semuaPengguna = [...senaraiLokal, ...senaraiAPI];

            // Cari jika emel yang dimasukkan sepadan dengan mana-mana pengguna
            const penggunaWujud = semuaPengguna.find(user => user.email.toLowerCase() === emailInput.toLowerCase());

            if (penggunaWujud) {
                tampilMesej(`✅ Log Masuk Berjaya! Selamat kembali, ${penggunaWujud.name}.`, 'bg-green-50 text-green-700 border border-green-200');
            } else {
                tampilMesej('❌ Log Masuk Gagal: Emel tidak ditemui dalam sistem.', 'bg-red-100 text-red-700 border border-red-200');
            }

        } catch (error) {
            tampilMesej('❌ Ralat semasa memproses log masuk.', 'bg-red-100 text-red-700 border border-red-200');
        }
    });
}

// Eksport modul untuk unit testing Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sahkanEmail };
}