DO $$
DECLARE
  project record;
  inserted_count integer := 0;
  skipped_count integer := 0;
BEGIN
  FOR project IN
    SELECT *
    FROM (
      VALUES
        (
          11,
          'ARchitecht – Ericsson Hackathon',
          'Prototipe desain antarmuka remote guidance untuk membantu pemeliharaan mesin pabrik yang terintegrasi dengan sensor real-time.',
          '[]'::jsonb,
          '["Remote guidance","Panduan visual pemeliharaan mesin","Integrasi sensor real-time","Prototipe antarmuka"]'::jsonb
        ),
        (
          10,
          'IKM Ikan',
          'Sistem pencatatan untuk membantu digitalisasi pengelolaan transaksi dan stok usaha IKM.',
          '[]'::jsonb,
          '["Pencatatan transaksi penjualan","Pencatatan pengeluaran","Perhitungan laba bersih","Pengelolaan stok barang"]'::jsonb
        ),
        (
          9,
          'Sistem Deteksi Kepadatan',
          'Melakukan pengambilan data di persimpangan jalan dan menerapkan object detection kendaraan untuk membuat visualisasi serta simulasi kepadatan lalu lintas.',
          '[]'::jsonb,
          '["Pengambilan data lapangan","Deteksi kendaraan","Visualisasi kepadatan lalu lintas","Simulasi optimasi lalu lintas"]'::jsonb
        ),
        (
          8,
          'Ruang Elegan',
          'Membangun logika backend untuk mengotomatisasi penentuan harga bahan dan membantu pengelolaan stok furnitur custom.',
          '[]'::jsonb,
          '["Perhitungan harga bahan otomatis","Manajemen stok furnitur custom","Pengelolaan inventaris"]'::jsonb
        ),
        (
          2,
          'Himasis – Himpunan Mahasiswa Sistem Informasi',
          'Memperbarui antarmuka dan membangun frontend website HIMASIS menggunakan CodeIgniter agar responsif dan memudahkan akses informasi akademik.',
          '["CodeIgniter"]'::jsonb,
          '["Pembaruan antarmuka","Frontend website","Desain responsif","Akses informasi akademik"]'::jsonb
        ),
        (
          7,
          'ITIC – Jakarta Global University',
          'Merancang dan membangun arsitektur backend untuk website Departemen ITIC JGU sebagai platform informasi dan pendukung layanan mahasiswa serta dosen.',
          '[]'::jsonb,
          '["Backend website","Platform informasi departemen","Dukungan layanan mahasiswa dan dosen"]'::jsonb
        ),
        (
          6,
          'Sate Rembige',
          'Aplikasi web pemesanan makanan dengan skema basis data transaksi penjualan yang terintegrasi.',
          '[]'::jsonb,
          '["Pemesanan makanan melalui website","Basis data transaksi penjualan","Pengelolaan transaksi"]'::jsonb
        ),
        (
          5,
          'Dashboard Pet Shop – Business Intelligence',
          'Dashboard analitik interaktif dari dataset penjualan lebih dari 49.000 baris untuk memantau kinerja bisnis pet shop.',
          '[]'::jsonb,
          '["Pemantauan pendapatan pesanan","Tren penjualan harian","Conversion rate","Analisis dataset penjualan 49.000+ baris"]'::jsonb
        ),
        (
          4,
          'Inventory System – Java Framework',
          'Aplikasi berbasis Java GUI untuk memantau stok dan mutasi barang gudang, dilengkapi notifikasi saat stok mencapai batas minimum.',
          '["Java","Java GUI Framework"]'::jsonb,
          '["Pemantauan stok barang","Pencatatan mutasi gudang","Notifikasi stok minimum","Peringatan stok habis"]'::jsonb
        ),
        (
          3,
          'Aplikasi Mobile Stock Sparepart',
          'Aplikasi mobile untuk mengelola persediaan suku cadang otomotif dan memantau mutasi barang di gudang.',
          '[]'::jsonb,
          '["Manajemen persediaan suku cadang","Pemantauan barang masuk dan keluar","Estimasi nilai aset inventaris","Peringatan stok menipis atau habis"]'::jsonb
        ),
        (
          1,
          'Katstruction – ITechno Cup',
          'Platform pengaduan masyarakat berbasis GIS dan AI untuk memetakan laporan kerusakan jalan atau fasilitas umum dan membantu menentukan prioritas penanganannya.',
          '["GIS","AI"]'::jsonb,
          '["Pengaduan masyarakat","Pemetaan laporan","Identifikasi kerusakan jalan dan fasilitas umum","Penentuan prioritas perbaikan"]'::jsonb
        )
    ) AS seed(rank, title, description, tech_stack, features)
    ORDER BY rank DESC
  LOOP
    IF EXISTS (
      SELECT 1
      FROM public.projects existing
      WHERE lower(btrim(existing."Title")) = lower(btrim(project.title))
    ) THEN
      skipped_count := skipped_count + 1;
    ELSE
      INSERT INTO public.projects (
        "Title",
        "Description",
        "Img",
        "Link",
        "Github",
        "Features",
        "TechStack",
        role,
        is_published,
        created_at
      )
      VALUES (
        project.title,
        project.description,
        NULL,
        CASE project.title
          WHEN 'Katstruction – ITechno Cup' THEN 'https://ptrs.site.je/'
          WHEN 'Himasis – Himpunan Mahasiswa Sistem Informasi' THEN 'https://himasis.org/'
          ELSE NULL
        END,
        NULL,
        project.features,
        project.tech_stack,
        'developer',
        true,
        clock_timestamp() - make_interval(mins => project.rank)
      );

      inserted_count := inserted_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Inserted % projects; skipped % existing titles.',
    inserted_count,
    skipped_count;
END
$$;
