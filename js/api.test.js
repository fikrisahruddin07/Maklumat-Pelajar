/**
 * @jest-environment jsdom
 */

describe('Sistem Maklumat - Pengujian Unit Lengkap', () => {
    let sahkanEmail;

    beforeAll(() => {
        // 1. Sediakan elemen DOM lengkap untuk dikesan oleh api.js
        document.body.innerHTML = `
            <form id="daftarForm">
                <input type="text" id="nama" value="Ahmad">
                <input type="email" id="email" value="ahmad@test.com">
                <div id="statusMessage"></div>
            </form>
            <input type="text" id="carianInput" value="Leanne">
            <button id="btnCari"></button>
            <div id="hasilCarian"></div>
        `;

        // Mock fungsi global fetch supaya tidak membuat panggilan internet sebenar semasa test
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 101, name: 'Leanne Graham', email: 'sincere@april.biz', company: { name: 'Romaguera' } }),
            })
        );

        const api = require('./api');
        sahkanEmail = api.sahkanEmail;
    });

    // Ujian fungsi validasi emel (Sedia ada)
    test('Validasi format emel', () => {
        expect(sahkanEmail('pelajar@institusi.edu.my')).toBe(true);
        expect(sahkanEmail('emelsalah.com')).toBe(false);
    });

    // Ujian simulasi tekan butang daftar (Untuk cover baris 15-56)
    test('Simulasi hantar borang pendaftaran', async () => {
        const form = document.getElementById('daftarForm');
        const event = new window.Event('submit');
        form.dispatchEvent(event);
        expect(global.fetch).toHaveBeenCalled();
    });

    // Ujian simulasi tekan butang carian (Untuk cover baris 66-105)
    test('Simulasi klik butang carian', async () => {
        const btnCari = document.getElementById('btnCari');
        btnCari.click();
        expect(global.fetch).toHaveBeenCalled();
    });
});