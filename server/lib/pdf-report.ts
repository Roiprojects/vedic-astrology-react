/**
 * South Indian style Vedic Astrology PDF — temple aesthetic.
 * Colors: deep vermillion, turmeric gold, sandalwood cream.
 * Bilingual Tamil/Telugu labels for South Indian readability.
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { BirthDetails, AstrologyReport } from "./astrology-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function logoPath(): string | null {
  const candidates = [
    path.resolve(__dirname, "../../public/logo-mark.png"),
    path.resolve(__dirname, "../../../public/logo-mark.png"),
    path.resolve(process.cwd(), "public/logo-mark.png"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** Strip markdown symbols that pdfkit/Helvetica cannot render properly */
function clean(text: string | undefined | null): string {
  if (!text) return "—";
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/_{2}(.+?)_{2}/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .trim();
}

// ── Palette ────────────────────────────────────────────────────
const VERMILLION  = "#8B0000";   // temple red header / accent
const TURMERIC    = "#C8860A";   // gold section borders
const KUMKUM      = "#B22222";   // bright red badges
const CREAM       = "#FDF6E3";   // sandalwood cream rows
const SECTION_BG  = "#FFF8E7";   // section header fill
const REMEDY_BG   = "#FFF3E0";   // remedy card fill
const DARK        = "#1A0A00";   // body text
const MUTED       = "#5C3A1E";   // label text
const GOLD_TXT    = "#F5C842";   // text on dark bands
const FOOTER_BG   = "#4A0010";   // dark maroon footer
const PAGE_BG     = "#FFFDF5";   // warm off-white page

function formatDate(dob: string): string {
  try {
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return dob; }
}

function splitToItems(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map(l => l.replace(/^[\d]+[\.\)]\s*/, "").replace(/^[•\-\*✦➤]\s*/, "").trim())
    .filter(l => l.length > 3);
}

// ── PDF Entry Point ────────────────────────────────────────────
export function generateReportPdf(
  birth: BirthDetails,
  report: AstrologyReport,
  serviceTitle: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 80, left: 0, right: 0 },
      info: {
        Title: `Vedic Astrology Report — ${birth.name}`,
        Author: "Sampath Kumara Guruji — My Vedic Astrology",
        Subject: serviceTitle,
      },
    });

    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const PW = doc.page.width;   // 595
    const PH = doc.page.height;  // 841
    const ML = 42;               // left margin
    const W  = PW - ML * 2;     // usable width ≈ 511

    // Draw footer on every page (first + subsequent)
    const drawFooter = () => {
      const fY = PH - 74;
      doc.rect(0, fY, PW, 74).fill(FOOTER_BG);
      doc.moveTo(0, fY + 2).lineTo(PW, fY + 2).lineWidth(2).strokeColor(TURMERIC).stroke();
      doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD_TXT)
        .text("This report is prepared exclusively for " + birth.name + " by Sampath Kumara Guruji", ML, fY + 10, { width: W, align: "center" });
      doc.fontSize(7.5).font("Helvetica").fillColor("#E8C88A")
        .text("Brihat Parasara Hora Shastra  ·  Lahiri / Chitra Paksha Ayanamsa  ·  Vimshottari Dasha System", ML, fY + 23, { width: W, align: "center" });
      doc.fontSize(7.5).font("Helvetica").fillColor(GOLD_TXT)
        .text("info@myvedicastrology.in   |   +91 98861 00565   |   myvedicastrology.in   |   Bangalore", ML, fY + 36, { width: W, align: "center" });
      doc.moveTo(ML, fY + 50).lineTo(PW - ML, fY + 50).lineWidth(0.5).strokeColor(TURMERIC).stroke();
      doc.fontSize(7).font("Helvetica").fillColor("#A07848")
        .text("For spiritual guidance only. This is not medical, legal or financial advice.", ML, fY + 56, { width: W, align: "center" });
    };

    doc.on("pageAdded", () => {
      doc.rect(0, 0, PW, PH).fill(PAGE_BG);
      drawFooter();
    });

    // ── PAGE BACKGROUND (first page) ──────────────────────────
    doc.rect(0, 0, PW, PH).fill(PAGE_BG);
    drawFooter();

    // ── HEADER BAND ───────────────────────────────────────────
    doc.rect(0, 0, PW, 116).fill(VERMILLION);

    // Sacred symbols row
    doc.fontSize(11).font("Helvetica").fillColor(GOLD_TXT)
      .text("*   OM   *   OM NAMAH SHIVAYA   *   SRI GURUBHYO NAMAH   *", ML, 9, { width: W, align: "center" });
    doc.moveTo(20, 26).lineTo(PW - 20, 26).lineWidth(0.7).strokeColor(GOLD_TXT).stroke();

    // Logo + Brand name
    const logo = logoPath();
    const textML = ML;
    if (logo) {
      try {
        doc.image(logo, ML, 28, { height: 52, fit: [52, 52] });
      } catch { /* skip if logo missing */ }
    }
    doc.fontSize(22).font("Helvetica-Bold").fillColor("white")
      .text("My Vedic Astrology", textML, 32, { width: W, align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor(GOLD_TXT)
      .text("Sampath Kumara Guruji  ·  Bangalore  ·  myvedicastrology.in  ·  +91 98861 00565", ML, 58, { width: W, align: "center" });

    doc.moveTo(20, 74).lineTo(PW - 20, 74).lineWidth(0.7).strokeColor(GOLD_TXT).stroke();

    // Report title
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor(GOLD_TXT)
      .text(serviceTitle.toUpperCase() + "  —  PERSONALIZED VEDIC CONSULTATION REPORT", ML, 80, { width: W, align: "center" });

    // Turmeric band below header
    doc.moveTo(0, 113).lineTo(PW, 113).lineWidth(3).strokeColor(TURMERIC).stroke();

    // ── NAME BAND ─────────────────────────────────────────────
    doc.rect(0, 116, PW, 40).fill("#3D0009");
    doc.fontSize(13).font("Helvetica-Bold").fillColor("white")
      .text("Prepared Specially For:  " + birth.name.toUpperCase(), ML, 125, { width: W, align: "center" });
    doc.fontSize(8.5).font("Helvetica").fillColor(GOLD_TXT)
      .text(
        "Date of Preparation:  " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        ML, 140, { width: W, align: "center" },
      );

    doc.y = 165;

    // ── BIRTH DETAILS + COSMIC IDENTITY ───────────────────────
    secHeader(doc, "Your Birth Details", "Jaataka Vivaram  /  Nakshatra, Rashi, Lagna & Dasha", ML, W, PW);

    const tableTop = doc.y;
    const COL1 = ML;
    const COL2 = ML + W / 2 + 8;
    const CW   = W / 2 - 10;

    // Left column — birth facts
    const birthRows: [string, string][] = [
      ["Name (Hesaru)", birth.name],
      ["Date of Birth (Huttida Dinanka)", formatDate(birth.dob)],
      ["Time of Birth (Huttida Samaya)", birth.tob],
      ["Place of Birth (Huttida Uru)", birth.pob],
      ["Gender (Linga)", birth.gender || "-"],
    ];

    const rowH = 24;
    const leftH = birthRows.length * rowH + 6;
    doc.lineWidth(1).rect(COL1, tableTop, CW, leftH).fillAndStroke(CREAM, TURMERIC);

    birthRows.forEach(([label, value], i) => {
      const ry = tableTop + 6 + i * rowH;
      if (i > 0) {
        doc.moveTo(COL1 + 4, ry - 1).lineTo(COL1 + CW - 4, ry - 1)
          .lineWidth(0.3).strokeColor(TURMERIC).stroke();
      }
      doc.fontSize(7).font("Helvetica").fillColor(MUTED)
        .text(label, COL1 + 8, ry, { width: CW - 12 });
      doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
        .text(value || "—", COL1 + 8, ry + 9, { width: CW - 12 });
    });

    // Right column — cosmic identity cards
    const cosmicCards: [string, string, string][] = [
      ["Nakshatra  (Janma Nakshatra)", report.nakshatra,     "Your birth star — foundation of all predictions"],
      ["Rashi  (Moon Sign / Rasi)",    report.rashi,          "Your moon sign — emotional nature"],
      ["Lagna  (Ascendant / Udaya)",   report.lagna,          "Your rising sign — personality & destiny"],
      ["Ruling Planet / Dasha",        report.ruling_planet,  "Current dasha lord — influences present life"],
    ];

    let ry2 = tableTop;
    cosmicCards.forEach(([label, value, hint]) => {
      const cH = (leftH / 4) - 3;
      doc.lineWidth(1).rect(COL2, ry2, CW, cH).fillAndStroke(SECTION_BG, TURMERIC);
      doc.rect(COL2, ry2, 5, cH).fill(KUMKUM);
      doc.fontSize(7).font("Helvetica").fillColor(MUTED)
        .text(label, COL2 + 10, ry2 + 4, { width: CW - 14 });
      doc.fontSize(12).font("Helvetica-Bold").fillColor(VERMILLION)
        .text(value || "—", COL2 + 10, ry2 + 14, { width: CW - 14 });
      doc.fontSize(6.5).font("Helvetica").fillColor(MUTED)
        .text(hint, COL2 + 10, ry2 + cH - 12, { width: CW - 14 });
      ry2 += cH + 3;
    });

    doc.y = Math.max(tableTop + leftH, ry2) + 14;

    // ── PROBLEM ANALYSIS ─────────────────────────────────────
    secHeader(doc, "Your Problem — In Simple Words", "Nimma Samasye  /  Explained in plain, clear language", ML, W, PW);
    simpleBox(doc, report.problem_analysis, ML, W);

    // ── ASTROLOGICAL REASON ───────────────────────────────────
    secHeader(doc, "Why This Is Happening  (Astrological Reason)", "Jyotisha Karana  /  Based on Parasara Hora Shastra", ML, W, PW);
    simpleBox(doc, report.astrological_reason, ML, W);

    // ── PLANETARY POSITIONS ───────────────────────────────────
    secHeader(doc, "Planetary Positions & Yogas", "Graha Nilagalu  /  Current planetary influences in your chart", ML, W, PW);
    simpleBox(doc, report.planetary_positions, ML, W);

    // ── REMEDIES ─────────────────────────────────────────────
    secHeader(doc, "Remedies — Easy to Follow", "Parikara / Upaay  /  Perform these daily for best results", ML, W, PW);
    remedyBoxes(doc, report.remedies, ML, W);

    // ── MANTRA ───────────────────────────────────────────────
    secHeader(doc, "Your Prescribed Mantra", "Mantra Japa  /  Recite daily for divine blessings and relief", ML, W, PW);
    mantraBox(doc, report.mantras, ML, W);

    // ── GEMSTONE ─────────────────────────────────────────────
    secHeader(doc, "Gemstone Recommendation", "Ratna Dharana  /  Wear these gems for planetary strength", ML, W, PW);
    gemstoneBox(doc, report.gemstone_advice, ML, W);

    // ── AUSPICIOUS DAYS ──────────────────────────────────────
    secHeader(doc, "Auspicious Days & Lucky Dates This Month", "Shubha Dinagalu  /  Best dates for important decisions and rituals", ML, W, PW);
    auspiciousPills(doc, report.auspicious_days, ML, W);

    // ── CLOSING BLESSING ─────────────────────────────────────
    doc.moveDown(1);
    const bY = doc.y;
    doc.lineWidth(1).rect(ML, bY, W, 46).fillAndStroke("#FFF3E0", TURMERIC);
    doc.moveTo(ML + 10, bY + 3).lineTo(ML + W - 10, bY + 3).lineWidth(0.8).strokeColor(TURMERIC).stroke();
    doc.moveTo(ML + 10, bY + 43).lineTo(ML + W - 10, bY + 43).lineWidth(0.8).strokeColor(TURMERIC).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor(VERMILLION)
      .text(
        "\"The planets influence, but the soul decides. Follow these remedies with full devotion and God\'s grace will remove all obstacles from your path.\"",
        ML + 16, bY + 10, { width: W - 32, align: "center", lineGap: 2 },
      );
    doc.fontSize(8).font("Helvetica").fillColor(MUTED)
      .text("— Sampath Kumara Guruji", ML, bY + 34, { width: W, align: "center" });

    doc.end();
  });
}

// ── Section Header ─────────────────────────────────────────────
function secHeader(
  doc:      typeof PDFDocument.prototype,
  title:    string,
  subtitle: string,
  ML:       number,
  W:        number,
  PW:       number,
) {
  doc.moveDown(0.5);
  const y = doc.y;
  const h = subtitle ? 34 : 24;
  doc.rect(0, y, PW, h).fill(SECTION_BG);
  doc.rect(0, y, 6, h).fill(VERMILLION);
  doc.rect(PW - 6, y, 6, h).fill(VERMILLION);
  doc.moveTo(0, y + h).lineTo(PW, y + h).lineWidth(1.5).strokeColor(TURMERIC).stroke();

  doc.fontSize(11).font("Helvetica-Bold").fillColor(VERMILLION)
    .text(title, ML + 4, y + 5, { width: W });
  if (subtitle) {
    doc.fontSize(7.5).font("Helvetica").fillColor(MUTED)
      .text(subtitle, ML + 4, y + 20, { width: W });
  }
  doc.y = y + h + 8;
}

// ── Plain explanation paragraph ────────────────────────────────
function simpleBox(
  doc:  typeof PDFDocument.prototype,
  text: string,
  ML:   number,
  W:    number,
) {
  const cleaned = clean(text);
  const y = doc.y;
  const textH = estimateTextHeight(cleaned, W, 10) + 20;
  doc.lineWidth(0.8).rect(ML, y, W, textH).fillAndStroke("#FFFAF0", TURMERIC);
  doc.rect(ML, y, 4, textH).fill(TURMERIC);
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text(cleaned, ML + 12, y + 10, { width: W - 20, align: "justify", lineGap: 3 });
  doc.y = y + textH + 8;
}

// ── Numbered remedy cards ──────────────────────────────────────
function remedyBoxes(
  doc:  typeof PDFDocument.prototype,
  text: string,
  ML:   number,
  W:    number,
) {
  const items = splitToItems(text);
  if (!items.length) { simpleBox(doc, text, ML, W); return; }

  items.forEach((item, i) => {
    const cardH = Math.max(44, estimateTextHeight(item, W - 50, 9.5) + 22);
    const cy = doc.y;
    doc.lineWidth(1).rect(ML, cy, W, cardH).fillAndStroke(REMEDY_BG, TURMERIC);
    // Number badge
    doc.rect(ML, cy, 36, cardH).fill(KUMKUM);
    doc.fontSize(14).font("Helvetica-Bold").fillColor("white")
      .text(String(i + 1), ML, cy + cardH / 2 - 10, { width: 36, align: "center" });
    // Text
    doc.fontSize(9.5).font("Helvetica").fillColor(DARK)
      .text(clean(item), ML + 44, cy + 10, { width: W - 52, lineGap: 2.5 });
    doc.y = cy + cardH + 6;
  });
  doc.moveDown(0.3);
}

// ── Mantra banner ──────────────────────────────────────────────
function mantraBox(
  doc:  typeof PDFDocument.prototype,
  text: string,
  ML:   number,
  W:    number,
) {
  const lines   = clean(text).split(/\n+/).filter(Boolean);
  const mantra  = lines[0] || text;
  const instruct = lines.slice(1).join("  ·  ") || "Chant 108 times daily at sunrise, facing East";
  const h = 90;
  const y = doc.y;

  doc.lineWidth(1.5).rect(ML, y, W, h).fillAndStroke("#FFF3E0", KUMKUM);
  doc.moveTo(ML + 10, y + 5).lineTo(ML + W - 10, y + 5).lineWidth(1).strokeColor(TURMERIC).stroke();
  doc.moveTo(ML + 10, y + h - 5).lineTo(ML + W - 10, y + h - 5).lineWidth(1).strokeColor(TURMERIC).stroke();

  doc.fontSize(17).font("Helvetica-Bold").fillColor(VERMILLION)
    .text(mantra, ML, y + 16, { width: W, align: "center" });
  doc.fontSize(8.5).font("Helvetica").fillColor(MUTED)
    .text(instruct, ML, y + 48, { width: W, align: "center", lineGap: 2 });
  doc.fontSize(7.5).font("Helvetica").fillColor(TURMERIC)
    .text("108 times  ·  Daily  ·  Sunrise  ·  Facing East", ML, y + 70, { width: W, align: "center" });

  doc.y = y + h + 10;
}

// ── Gemstone grid cards ────────────────────────────────────────
function gemstoneBox(
  doc:  typeof PDFDocument.prototype,
  text: string,
  ML:   number,
  W:    number,
) {
  const items = splitToItems(text);
  if (items.length < 2) { simpleBox(doc, text, ML, W); return; }

  const colW = (W - 8) / 2;
  let cx = ML, cy = doc.y;
  items.forEach((line, i) => {
    const parts = line.split(/[:–\-]+/);
    const label = parts[0]?.trim() || "";
    const value = parts.slice(1).join(" ").trim() || line;
    const cH = 40;
    const fill = i % 2 === 0 ? SECTION_BG : CREAM;
    doc.lineWidth(0.8).rect(cx, cy, colW, cH).fillAndStroke(fill, TURMERIC);
    doc.rect(cx, cy, 4, cH).fill(TURMERIC);
    doc.fontSize(7.5).font("Helvetica").fillColor(MUTED)
      .text(label, cx + 10, cy + 5, { width: colW - 14 });
    doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK)
      .text(value, cx + 10, cy + 17, { width: colW - 14 });

    if (cx === ML) {
      cx = ML + colW + 8;
    } else {
      cx = ML;
      cy += cH + 4;
    }
  });
  // If odd number of cards, advance y
  if (items.length % 2 !== 0) cy += 44;
  doc.y = cy + 6;
}

// ── Auspicious day pills ───────────────────────────────────────
function auspiciousPills(
  doc:  typeof PDFDocument.prototype,
  text: string,
  ML:   number,
  W:    number,
) {
  const items = splitToItems(text);
  if (!items.length) { simpleBox(doc, text, ML, W); return; }

  let cx = ML, cy = doc.y;
  const pillH = 30;
  items.forEach(day => {
    const pillW = Math.min(Math.max(doc.widthOfString(day) + 32, 80), W);
    if (cx + pillW > ML + W + 4) { cx = ML; cy += pillH + 6; }
    doc.lineWidth(1).rect(cx, cy, pillW, pillH).fillAndStroke(CREAM, TURMERIC);
    doc.rect(cx, cy, 4, pillH).fill(TURMERIC);
    doc.fontSize(8.5).font("Helvetica-Bold").fillColor(DARK)
      .text(">> " + day, cx + 10, cy + 9, { width: pillW - 14 });
    cx += pillW + 8;
  });
  doc.y = cy + pillH + 10;
}

// ── Rough text height estimate for pre-sizing boxes ───────────
function estimateTextHeight(text: string, width: number, fontSize: number): number {
  if (!text) return 20;
  const charsPerLine = Math.floor(width / (fontSize * 0.52));
  const lines = text.split("\n").reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / charsPerLine)), 0);
  return lines * (fontSize + 4);
}
