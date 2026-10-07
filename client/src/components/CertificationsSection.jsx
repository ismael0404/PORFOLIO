import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Award,
  Search,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  X,
  GraduationCap
} from "lucide-react";
import { certificationsData, certificationCategories } from "../data/certifications";
import { cn } from "@/lib/utils";

GlobalWorkerOptions.workerSrc = pdfWorker;

const CertificatePreview = ({ file, title }) => {
  const previewRef = useRef(null);
  const canvasRef = useRef(null);
  const pageRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageSize, setPageSize] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(preview);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const loadingTask = getDocument(`/certifications/${encodeURIComponent(file)}`);

    loadingTask.promise
      .then((document) => document.getPage(1))
      .then((page) => {
        if (isCancelled) return;

        pageRef.current = page;
        const viewport = page.getViewport({ scale: 1 });
        setPageSize({ width: viewport.width, height: viewport.height });
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      });

    return () => {
      isCancelled = true;
      loadingTask.destroy();
      pageRef.current = null;
    };
  }, [file]);

  useEffect(() => {
    const page = pageRef.current;
    const canvas = canvasRef.current;
    if (!page || !canvas || !pageSize || !containerWidth) return undefined;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const scale = (containerWidth / pageSize.width) * pixelRatio;
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderTask = page.render({ canvasContext: context, viewport });
    return () => renderTask.cancel();
  }, [containerWidth, pageSize]);

  return (
    <div
      ref={previewRef}
      className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-white"
      style={pageSize ? { aspectRatio: `${pageSize.width} / ${pageSize.height}` } : undefined}
    >
      {hasError ? (
        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
          Aperçu indisponible
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Aperçu complet du certificat : ${title}`}
          className="block h-full w-full"
        />
      )}
    </div>
  );
};

export const CertificationsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalCert, setActiveModalCert] = useState(null);
  const [showAllCertifications, setShowAllCertifications] = useState(false);

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return certificationsData.filter((cert) => {
      const matchesCategory =
        selectedCategory === "all" || cert.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        cert.description.toLowerCase().includes(query) ||
        cert.skills.some((s) => s.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const displayedCertifications = showAllCertifications
    ? filteredCertifications
    : filteredCertifications.slice(0, 3);

  return (
    <section id="certifications" className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-background relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-60 sm:w-80 h-60 sm:h-80 bg-secondary/5 rounded-full blur-3xl -bottom-20 -right-20" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 px-2 sm:px-6">
          <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-primary/10 border border-primary/20 mb-6 transition-all duration-500 hover:bg-primary/15 hover:scale-105 group cursor-pointer">
            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary animate-pulse" />
            <span className="text-sm sm:text-base font-semibold text-primary tracking-wide">
              ACCRÉDITATIONS & FORMATIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mes{" "}
            </span>
            <span className="text-primary">Certifications</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Parcours de formation et certifications validant mes expertises en développement web, programmation logicielle et bases de données.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-xl text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{certificationsData.length}</div>
            <div className="text-xs text-muted-foreground">Certifications Obtenues</div>
          </div>
          <div className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-xl text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{new Set(certificationsData.map((cert) => cert.issuer)).size}</div>
            <div className="text-xs text-muted-foreground">Organismes représentés</div>
          </div>
          <div className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-xl text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">100%</div>
            <div className="text-xs text-muted-foreground">Statut Vérifié</div>
          </div>
          <div className="p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-xl text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">Full Stack</div>
            <div className="text-xs text-muted-foreground">Domaines Couverts</div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher (ex: React, Java, SQL, OpenClassrooms)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card/60 border border-border text-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {certificationCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card/60 border border-border text-muted-foreground hover:text-foreground hover:bg-card"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        {filteredCertifications.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-card/30 border border-border backdrop-blur-md max-w-md mx-auto">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-1">Aucune certification trouvée</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aucun résultat ne correspond à votre recherche &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {displayedCertifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-3xl bg-card/50 border border-border/80 backdrop-blur-xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top accent line */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
                      cert.accentColor || "from-primary to-purple-500"
                    )}
                  />

                  <div>
                    {/* Top Row: Issuer & Date */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {cert.issuer}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {cert.issueDate}
                      </span>
                    </div>

                    <CertificatePreview file={cert.file} title={cert.title} />

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors duration-200">
                      {cert.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                      {cert.description}
                    </p>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cert.skills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-background/60 border border-border/60 text-foreground/80"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 4 && (
                        <span className="text-[11px] px-2 py-1 rounded-lg bg-primary/5 text-primary font-medium">
                          +{cert.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveModalCert(cert)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Détails & Compétences
                    </button>

                    <span className="text-xs text-muted-foreground">Aperçu intégré</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredCertifications.length > 3 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllCertifications((showAll) => !showAll)}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              aria-expanded={showAllCertifications}
            >
              {showAllCertifications ? "Réduire" : "Voir tous les certificats"}
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Certificate Details */}
      <AnimatePresence>
        {activeModalCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Certification Validée • {activeModalCert.issuer}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                {activeModalCert.title}
              </h2>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {activeModalCert.description}
              </p>

              {/* Highlights */}
              {activeModalCert.highlights && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Compétences Clés Acquises
                  </h4>
                  <ul className="space-y-2">
                    {activeModalCert.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Tags */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                  Technologies Couvertes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalCert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Button in Modal */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Identifiant : <span className="font-mono text-foreground font-semibold">{activeModalCert.credentialId}</span>
                </span>
                <span className="text-xs text-muted-foreground">Aperçu intégré</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
