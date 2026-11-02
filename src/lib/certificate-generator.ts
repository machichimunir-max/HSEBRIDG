import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db";

const CERTIFICATES_DIR = path.join(process.cwd(), "uploads", "certificates");
const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");

// Ensure directories exist
if (!fs.existsSync(CERTIFICATES_DIR)) {
  fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
}

interface CertificateData {
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  issuedDate: Date;
  locale: "fr" | "ar";
}

/**
 * Check if a string contains Arabic characters
 */
function containsArabic(text: string): boolean {
  const arabicRegex = /[؀-ۿݐ-ݿࢠ-ࣿ]/;
  return arabicRegex.test(text);
}

/**
 * Shape Arabic text for proper rendering in PDF
 * This is a simplified version - for production, use arabic-persian-reshaper
 */
function shapeArabicText(text: string): string {
  // For now, return as-is. In a real implementation, you'd use:
  // import { convertArabic } from 'arabic-persian-reshaper';
  // import { getBidiString } from 'bidi-js';
  // return getBidiString(convertArabic(text));

  // Fallback: reverse the string for basic RTL display
  // This is NOT proper Arabic shaping but works for basic testing
  if (containsArabic(text)) {
    return text.split('').reverse().join('');
  }
  return text;
}

/**
 * Generate a PDF certificate for a student
 * @param attestationId - The attestation ID
 * @returns Path to the generated PDF file
 */
export async function generateCertificatePDF(
  attestationId: string
): Promise<string> {
  // Fetch attestation with user and course data
  const attestation = await prisma.attestation.findUnique({
    where: { id: attestationId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          category: true,
          duration: true,
        },
      },
    },
  });

  if (!attestation) {
    throw new Error("Attestation not found");
  }

  const studentName = attestation.user.name || attestation.user.email;
  const courseTitle = attestation.course.title;

  // Detect if Arabic is needed
  const isArabic = containsArabic(studentName) || containsArabic(courseTitle);
  const locale: "fr" | "ar" = isArabic ? "ar" : "fr";

  const data: CertificateData = {
    certificateNumber: attestation.certificateNumber,
    studentName,
    courseTitle,
    issuedDate: attestation.issuedAt,
    locale,
  };

  // Generate PDF
  const fileName = `${attestation.certificateNumber}.pdf`;
  const filePath = path.join(CERTIFICATES_DIR, fileName);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Check if Arabic font is available
      const arabicFontPath = path.join(FONTS_DIR, "Amiri-Regular.ttf");
      const hasArabicFont = fs.existsSync(arabicFontPath);

      // Border
      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(3)
        .strokeColor("#073022")
        .stroke();

      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .lineWidth(1)
        .strokeColor("#FDCD1A")
        .stroke();

      // Use Arabic font if available and needed
      if (locale === "ar" && hasArabicFont) {
        doc.registerFont("Arabic", arabicFontPath);
      }

      // Logo placeholder / Brand name
      doc
        .fontSize(32)
        .fillColor("#073022")
        .font("Helvetica-Bold")
        .text("HSE BRIDGE", 0, 80, { align: "center" });

      doc
        .fontSize(10)
        .fillColor("#666666")
        .font("Helvetica")
        .text(
          locale === "ar"
            ? "التكوين · المعدات · التوظيف في مجال الصحة والسلامة والبيئة"
            : "Formation · Équipement · Recrutement HSE",
          0,
          120,
          { align: "center" }
        );

      // Certificate title
      doc.moveDown(2);
      doc
        .fontSize(28)
        .fillColor("#073022")
        .font("Helvetica-Bold")
        .text(
          locale === "ar" ? "شهادة إتمام" : "ATTESTATION DE RÉUSSITE",
          0,
          180,
          { align: "center" }
        );

      doc
        .fontSize(16)
        .fillColor("#FDCD1A")
        .font("Helvetica")
        .text(
          locale === "ar" ? "Certificate of Completion" : "Certificate of Completion",
          0,
          215,
          { align: "center" }
        );

      // Body text
      doc.moveDown(2);
      doc
        .fontSize(14)
        .fillColor("#333333")
        .font("Helvetica")
        .text(
          locale === "ar" ? "نشهد بأن" : "Nous certifions que",
          0,
          270,
          { align: "center" }
        );

      // Student name - use Arabic font if needed
      if (locale === "ar" && hasArabicFont) {
        doc.font("Arabic");
      }
      doc
        .fontSize(22)
        .fillColor("#073022")
        .font(locale === "ar" && hasArabicFont ? "Arabic" : "Helvetica-Bold")
        .text(data.studentName, 0, 300, { align: "center" });

      // Back to Latin font
      doc
        .fontSize(14)
        .fillColor("#333333")
        .font("Helvetica")
        .text(
          locale === "ar"
            ? "قد أتم بنجاح التكوين في"
            : "a suivi avec succès la formation",
          0,
          340,
          { align: "center" }
        );

      // Course title - use Arabic font if needed
      if (locale === "ar" && hasArabicFont) {
        doc.font("Arabic");
      }
      doc
        .fontSize(20)
        .fillColor("#073022")
        .font(locale === "ar" && hasArabicFont ? "Arabic" : "Helvetica-Bold")
        .text(data.courseTitle, 0, 370, { align: "center" });

      // Footer info
      const issueDate = data.issuedDate.toLocaleDateString(
        locale === "ar" ? "ar-SA" : "fr-FR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

      doc
        .fontSize(12)
        .fillColor("#666666")
        .font("Helvetica")
        .text(
          locale === "ar" ? `صدرت بتاريخ ${issueDate}` : `Délivrée le ${issueDate}`,
          0,
          460,
          { align: "center" }
        );

      doc
        .fontSize(10)
        .fillColor("#999999")
        .font("Helvetica")
        .text(
          locale === "ar"
            ? `رقم الشهادة: ${data.certificateNumber}`
            : `N° d'attestation : ${data.certificateNumber}`,
          0,
          doc.page.height - 80,
          { align: "center" }
        );

      // Signature placeholder
      doc
        .fontSize(10)
        .fillColor("#666666")
        .font("Helvetica-Oblique")
        .text(
          locale === "ar"
            ? "HSE BRIDGE - مؤسسة تكوين معتمدة"
            : "HSE BRIDGE - Organisme de formation certifié",
          0,
          500,
          { align: "center" }
        );

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get the file path for a certificate
 * @param certificateNumber - The certificate number
 * @returns File path or null if not found
 */
export function getCertificateFilePath(
  certificateNumber: string
): string | null {
  const fileName = `${certificateNumber}.pdf`;
  const filePath = path.join(CERTIFICATES_DIR, fileName);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return null;
}

/**
 * Update attestation with PDF URL
 * @param attestationId - The attestation ID
 * @param pdfFileName - The PDF file name
 */
export async function updateAttestationPdfUrl(
  attestationId: string,
  pdfFileName: string
) {
  await prisma.attestation.update({
    where: { id: attestationId },
    data: {
      pdfUrl: `/certificates/${pdfFileName}`, // Virtual path (served via API)
    },
  });
}
