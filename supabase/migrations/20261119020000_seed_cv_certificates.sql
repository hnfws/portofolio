UPDATE public.experiences
SET
  role = 'developer',
  description = 'Berkolaborasi dalam proyek digital bertema growth journey: merencanakan dan memproduksi konten, mengatur pengambilan video, menyunting materi, serta mengelola engagement audiens. Pengalaman ini mengasah kolaborasi tim, komunikasi, dan eksekusi proyek digital.'
WHERE lower(btrim(organization)) = lower(btrim('Novo Club by Paragon Corp'))
  AND lower(btrim(position)) = lower(btrim('The Creator Studio Staff'));

ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS issuer text,
  ADD COLUMN IF NOT EXISTS issued_date text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS credential_url text,
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'both';

UPDATE public.certificates
SET role = 'both'
WHERE role IS NULL;

ALTER TABLE public.certificates
  ALTER COLUMN role SET DEFAULT 'both',
  ALTER COLUMN role SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'certificates_role_check'
      AND conrelid = 'public.certificates'::regclass
  ) THEN
    ALTER TABLE public.certificates
      ADD CONSTRAINT certificates_role_check
      CHECK (role IN ('developer', 'illustrator', 'both'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS certificates_role_idx
  ON public.certificates (role);

INSERT INTO public.certificates (
  title,
  issuer,
  issued_date,
  description,
  credential_url,
  role
)
SELECT
  seed.title,
  seed.issuer,
  seed.issued_date,
  seed.description,
  NULL,
  seed.role
FROM (
  VALUES
    (
      'IBM SkillsBuild: Classifying Data Using IBM Granite',
      'IBM SkillsBuild',
      'November 2026',
      'Sertifikat pelatihan yang tercantum pada CV dan profil.',
      'developer'
    ),
    (
      'IBM SkillsBuild: Introduction to Data Concepts',
      'IBM SkillsBuild',
      'November 2026',
      'Sertifikat pelatihan yang tercantum pada CV dan profil.',
      'developer'
    ),
    (
      'IBM SkillsBuild: Getting Started with Data',
      'IBM SkillsBuild',
      'November 2026',
      'Sertifikat pelatihan yang tercantum pada CV dan profil.',
      'developer'
    ),
    (
      'Web Development Competition – Participant',
      'HIMATIK Politeknik Negeri Jakarta',
      '2026',
      'Peserta kategori University Student pada iTechno Cup 2026.',
      'developer'
    ),
    (
      'Group Project Completion – Novo Club Batch 4',
      'Paragon Corp & Globerse',
      '2026',
      'Sertifikat penyelesaian group project Novo Club Batch 4.',
      'developer'
    ),
    (
      'Katstruction – Hackathon Participant',
      'iTechno Cup',
      '2026',
      'Penghargaan partisipasi yang tercantum pada profil.',
      'developer'
    ),
    (
      'Certificate of Participation – Hackathon 9.0 (Web3 Innovation)',
      'ICP HUB Indonesia & Disruptives ID',
      '2026',
      'Sertifikat partisipasi yang tercantum pada CV.',
      'developer'
    ),
    (
      'Software Engineering Professional',
      NULL,
      NULL,
      'Sertifikasi yang tercantum pada bagian Certifications di profil.',
      'developer'
    ),
    (
      'Sertifikat Apresiasi: Digitalisasi Transaksi Penawaran dan Penjualan',
      'Ruang Elegan',
      '2025',
      'Sertifikat apresiasi atas kontribusi digitalisasi transaksi penawaran dan penjualan.',
      'developer'
    ),
    (
      'Sertifikat Panitia Kompetisi Nasional REACTOR 2025',
      'Politeknik STMI Jakarta',
      '2025',
      'Sertifikat kepanitiaan Divisi Hackathon.',
      'developer'
    ),
    (
      'Top 10 National Ericsson Hackathon',
      'Ericsson, Kementerian Perindustrian, BPSDMI, dan PIDI 4.0',
      '2025',
      'Penghargaan Top 10 National Ericsson Hackathon.',
      'developer'
    ),
    (
      'Sertifikat Pemateri: Mentoring Sistem Informasi Akuntansi',
      'HIMASIS Politeknik STMI Jakarta',
      '9 November 2025',
      'Sertifikat sebagai pemateri mentoring Sistem Informasi Akuntansi untuk SIIO 2024.',
      'developer'
    ),
    (
      'Menciptakan Copilot Pribadi dengan Azure AI Foundry',
      'Microsoft Elevate & Dicoding',
      '20 November 2025',
      'Sertifikat short course yang tercantum pada CV dan profil.',
      'developer'
    ),
    (
      'Juara Favorit 2 Lomba Daur Ulang Sampah',
      'Dies Natalis ke-57 Politeknik STMI Jakarta',
      'September 2025',
      'Penghargaan yang tercantum pada CV.',
      'both'
    ),
    (
      'Sertifikat Literasi Digital Nasional',
      'Kementerian Komunikasi dan Informatika Republik Indonesia',
      NULL,
      'Sertifikat literasi digital yang tercantum pada CV.',
      'developer'
    ),
    (
      'Sertifikat Kompetensi KKNI Level II Rekayasa Perangkat Lunak (Application Programmer)',
      'BNSP / LSP SMKN 1 Depok',
      '4 Desember 2023',
      'Sertifikat kompetensi yang tercantum pada CV.',
      'developer'
    ),
    (
      'Sertifikat Praktik Kerja Lapangan (PKL) – Predikat Baik (B)',
      'Jakarta Global University',
      'Januari–Mei 2024',
      'Sertifikat praktik kerja lapangan yang tercantum pada CV.',
      'developer'
    )
) AS seed(title, issuer, issued_date, description, role)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.certificates existing
  WHERE lower(btrim(existing.title)) = lower(btrim(seed.title))
    AND lower(btrim(COALESCE(existing.issuer, ''))) =
      lower(btrim(COALESCE(seed.issuer, '')))
);
