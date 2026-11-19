import { useEffect, useState } from 'react'
import { supabase } from "../../supabase";
import { Award, Upload, Trash2, ImageIcon, Plus, ExternalLink } from 'lucide-react'
import { PORTFOLIO_ROLES } from '../../utils/portfolio'
import PropTypes from 'prop-types'

const FIELD_CLASS =
  'w-full rounded-xl border border-white/10 bg-[#0d0d22] px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20'

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
)

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <article className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/5">
        {cert.Img ? (
          <>
            {!imgLoaded && (
              <div className="aspect-[16/11.5] w-full animate-pulse bg-white/5" />
            )}
            <img
              src={cert.Img}
              alt={cert.title || 'Certificate'}
              onLoad={() => setImgLoaded(true)}
              className={`aspect-[16/11.5] w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'block' : 'hidden'}`}
            />
          </>
        ) : (
          <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-indigo-500/20 via-[#111027] to-purple-500/20">
            <Award className="h-10 w-10 text-indigo-200/80" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="text-sm font-semibold leading-snug text-white">
            {cert.title || 'Certificate image'}
          </h2>
          {cert.issuer && <p className="text-xs text-indigo-200">{cert.issuer}</p>}
          {cert.issued_date && <p className="text-xs text-gray-500">{cert.issued_date}</p>}
          {cert.description && (
            <p className="text-xs leading-relaxed text-gray-400">{cert.description}</p>
          )}
          <p className="mt-auto pt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-purple-300">
            {PORTFOLIO_ROLES[cert.role]?.label || 'Both portfolios'}
          </p>
          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white"
            >
              Verify credential <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <div className="border-t border-white/8 pt-2">
            <button
              onClick={() => onDelete(cert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

CertCard.propTypes = {
  cert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Img: PropTypes.string,
    title: PropTypes.string,
    issuer: PropTypes.string,
    issued_date: PropTypes.string,
    description: PropTypes.string,
    credential_url: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [description, setDescription] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [role, setRole] = useState('developer')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCerts = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError(`Could not load certificates: ${fetchError.message}`)
      setCerts([])
    } else {
      setCerts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async () => {
    if (!title.trim()) {
      setError('Certificate title is required.')
      return
    }

    setUploading(true)
    setError('')
    try {
      let imageUrl = null
      if (file) {
        const fileName = `cert-${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('certificate-images')
          .upload(fileName, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage
          .from('certificate-images')
          .getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }

      const { error: insertError } = await supabase.from('certificates').insert({
        Img: imageUrl,
        title: title.trim(),
        issuer: issuer.trim() || null,
        issued_date: issuedDate.trim() || null,
        description: description.trim() || null,
        credential_url: credentialUrl.trim() || null,
        role,
      })
      if (insertError) throw insertError

      setFile(null)
      setPreview(null)
      setTitle('')
      setIssuer('')
      setIssuedDate('')
      setDescription('')
      setCredentialUrl('')
      setRole('developer')
      await fetchCerts()
    } catch (uploadError) {
      setError(`Could not save certificate: ${uploadError.message}`)
    } finally {
      setUploading(false)
    }
  }

  const deleteCert = async (id) => {
    if (!confirm('Delete this certificate?')) return
    const { error: deleteError } = await supabase.from('certificates').delete().eq('id', id)
    if (deleteError) {
      setError(`Could not delete certificate: ${deleteError.message}`)
      return
    }
    fetchCerts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Certificates</h1>
          <p className="text-gray-500 text-xs">
            {loading ? 'Loading...' : `${certs.length} certificates total`}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" /> Upload Certificate
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Certificate / award title
              </span>
              <input
                className={FIELD_CLASS}
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder="e.g. Software Engineering Professional"
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Issuer
              </span>
              <input
                className={FIELD_CLASS}
                value={issuer}
                onChange={event => setIssuer(event.target.value)}
                placeholder="Organization or provider"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Issue date
              </span>
              <input
                className={FIELD_CLASS}
                value={issuedDate}
                onChange={event => setIssuedDate(event.target.value)}
                placeholder="e.g. November 2025"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Portfolio role
              </span>
              <select
                className={FIELD_CLASS}
                value={role}
                onChange={event => setRole(event.target.value)}
              >
                <option value="developer">{PORTFOLIO_ROLES.developer.label}</option>
                <option value="illustrator">{PORTFOLIO_ROLES.illustrator.label}</option>
                <option value="both">Show in both portfolios</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Credential URL
              </span>
              <input
                className={FIELD_CLASS}
                type="url"
                value={credentialUrl}
                onChange={event => setCredentialUrl(event.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                Description
              </span>
              <textarea
                className={`${FIELD_CLASS} resize-y`}
                value={description}
                onChange={event => setDescription(event.target.value)}
                placeholder="Optional details"
                rows={3}
              />
            </label>
          </div>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-indigo-400/60 bg-indigo-500/10' : 'border-white/12 bg-white/4 hover:border-indigo-500/35 hover:bg-white/7'
            }`}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-sm text-gray-300">Add a certificate image (optional)</p>
                <p className="text-xs text-gray-600">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs text-gray-400">{file.name}</p>
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null) }}
                className="shrink-0 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white"
              >
                Remove image
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploading || !title.trim()}
              className="relative group/u disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#4f52c9] to-[#8644c5] opacity-60 blur transition duration-300 group-hover/u:opacity-100" />
              <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-[#030014] px-4 py-2">
                {uploading ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <Upload className="h-3.5 w-3.5 text-indigo-400" />}
                <span className="text-xs text-gray-200">{uploading ? 'Saving...' : 'Save certificate'}</span>
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No certificates yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}