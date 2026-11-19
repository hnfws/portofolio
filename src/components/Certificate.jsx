import { useState } from "react";
import { Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Award, ExternalLink } from "lucide-react";
import PropTypes from "prop-types";

const Certificate = ({ certificate }) => {
  const [open, setOpen] = useState(false);
  const { Img, title, issuer, issued_date: issuedDate, description, credential_url: credentialUrl } =
    certificate;

  return (
    <>
      <article className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1">
        {Img ? (
          <button
            type="button"
            className="block w-full overflow-hidden bg-black/20"
            onClick={() => setOpen(true)}
            aria-label={`View ${title || "certificate"}`}
          >
            <img
              src={Img}
              alt={title || "Certificate"}
              className="aspect-[16/11.5] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ) : (
          <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-indigo-500/20 via-[#111027] to-purple-500/20">
            <Award className="h-10 w-10 text-indigo-200/80" />
          </div>
        )}

        <div className="space-y-2 p-4">
          <h3 className="font-semibold leading-snug text-white">
            {title || "Certificate"}
          </h3>
          {issuer && <p className="text-sm text-indigo-200">{issuer}</p>}
          {issuedDate && <p className="text-xs text-slate-400">{issuedDate}</p>}
          {description && (
            <p className="text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          )}
          {credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 pt-1 text-sm text-indigo-300 transition-colors hover:text-white"
            >
              Verify credential <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </article>

      {Img && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex h-full items-center justify-center p-4 outline-none">
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="Close certificate"
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.65)",
                  zIndex: 1,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                }}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={Img}
                alt={title || "Certificate"}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

Certificate.propTypes = {
  certificate: PropTypes.shape({
    Img: PropTypes.string,
    title: PropTypes.string,
    issuer: PropTypes.string,
    issued_date: PropTypes.string,
    description: PropTypes.string,
    credential_url: PropTypes.string,
  }).isRequired,
};

export default Certificate;
