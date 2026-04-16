// Script Mock API Logistik untuk Vercel Serverless Function
// Path file: api/deliveries.js

export default function handler(req, res) {
    // Setup CORS agar API bisa diakses dari tools/domain manapun (seperti Pentaho/Python)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Menangkap query parameter jika mahasiswa ingin memfilter ID (opsional)
    // Contoh: /api/deliveries?transaction_id=TRX-10001
    const { transaction_id } = req.query;

    // Daftar kurir lokal fiktif
    const listKurir = ['Kapuas Express', 'Borneo Logistik', 'Khatulistiwa Cargo', 'JNE', 'J&T'];
    const listStatus = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'IN_TRANSIT', 'RETURNED'];

    // Fungsi untuk generate data dummy secara dinamis
    const generateData = (count) => {
        let data = [];
        for (let i = 1; i <= count; i++) {
            // Format ID menyesuaikan script OLTP (misal TRX-10000)
            const trxId = transaction_id || `TRX-1${String(i).padStart(4, '0')}`;
            const kurir = listKurir[Math.floor(Math.random() * listKurir.length)];
            const status = listStatus[Math.floor(Math.random() * listStatus.length)];

            // Random durasi 1 - 5 hari
            const durasiHari = Math.floor(Math.random() * 5) + 1;

            // Random biaya ongkir (kelipatan 5000, antara 15.000 s/d 50.000)
            const biayaOngkir = (Math.floor(Math.random() * 8) + 3) * 5000;

            data.push({
                transaction_id: trxId,
                kurir: kurir,
                status_pengiriman: status,
                tgl_sampai: `2024-10-${String(10 + (i % 15)).padStart(2, '0')}T14:30:00Z`,
                biaya_ongkir: status === 'DELIVERED' ? biayaOngkir : 0,
                durasi_hari: durasiHari
            });

            // Jika ada query parameter transaction_id, cukup return 1 data
            if (transaction_id) break;
        }
        return data;
    };

    // Kita generate 50 data dummy, atau 1 data jika difilter
    const results = generateData(50);

    // Return response JSON
    res.status(200).json({
        status: "success",
        total_data: results.length,
        data: results
    });
}
