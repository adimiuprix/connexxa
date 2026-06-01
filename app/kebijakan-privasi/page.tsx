'use client';

const sections = [
    {
        title: 'Informasi yang Kami Kumpulkan',
        items: [
            {
                subtitle: 'Informasi yang diberikan secara langsung',
                body: 'Pada saat Pengguna membuat akun, melakukan pembelian, atau menghubungi kami, Connexxa mengumpulkan informasi berupa nama lengkap, alamat surat elektronik, nomor telepon, alamat pengiriman, serta informasi pembayaran yang diperlukan untuk memproses transaksi.',
            },
            {
                subtitle: 'Informasi yang dikumpulkan secara otomatis',
                body: 'Dalam rangka meningkatkan kualitas layanan, Connexxa secara otomatis mengumpulkan data teknis tertentu, meliputi alamat IP, jenis perangkat, peramban yang digunakan, halaman yang dikunjungi, serta waktu kunjungan melalui cookies dan teknologi pelacakan serupa.',
            },
            {
                subtitle: 'Informasi dari pihak ketiga',
                body: 'Connexxa dapat menerima informasi mengenai Pengguna dari mitra bisnis, platform media sosial, atau penyedia layanan analitik yang menjalin kerja sama dengan Connexxa, sesuai dengan ketentuan yang berlaku.',
            },
        ],
    },
    {
        title: 'Penggunaan Informasi',
        items: [
            {
                subtitle: 'Pemrosesan transaksi',
                body: 'Informasi Pengguna digunakan untuk memproses pesanan, mengelola pembayaran, mengatur pengiriman, serta menyampaikan konfirmasi dan pembaruan status transaksi.',
            },
            {
                subtitle: 'Peningkatan layanan',
                body: 'Connexxa menganalisis data penggunaan guna memahami preferensi Pengguna, meningkatkan fitur dan performa platform, serta mengembangkan produk yang lebih relevan dengan kebutuhan Pengguna.',
            },
            {
                subtitle: 'Komunikasi pemasaran',
                body: 'Atas persetujuan Pengguna, Connexxa dapat menyampaikan informasi promosi, penawaran eksklusif, dan pembaruan produk melalui surat elektronik atau notifikasi. Pengguna dapat mencabut persetujuan tersebut kapan saja melalui tautan berhenti berlangganan yang tersedia.',
            },
            {
                subtitle: 'Keamanan dan pencegahan penipuan',
                body: 'Connexxa menggunakan informasi yang tersedia untuk mendeteksi, mencegah, dan menangani aktivitas penipuan, penyalahgunaan layanan, atau ancaman keamanan lainnya yang dapat merugikan Pengguna maupun Connexxa.',
            },
        ],
    },
    {
        title: 'Pembagian Informasi kepada Pihak Ketiga',
        items: [
            {
                subtitle: 'Mitra pengiriman',
                body: 'Connexxa membagikan informasi pengiriman yang diperlukan kepada mitra logistik dan jasa kurir yang ditunjuk, semata-mata untuk memastikan pesanan Pengguna diterima dengan tepat waktu dan sesuai tujuan.',
            },
            {
                subtitle: 'Penyedia layanan pembayaran',
                body: 'Data pembayaran diproses oleh penyedia layanan pembayaran pihak ketiga yang telah memperoleh sertifikasi PCI-DSS. Connexxa tidak menyimpan data kartu kredit atau debit Pengguna secara langsung pada sistem kami.',
            },
            {
                subtitle: 'Kewajiban hukum',
                body: 'Connexxa dapat mengungkapkan informasi Pengguna apabila diwajibkan oleh peraturan perundang-undangan, perintah pengadilan, atau proses hukum lainnya yang berlaku di wilayah Republik Indonesia.',
            },
            {
                subtitle: 'Larangan penjualan data',
                body: 'Connexxa tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Pengguna kepada pihak ketiga mana pun untuk kepentingan pemasaran pihak tersebut.',
            },
        ],
    },
    {
        title: 'Cookies dan Teknologi Pelacakan',
        items: [
            {
                subtitle: 'Definisi cookies',
                body: 'Cookies merupakan berkas teks berukuran kecil yang disimpan pada perangkat Pengguna saat mengakses platform kami. Cookies berfungsi untuk mengingat preferensi Pengguna dan meningkatkan pengalaman berbelanja secara keseluruhan.',
            },
            {
                subtitle: 'Jenis cookies yang digunakan',
                body: 'Connexxa menggunakan cookies esensial untuk menjalankan fungsi dasar platform, cookies analitik untuk memahami pola penggunaan, serta cookies preferensi untuk menyimpan pilihan Pengguna seperti bahasa dan ukuran produk.',
            },
            {
                subtitle: 'Pengelolaan cookies',
                body: 'Pengguna dapat mengonfigurasi peramban untuk menolak seluruh cookies atau menerima pemberitahuan sebelum cookies disimpan. Perlu diperhatikan bahwa pembatasan cookies tertentu dapat memengaruhi fungsionalitas sebagian fitur platform.',
            },
        ],
    },
    {
        title: 'Keamanan Data',
        items: [
            {
                subtitle: 'Langkah-langkah perlindungan',
                body: 'Connexxa menerapkan enkripsi SSL/TLS pada seluruh transmisi data, kontrol akses yang ketat berdasarkan prinsip least privilege, serta pemantauan keamanan secara berkelanjutan untuk melindungi informasi pribadi Pengguna dari akses yang tidak sah.',
            },
            {
                subtitle: 'Penyimpanan dan retensi data',
                body: 'Data Pengguna disimpan pada server yang berlokasi di Indonesia dan/atau negara-negara yang memiliki standar perlindungan data yang memadai. Connexxa menyimpan data selama diperlukan untuk memenuhi tujuan sebagaimana diuraikan dalam Kebijakan Privasi ini, atau selama diwajibkan oleh ketentuan hukum yang berlaku.',
            },
        ],
    },
    {
        title: 'Hak-Hak Pengguna',
        items: [
            {
                subtitle: 'Hak akses dan koreksi',
                body: 'Pengguna berhak untuk mengakses informasi pribadi yang disimpan oleh Connexxa dan mengajukan permintaan koreksi apabila terdapat data yang tidak akurat, melalui halaman pengaturan akun atau dengan menghubungi tim kami.',
            },
            {
                subtitle: 'Hak penghapusan data',
                body: 'Pengguna dapat mengajukan permohonan penghapusan akun beserta seluruh data pribadinya dengan menghubungi tim Connexxa. Sebagian data mungkin tetap disimpan untuk memenuhi kewajiban hukum yang berlaku.',
            },
            {
                subtitle: 'Hak portabilitas data',
                body: 'Pengguna berhak memperoleh salinan data pribadinya dalam format yang dapat dibaca oleh mesin, guna keperluan pemindahan ke layanan lain sesuai ketentuan yang berlaku.',
            },
            {
                subtitle: 'Hak penarikan persetujuan',
                body: 'Pengguna dapat mencabut persetujuan atas pemrosesan data kapan saja, termasuk berhenti berlangganan komunikasi pemasaran melalui tautan yang tersedia pada setiap surat elektronik yang dikirimkan oleh Connexxa.',
            },
        ],
    },
    {
        title: 'Perubahan Kebijakan Privasi',
        items: [
            {
                subtitle: null,
                body: 'Connexxa berhak untuk memperbarui Kebijakan Privasi ini sewaktu-waktu sesuai dengan perkembangan regulasi atau perubahan operasional perusahaan. Perubahan yang bersifat material akan diberitahukan kepada Pengguna melalui surat elektronik atau pemberitahuan resmi di platform. Tanggal pembaruan terakhir senantiasa tercantum di bagian atas halaman ini.',
            },
        ],
    },
    {
        title: 'Hubungi Kami',
        items: [
            {
                subtitle: null,
                body: 'Apabila Pengguna memiliki pertanyaan, keberatan, atau permohonan terkait Kebijakan Privasi ini maupun pengelolaan data pribadi, Pengguna dapat menghubungi Connexxa melalui surat elektronik di privacy@connexxa.id atau melalui halaman Pusat Bantuan yang tersedia pada platform kami.',
            },
        ],
    },
];

export default function KebijakanPrivasiPage() {
    return (
        <div className="pt-20 px-4 md:px-8">
            <div className="w-full flex justify-center">
                <div className="max-w-3xl w-full">
                    <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">Kebijakan Privasi</h1>
                    <p className="text-gray-600 mb-8">
                        Terakhir diperbarui: 1 Juni 2026
                    </p>

                    <div className="space-y-8 text-md">
                        {sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-xl font-semibold mb-2">{i + 1}. {section.title}</h2>
                                {section.items.map((item, j) => (
                                    <div key={j} className={section.items.length > 1 ? 'mb-4' : ''}>
                                        {item.subtitle && (
                                            <h3 className="text-base font-semibold text-gray-800 mb-1">{item.subtitle}</h3>
                                        )}
                                        <p className="text-gray-700">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
