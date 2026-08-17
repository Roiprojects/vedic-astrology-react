/**
 * Generates a beautifully designed Vedic astrology PDF report using pdfkit.
 */
import PDFDocument from "pdfkit";
import type { BirthDetails, AstrologyReport } from "./astrology-ai";

const SAFFRON = "#b45309";
const GOLD = "#d97706";
const DARK = "#1c1010";
const MUTED = "#6b4a2a";
const BG_LIGHT = "#fffbf0";

function formatDate(dob: string): string {
  try {
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return dob;
  }
}

export function generateReportPdf(
  birth: BirthDetails,
  report: AstrologyReport,
  serviceTitle: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: `Vedic Astrology Report — ${birth.name}`,
        Author: "Sampath Kumara Guruji — My Vedic Astrology",
        Subject: serviceTitle,
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width - 120; // usable width

    // ── Header band ─────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 90).fill(SAFFRON);
    doc.fontSize(22).fillColor("white").font("Helvetica-Bold")
      .text("ॐ My Vedic Astrology", 60, 22, { width: W });
    doc.fontSize(10).font("Helvetica").fillColor("#ffe9b3")
      .text("Sampath Kumara Guruji · myvedicastrology.in · Bangalore", 60, 50, { width: W });
    doc.fontSize(11).fillColor("white")
      .text(serviceTitle + " — Personalized Consultation Report", 60, 68, { width: W });

    doc.moveDown(4);

    // ── Birth details box ────────────────────────────────────
    sectionBox(doc, "🌟 Birth Details", W);
    const details: [string, string][] = [
      ["Name", birth.name],
      ["Date of Birth", formatDate(birth.dob)],
      ["Time of Birth", birth.tob],
      ["Place of Birth", birth.pob],
      ["Gender", birth.gender],
      ["Nakshatra", report.nakshatra],
      ["Rashi (Moon Sign)", report.rashi],
      ["Lagna (Ascendant)", report.lagna],
      ["Ruling Planet / Dasha", report.ruling_planet],
    ];

    doc.font("Helvetica").fontSize(10).fillColor(DARK);
    details.forEach(([label, value]) => {
      const y = doc.y;
      doc.font("Helvetica-Bold").fillColor(MUTED).text(label + ":", 60, y, { width: 160, continued: false });
      doc.font("Helvetica").fillColor(DARK).text(value, 230, y, { width: W - 170 });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // ── Summary ──────────────────────────────────────────────
    sectionBox(doc, "📊 Chart Overview", W);
    bodyText(doc, report.summary, W);

    // ── Problem Analysis ─────────────────────────────────────
    sectionBox(doc, "🔍 Problem Analysis", W);
    bodyText(doc, report.problem_analysis, W);

    // ── Astrological Reason ──────────────────────────────────
    sectionBox(doc, "🪐 Astrological Reason (Parasara Hora Shastra)", W);
    bodyText(doc, report.astrological_reason, W);

    // ── Planetary Positions ──────────────────────────────────
    sectionBox(doc, "✨ Planetary Positions & Yogas", W);
    bodyText(doc, report.planetary_positions, W);

    // ── Remedies ─────────────────────────────────────────────
    sectionBox(doc, "🕉️ Remedies & Upaya", W);
    bodyText(doc, report.remedies, W);

    // ── Mantras ──────────────────────────────────────────────
    sectionBox(doc, "🙏 Prescribed Mantras", W);
    bodyText(doc, report.mantras, W);

    // ── Gemstone ─────────────────────────────────────────────
    sectionBox(doc, "💎 Gemstone Recommendation", W);
    bodyText(doc, report.gemstone_advice, W);

    // ── Auspicious Days ──────────────────────────────────────
    sectionBox(doc, "📅 Auspicious Days & Muhurta", W);
    bodyText(doc, report.auspicious_days, W);

    // ── Footer ───────────────────────────────────────────────
    doc.moveDown(2);
    const footerY = doc.page.height - 70;
    doc.rect(0, footerY, doc.page.width, 70).fill("#fdf3e3");
    doc.fontSize(9).fillColor(MUTED).font("Helvetica")
      .text(
        "This report is prepared exclusively for " + birth.name + " by Sampath Kumara Guruji based on classical Vedic astrology (Parasara Hora Shastra, Lahiri ayanamsa).\n" +
        "For follow-up: +91-XXXXXXXXXX · info@myvedicastrology.in · myvedicastrology.in",
        60, footerY + 12, { width: W, align: "center" }
      );

    doc.end();
  });
}

function sectionBox(doc: typeof PDFDocument.prototype, title: string, W: number) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.rect(60, y, W, 24).fill("#fef3c7");
  doc.fontSize(11).font("Helvetica-Bold").fillColor(SAFFRON)
    .text(title, 68, y + 6, { width: W - 16 });
  doc.moveDown(1.2);
  doc.font("Helvetica").fillColor(DARK);
}

function bodyText(doc: typeof PDFDocument.prototype, text: string, W: number) {
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text(text || "—", 60, doc.y, { width: W, align: "justify", lineGap: 2 });
  doc.moveDown(0.8);
}
