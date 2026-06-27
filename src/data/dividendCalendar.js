// Calendrier 2026 des dividendes BRVM — source : BRVM / Daba Intelligence (semaine du 22-26 juin 2026).
// status : "paid" (détaché + payé) · "confirmed" (date confirmée) · "proposed" (annoncé, non publié officiellement BRVM).
export const DIVIDEND_CALENDAR = [
  // ── Déjà détachés & payés ──
  { date: "2026-04-23", ticker: "BOABF", name: "BOA Burkina Faso",              amount: 397.00,   yield: 6.97, country: "BF", flag: "🇧🇫", sector: "Banque",        quality: "avoid",     status: "paid" },
  { date: "2026-05-06", ticker: "BOAC",  name: "BOA Côte d'Ivoire",            amount: 594.528,  yield: 6.53, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "core",      status: "paid" },
  { date: "2026-05-26", ticker: "SNTS",  name: "Sonatel",                      amount: 1740.00,  yield: 6.00, country: "SN", flag: "🇸🇳", sector: "Télécoms",      quality: "core",      status: "paid" },
  { date: "2026-05-26", ticker: "BOAB",  name: "BOA Bénin",                    amount: 585.00,   yield: 6.48, country: "BJ", flag: "🇧🇯", sector: "Banque",        quality: "core",      status: "paid" },
  { date: "2026-05-26", ticker: "ECEC",  name: "Ecobank CI",                   amount: 781.00,   yield: 4.55, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite", status: "paid" },
  { date: "2026-06-01", ticker: "BOAS",  name: "BOA Sénégal",                  amount: 450.00,   yield: 6.17, country: "SN", flag: "🇸🇳", sector: "Banque",        quality: "core",      status: "paid" },
  { date: "2026-06-01", ticker: "SCBC",  name: "SICABLE CI",                   amount: 152.02,   yield: 3.90, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite", status: "paid" },
  { date: "2026-06-03", ticker: "BOAM",  name: "BOA Mali",                     amount: 305.04,   yield: 6.28, country: "ML", flag: "🇲🇱", sector: "Banque",        quality: "avoid",     status: "paid" },
  { date: "2026-06-08", ticker: "ORAC",  name: "Orange CI",                    amount: 704.00,   yield: 4.22, country: "CI", flag: "🇨🇮", sector: "Télécoms",      quality: "core",      status: "paid" },
  { date: "2026-06-15", ticker: "ONTBF", name: "ONATEL BF",                    amount: 145.3214, yield: 5.15, country: "BF", flag: "🇧🇫", sector: "Télécoms",      quality: "avoid",     status: "paid" },
  { date: "2026-06-19", ticker: "CBIBF", name: "Coris Bank International BF",   amount: 900.00,   yield: 4.09, country: "BF", flag: "🇧🇫", sector: "Banque",        quality: "avoid",     status: "paid" },

  // ── Dates confirmées / annoncées à venir ──
  { date: "2026-06-29", ticker: "PALC",  name: "PALMCI",                       amount: 441.40,   yield: 5.02, country: "CI", flag: "🇨🇮", sector: "Agro",          quality: "satellite", status: "confirmed" },
  { date: "2026-06-30", ticker: "ETIT",  name: "Ecobank ETI",                  amount: 0.90,     yield: 2.43, country: "TG", flag: "🇹🇬", sector: "Banque pan-AF", quality: "satellite", status: "confirmed" },
  { date: "2026-07-06", ticker: "BICC",  name: "BICICI",                       amount: 1157.20,  yield: 3.99, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite", status: "confirmed" },
  { date: "2026-07-09", ticker: "CIEC",  name: "CIE CI",                       amount: 205.92,   yield: 3.96, country: "CI", flag: "🇨🇮", sector: "Utilities",     quality: "core",      status: "proposed" },
  { date: "2026-07-15", ticker: "BIIC",  name: "BIIC",                         amount: 254.60,   yield: 4.43, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite", status: "proposed" },
  { date: "2026-07-17", ticker: "TTLS",  name: "Total Sénégal",                amount: 176.65,   yield: 5.05, country: "SN", flag: "🇸🇳", sector: "Distribution",  quality: "satellite", status: "confirmed" },
  { date: "2026-07-31", ticker: "SIBC",  name: "Société Ivoirienne de Banque", amount: 374.00,   yield: 4.21, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite", status: "confirmed" },
  { date: "2026-08-03", ticker: "LNBJ",  name: "Loterie Nationale du Bénin",   amount: 164.00,   yield: 4.00, country: "BJ", flag: "🇧🇯", sector: "Services",      quality: "satellite", status: "proposed" },
  { date: "2026-08-28", ticker: "STBC",  name: "SITAB",                        amount: 1707.00,  yield: 7.12, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite", status: "proposed" },
  { date: "2026-09-15", ticker: "SMBC",  name: "SMB CI",                       amount: 704.00,   yield: 4.29, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite", status: "proposed" },
  { date: "2026-09-30", ticker: "SOGC",  name: "SOGB CI",                      amount: 501.60,   yield: 5.97, country: "CI", flag: "🇨🇮", sector: "Agro",          quality: "satellite", status: "proposed" },
  { date: "2026-09-30", ticker: "TTLC",  name: "Total CI",                     amount: 139.7677, yield: 4.90, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite", status: "proposed" },

  // ── Dates à préciser (annoncé, non encore publié par la BRVM) ──
  { date: null,         ticker: "SHEC",  name: "Vivo Energy CI",               amount: 85.07,    yield: 4.04, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite", status: "proposed" },
  { date: null,         ticker: "SVAC",  name: "Servair Abidjan CI",           amount: 201.608,  yield: 6.16, country: "CI", flag: "🇨🇮", sector: "Services",      quality: "satellite", status: "proposed" },
  { date: null,         ticker: "SDCC",  name: "SODECI",                       amount: 462.00,   yield: 3.88, country: "CI", flag: "🇨🇮", sector: "Utilities",     quality: "core",      status: "proposed" },
  { date: null,         ticker: "TMCI",  name: "Tractafric Motors CI",         amount: 183.92,   yield: 4.00, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite", status: "proposed" },
  { date: null,         ticker: "CFAC",  name: "CFAO Motors CI",               amount: 55.44,    yield: 3.12, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite", status: "proposed" },
  { date: null,         ticker: "NTLC",  name: "Nestlé CI",                    amount: 369.60,   yield: 2.50, country: "CI", flag: "🇨🇮", sector: "Agro",          quality: "satellite", status: "proposed" },
  { date: null,         ticker: "SGBC",  name: "SGBCI",                        amount: 2293.28,  yield: 5.88, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "core",      status: "proposed" },
  { date: null,         ticker: "SPHC",  name: "SAPH",                         amount: 430.32,   yield: 5.61, country: "CI", flag: "🇨🇮", sector: "Agro",          quality: "satellite", status: "proposed" },
  { date: null,         ticker: "NEIC",  name: "NEI CEDA CI",                  amount: 140.39,   yield: 5.85, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "yieldTrap", status: "proposed" },
  { date: null,         ticker: "NSBC",  name: "NSIA Banque CI",               amount: 675.98,   yield: 3.42, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite", status: "proposed" },
  { date: null,         ticker: "SLBC",  name: "SOLIBRA",                      amount: 1871.76,  yield: 4.88, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite", status: "proposed" },
];

// Sociétés ayant décidé de ne pas distribuer de dividende en 2026.
export const NON_PAYERS = ["BOA Niger", "SETAO", "SUCRIVOIRE", "BERNABE", "ORAGROUP", "FILTISAC"];

// Statistiques de synthèse (Daba Intelligence — semaine du 22-26 juin 2026).
export const DIVIDEND_SUMMARY = {
  payingCompanies: 34,
  totalCompanies: 47,
  averageYield: 4.85,
  weekLabel: "Semaine du 22 – 26 juin 2026",
};

export const QUALITY_META = {
  core:      { label: "Core",      color: "#2563EB", bg: "#DBEAFE", action: "PRIORITAIRE" },
  satellite: { label: "Satellite", color: "#8B5CF6", bg: "#EDE9FE", action: "OK" },
  avoid:     { label: "À éviter",  color: "#EF4444", bg: "#FEE2E2", action: "ÉVITER" },
  yieldTrap: { label: "Piège",     color: "#F59E0B", bg: "#FEF3C7", action: "PIÈGE" },
};

export const STATUS_META = {
  paid:      { label: "Payé",     color: "#059669", bg: "#D1FAE5" },
  confirmed: { label: "Confirmé", color: "#2563EB", bg: "#DBEAFE" },
  proposed:  { label: "Annoncé",  color: "#6B7280", bg: "#F3F4F6" },
};
