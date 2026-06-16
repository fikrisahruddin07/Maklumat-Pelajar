// Fungsi Validasi Emel (Untuk kegunaan Unit Testing juga)
function sahkanEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Pengendalian Borang Daftar
const daftarForm = document.getElementById('daftarForm');
if (daftarForm) {
    daftarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const statusMessage = document.getElementById('statusMessage');

        // 1. Validasi Input Hadapan
        if (nama.length < 3) {
            tampilMesej('Nama mesti melebihi 2 aksara.', 'bg-red-100 text-red-700');
            return;
        }
        if (!sahkanEmail(email)) {
            tampilMesej('Format emel tidak sah.', 'bg-red-100 text-red-700');
            return;
        }

        // 2. Fetch API dengan Error Handling (try...catch)
        try {
            statusMessage.classList.remove('hidden');
            tampilMesej('Sedang memproses...', 'bg-blue-100 text-blue-700');

            // Gantikan URL di bawah dengan URL API sebenar/mock anda semasa exam
            const respon = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama, email })
            });

            if (!respon.ok) throw new Error('Respons pelayan gagal.');

            const data = await respon.json();
            tampilMesej('Pendaftaran Berjaya! ID: ' + data.id, 'bg-green-100 text-green-700');
            daftarForm.reset();

        } catch (error) {
            // Mengendalikan ralat sekiranya API tidak berfungsi / offline
            tampilMesej('Ralat Sistem: ' + error.message, 'bg-red-100 text-red-700');
        }
    });
}

function tampilMesej(teks, kelasWarna) {
    const statusMessage = document.getElementById('statusMessage');
    if(statusMessage) {
        statusMessage.className = `p-3 rounded mb-4 text-sm text-center ${kelasWarna}`;
        statusMessage.innerText = teks;
    }
}

// Eksport jika menggunakan sistem modul (untuk pengujian)
if (typeof module !== 'undefined') {
    module.exports = { sahkanEmail };
}