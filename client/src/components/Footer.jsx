import {
  ArrowUp,
  Linkedin,
  Instagram,
  Github,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/ismael-naon-21357442", label: "LinkedIn" },
    { icon: <Instagram size={18} />, href: "mailto:ismaelnaon4@gmail.com", label: "Instagram" },
    { icon: <Github size={18} />, href: "https://github.com/ismael0404", label: "GitHub" },
  ];

  const quickLinks = [
    { name: "Accueil", href: "#hero" },
    { name: "À propos", href: "#about" },
    { name: "Projets", href: "#work" },
    { name: "Contact", href: "#contact" },
  ];

  const contactInfo = [
    { icon: <Mail size={16} />, text: "ismaelnaon4@gmail.com", href: "mailto:ismaelnaon4@gmail.com" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="px-4 sm:px-6 py-10 sm:py-12 mt-12 sm:mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Glass background container */}
        <motion.div 
          className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-xl p-5 sm:p-8 border border-white/20 dark:border-gray-700/50 shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Branding */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">NAON ISMAEL</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Développeur créant des expériences numériques significatives.
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div variants={itemVariants}>
              <h4 className="text-gray-900 dark:text-white font-medium mb-4 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a 
                      href={link.href} 
                      className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <h4 className="text-gray-900 dark:text-white font-medium mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => (
                  <motion.li 
                    key={index}
                    className="flex min-w-0 items-start gap-3 text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="shrink-0 text-gray-600 dark:text-gray-400 mt-0.5">{info.icon}</span>
                    {info.href ? (
                      <a 
                        href={info.href} 
                        className="min-w-0 break-all hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-gray-600 dark:text-gray-300"
                      >
                        {info.text}
                      </a>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300">{info.text}</span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* Bottom bar */}
          <motion.div 
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700/50 flex flex-col items-center gap-4 text-center text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:justify-between sm:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <p>© {currentYear} NAON ISMAEL. Tous droits réservés.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:justify-end">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</a>
              <motion.a
                href="#hero"
                aria-label="Retour en haut"
                className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp size={16} />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};