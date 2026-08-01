export const symbolLabels = {
    om: "Om",
    lotus: "Lotus",
    "lotus-coins": "Lotus Coins",
    trident: "Trident",
    sun: "Sun",
    "career-sun": "Career Sun",
    moon: "Moon",
    "moon-lotus": "Moon Lotus",
    chakra: "Chakra",
    diya: "Diya",
    "sacred-flame": "Sacred Flame",
    navagraha: "Navagraha",
    mantra: "Mantra",
    "daily-practice": "Daily Practice",
    "scales-shield": "Scales Shield",
    "sacred-book": "Sacred Book",
    "heart-knot": "Heart Knot",
    rings: "Rings",
    "home-heart": "Home Heart",
    "healing-leaf": "Healing Leaf",
    growth: "Growth",
    gemstone: "Gemstone",
    muhurta: "Muhurta",
    charity: "Charity",
    meditation: "Meditation",
    consultation: "Consultation",
    "birth-chart": "Birth Chart",
    chat: "Chat",
    spark: "Spark",
    "consultation-chat": "Consultation Chat",
};
const homamSlugToSymbol = {
    "ganapathi-homam": "om",
    "navagraha-homam": "navagraha",
    "lakshmi-kubera-homam": "lotus-coins",
    "surya-homam": "sun",
    "chandra-homam": "moon",
    "rudra-homam": "trident",
    "maha-mrityunjaya-homam": "scales-shield",
    "saraswati-homam": "sacred-book",
    "durga-homam": "scales-shield",
    "sudarshana-homam": "chakra",
    "dhanvantari-homam": "healing-leaf",
    "ayushya-homam": "growth",
    "shani-shanti-homam": "spark",
    "rahu-ketu-shanti-homam": "spark",
    "mangal-dosha-homam": "scales-shield",
    "kadali-vivaha": "lotus",
    "kumbha-vivaha": "lotus",
    "moksha-narayana-bali-tila-homa": "diya",
};
const serviceSlugToSymbol = {
    "love-relationship-problems": "heart-knot",
    "marriage-delay-divorce-issues": "rings",
    "career-confusion-job-problems": "career-sun",
    "financial-instability-debt-problems": "lotus-coins",
    "family-conflicts-domestic-issues": "home-heart",
    "mental-stress-anxiety-depression": "meditation",
    "health-wellness-astrology": "healing-leaf",
    "education-exam-success": "sacred-book",
    "business-growth-partnership-problems": "growth",
    "property-legal-court-case-guidance": "scales-shield",
};
const homamSlugToImage = {};
export function getHomamSymbol(slug) {
    return homamSlugToSymbol[slug] ?? "sacred-flame";
}
export function getHomamImage(slug) {
    return homamSlugToImage[slug];
}
export function getServiceSymbol(slug) {
    return serviceSlugToSymbol[slug] ?? "spark";
}
export function getRemedySymbol(text) {
    const value = text.toLowerCase();
    if (/mantra|chant|japa|prayer/.test(value))
        return "mantra";
    if (/gem|stone|pearl|coral|emerald|sapphire/.test(value))
        return "gemstone";
    if (/homam|homa|pooja|puja|ritual|offering/.test(value))
        return "sacred-flame";
    if (/muhurat|muhurta|auspicious|timing/.test(value))
        return "muhurta";
    if (/donat|charity|feed|help the needy/.test(value))
        return "charity";
    if (/meditat|breath|grounding|yoga/.test(value))
        return "meditation";
    if (/daily|at home|lifestyle|vrat|fasting/.test(value))
        return "daily-practice";
    return "spark";
}
