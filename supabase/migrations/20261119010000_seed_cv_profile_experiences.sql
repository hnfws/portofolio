INSERT INTO public.experiences (
  category,
  role,
  organization,
  position,
  description,
  start_date,
  end_date,
  is_current
)
SELECT
  seed.category,
  seed.role,
  seed.organization,
  seed.position,
  seed.description,
  seed.start_date,
  seed.end_date,
  seed.is_current
FROM (
  VALUES
    (
      'work',
      'developer',
      'Kuajar.id',
      'Coding Mentor',
      'Membimbing peserta dalam pemrograman dasar hingga menengah dan basis data relasional. Melakukan code review dan debugging, menyusun materi serta latihan, dan mendampingi peserta mengembangkan proyek aplikasi web.',
      DATE '2025-07-01',
      DATE '2026-07-31',
      false
    ),
    (
      'work',
      'developer',
      'Jakarta Global University',
      'Student Internship (Web Developer)',
      'Memimpin tim magang dalam mengembangkan website dan aplikasi web dinamis. Merancang backend platform informasi Departemen ITIC JGU, mengelola data mahasiswa, dan berkolaborasi membuat prototipe aset visual.',
      DATE '2024-01-01',
      DATE '2024-05-31',
      false
    ),
    (
      'work',
      'illustrator',
      'Freelance',
      'Illustrator',
      'Membuat ilustrasi kustom sesuai kebutuhan klien, mengembangkan konsep dan sketsa, serta mengelola komunikasi, revisi, kualitas, dan tenggat proyek secara mandiri.',
      DATE '2021-01-01',
      NULL,
      true
    ),
    (
      'work',
      'illustrator',
      'Freelance',
      'Illustration Mentor',
      'Memberikan mentoring menggambar secara privat, menyusun materi sesuai kemampuan siswa, mengajarkan anatomi, perspektif, shading, dan komposisi, serta memberi umpan balik dan memantau perkembangan.',
      DATE '2024-01-01',
      DATE '2024-07-31',
      false
    ),
    (
      'organization',
      'developer',
      'Novo Club by Paragon Corp',
      'The Creator Studio Staff',
      'Berkolaborasi dalam proyek digital bertema growth journey: merencanakan dan memproduksi konten, mengatur pengambilan video, menyunting materi, serta mengelola engagement audiens. Pengalaman ini mengasah kolaborasi tim, komunikasi, dan eksekusi proyek digital.',
      DATE '2026-01-01',
      DATE '2026-09-30',
      false
    ),
    (
      'organization',
      'developer',
      'HIMASIS Politeknik STMI Jakarta',
      'Staff Akademik',
      'Berkontribusi pada pengembangan website organisasi menggunakan CodeIgniter, merancang UI/UX dan artikel edukatif, serta menjadi pemateri mentoring Sistem Informasi Akuntansi.',
      DATE '2025-02-01',
      DATE '2026-02-28',
      false
    ),
    (
      'organization',
      'developer',
      'Politeknik STMI Jakarta',
      'Panitia Kompetisi Nasional REACTOR (Divisi Hackathon)',
      'Mengelola teknis kompetisi hackathon nasional, berkolaborasi menyusun alur penilaian dan jadwal, serta mendampingi peserta selama acara.',
      DATE '2025-10-01',
      DATE '2025-12-31',
      false
    ),
    (
      'organization',
      'developer',
      'Digital Innovation Center STMI (DInnocents)',
      'Anggota Komunitas',
      'Anggota komunitas Digital Innovation Center STMI. CV mencantumkan periode mulai tahun 2025, tetapi tidak mencantumkan bulan mulai.',
      DATE '2025-01-01',
      NULL,
      true
    )
) AS seed(
  category,
  role,
  organization,
  position,
  description,
  start_date,
  end_date,
  is_current
)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.experiences existing
  WHERE existing.category = seed.category
    AND lower(btrim(existing.organization)) = lower(btrim(seed.organization))
    AND lower(btrim(existing.position)) = lower(btrim(seed.position))
);
