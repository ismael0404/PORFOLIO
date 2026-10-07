import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BriefcaseBusiness, GraduationCap, Sparkles, Award } from "lucide-react";

const journey = [
  {
    period: "2022 – 2023",
    title: "Baccalauréat",
    organization: "Groupe Scolaire Fusos Cours Sociaux d’Abobo",
    description: "Obtention du baccalauréat.",
    type: "Formation",
    icon: GraduationCap,
  },
  {
    period: "2023 – 2025",
    title: "Licence 1 & Licence 2 MIAGE",
    organization: "Université Polytechnique de Bingerville (UPB)",
    description:
      "Formation en Méthodes Informatiques Appliquées à la Gestion d’Entreprise (MIAGE), combinant informatique et gestion.",
    type: "Formation",
    icon: GraduationCap,
  },
  {
    period: "2025 – 2026",
    title: "Licence 3 MIAGE",
    organization: "Institut Universitaire d’Abidjan (IUA)",
    description:
      "Finalisation de ma Licence 3 MIAGE. Mention Très Bien obtenue à l’issue de ma formation et de ma soutenance.",
    type: "Formation",
    distinction: "Mention Très Bien",
    icon: Award,
  },
  {
    period: "Juin – Septembre 2026",
    title: "Stage",
    organization: "RS Majestic Groupe",
    role: "Développeur Web Front-End & Technicien de Maintenance Informatique",
    description:
      "Développement et amélioration d’interfaces web, maintenance informatique et résolution de problèmes techniques.",
    type: "Expérience professionnelle",
    icon: BriefcaseBusiness,
  },
];

export const JourneySection = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 45%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="parcours"
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-12 space-y-3 text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-mono text-primary sm:mb-4 sm:px-4 sm:py-2 sm:text-lg">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            Mon parcours
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Mon parcours
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4 sm:text-lg">
            De ma formation en MIAGE à mes premières expériences professionnelles.
          </p>
        </motion.div>

        <div ref={timelineRef} className="relative">
          <div className="absolute bottom-3 left-4 top-3 w-px -translate-x-1/2 bg-border md:left-1/2">
            <motion.div
              className="h-full w-full origin-top bg-primary/60"
              style={{ scaleY: progress }}
            />
          </div>

          <ol className="space-y-8 md:space-y-10">
            {journey.map((step, index) => {
              const Icon = step.icon;
              const cardPosition =
                index % 2 === 0
                  ? "md:col-start-1 md:row-start-1"
                  : "md:col-start-3 md:row-start-1";

              return (
                <motion.li
                  key={step.title}
                  className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <div className="z-10 col-start-1 row-start-1 flex justify-center pt-1 md:col-start-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-background text-primary shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <article
                    className={`col-start-2 row-start-1 h-full rounded-xl border bg-background/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md sm:p-6 ${cardPosition} ${index % 2 === 0 ? "md:text-right" : ""}`}
                  >
                    <div className={`mb-3 flex flex-wrap items-center gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="font-mono text-sm font-semibold text-primary sm:text-base">
                        {step.period}
                      </span>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {step.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
                    <p className="mt-1 text-sm font-medium text-foreground/80 sm:text-base">
                      {step.organization}
                    </p>
                    {step.role && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {step.role}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {step.description}
                    </p>
                    {step.distinction && (
                      <div className={`mt-4 ${index % 2 === 0 ? "md:flex md:justify-end" : ""}`}>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:text-sm">
                          <Award className="h-3.5 w-3.5" aria-hidden="true" />
                          {step.distinction}
                        </span>
                      </div>
                    )}
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};