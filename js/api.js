// ==========================================
// 1. LOGIK VALIDASI (Untuk Unit Testing)
// ==========================================
function sahkanEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==========================================
// 2. PENGENDALIAN BORANG DAFTAR (daftar.html)
// ==========================================
const daftarForm = document.getElementById('daftarForm');
if (daftarForm) {
    daftarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validasi Hadapan
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
                body: JSON.stringify({ nama, email })
            });

            if (!respon.ok) throw new Error('Respons pelayan gagal.');

            const data = await respon.json();
            tampilMesej(`🎉 Pendaftaran Berjaya! ID Rekod: ${data.id}`, 'bg-green-50 text-green-700 border border-green-200');
            daftarForm.reset();

        } catch (error) {
            tampilMesej(`❌ Ralat Sistem: ${error.message}`, 'bg-red-50 text-red-700 border border-red-200');
        }
    });
}

function tampilMesej(teks, kelasWarna) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.classList.remove('hidden');
        statusMessage.className = `p-4 rounded-xl mb-5 text-sm font-medium text-center shadow-sm ${kelasWarna}`;
        statusMessage.innerText = teks;
    }
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

            const respon = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!respon.ok) throw new Error('Gagal mengambil data daripada pelayan.');

            const senaraiPengguna = await respon.json();
            
            const hasilTapis = senaraiPengguna.filter(user => 
                user.name.toLowerCase().includes(input.toLowerCase())
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
                        <p class="text-xs text-slate-500 mt-1">📧 Emel: <span class="font-medium text-slate-700">${user.email}</span></p>
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

// Eksport modul untuk unit testing Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sahkanEmail };
}