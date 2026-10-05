import nodemailer from "nodemailer";

// Email notification service for HSE BRIDGE.
// Uses SMTP when configured via env vars; otherwise logs to console so the
// dev/test flow never breaks when SMTP is not set up.

const transporter =
  process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      })
    : null;

const DEFAULT_FROM = process.env.SMTP_FROM || "HSE BRIDGE <no-reply@hsebridge.ma>";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email. Returns true when delivered, false when it could not be
 * sent (e.g. SMTP not configured). Never throws — callers may rely on this
 * to continue their flow.
 */
export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<boolean> {
  if (!transporter) {
    // No SMTP configured: log instead of failing. This keeps E2E and dev flows
    // working without a mail server.
    console.info(
      `[email:log] To: ${to}\n[email:log] Subject: ${subject}\n[email:log] ${text}`
    );
    return false;
  }

  try {
    await transporter.sendMail({ from: DEFAULT_FROM, to, subject, text, html });
    return true;
  } catch (error) {
    console.error("Email delivery failed:", error);
    return false;
  }
}

// ---- Domain-specific notification builders (FR/AR copy) -----------------

export function welcomeEmail(name: string | null, email: string) {
  const firstName = name ? name.trim().split(" ")[0] : "Cher étudiant";
  return {
    to: email,
    subject: "Bienvenue sur HSE BRIDGE",
    text: `Bonjour ${firstName},\n\nMerci de vous être inscrit(e) sur HSE BRIDGE. Vous pouvez maintenant accéder à vos formations, suivre votre progression et, à terme, obtenir vos attestations.\n\nÀ bientôt,\nL'équipe HSE BRIDGE`,
  };
}

export function enrollmentEmail(name: string | null, email: string, courseTitle: string) {
  const firstName = name ? name.trim().split(" ")[0] : "Cher étudiant";
  return {
    to: email,
    subject: `Inscription confirmée — ${courseTitle}`,
    text: `Bonjour ${firstName},\n\nVotre inscription à la formation « ${courseTitle} » est confirmée. Vous pouvez commencer dès maintenant depuis votre tableau de bord.\n\nBonne formation,\nL'équipe HSE BRIDGE`,
  };
}

export function certificateEmail(name: string | null, email: string, courseTitle: string) {
  const firstName = name ? name.trim().split(" ")[0] : "Cher étudiant";
  return {
    to: email,
    subject: `Félicitations — Attestation de ${courseTitle}`,
    text: `Félicitations ${firstName} !\n\nVous avez terminé la formation « ${courseTitle} ». Votre attestation est disponible pour téléchargement depuis votre tableau de bord.\n\nBravo et bonne continuation,\nL'équipe HSE BRIDGE`,
  };
}

export function quoteReceivedEmail(adminEmail: string, fullName: string, categoryName: string | null, message: string) {
  return {
    to: adminEmail,
    subject: "Nouvelle demande de devis EPI/EPC",
    text: `Une nouvelle demande de devis a été reçue.\n\nClient: ${fullName}\nCatégorie: ${categoryName || "Non précisée"}\n\nMessage:\n${message}`,
  };
}

export function candidateReceivedEmail(adminEmail: string, fullName: string, domain: string) {
  return {
    to: adminEmail,
    subject: `Nouveau candidat CVthèque — ${domain}`,
    text: `Un nouveau profil a été déposé dans la CVthèque.\n\nCandidat: ${fullName}\nDomaine: ${domain}\n\nRendez-vous dans l'admin > Recrutement > Candidats pour consulter.`,
  };
}

export function employerRequestEmail(adminEmail: string, company: string, needs: string) {
  return {
    to: adminEmail,
    subject: `Nouvelle demande entreprise — ${company}`,
    text: `Une entreprise a soumis un mandat de recherche de profils HSE.\n\nEntreprise: ${company}\n\nBesoin:\n${needs}\n\nRendez-vous dans l'admin > Recrutement > Demandes entreprises.`,
  };
}
