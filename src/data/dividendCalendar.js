export const DIVIDEND_CALENDAR = [
  // Already paid
  { date: "2026-05-05", ticker: "BOAC",  name: "BOA Côte d'Ivoire",            amount: 594.53,  yield: 6.91, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "core" },
  { date: "2026-05-22", ticker: "SNTS",  name: "Sonatel",                      amount: 1740.00, yield: 6.11, country: "SN", flag: "🇸🇳", sector: "Télécoms",      quality: "core" },
  { date: "2026-05-27", ticker: "BOAB",  name: "BOA Bénin",                    amount: 585.00,  yield: 6.57, country: "BJ", flag: "🇧🇯", sector: "Banque",        quality: "core" },
  { date: "2026-05-29", ticker: "BOAS",  name: "BOA Sénégal",                  amount: 450.00,  yield: 5.89, country: "SN", flag: "🇸🇳", sector: "Banque",        quality: "core" },
  { date: "2026-05-29", ticker: "SCBC",  name: "SICABLE CI",                   amount: 152.02,  yield: 4.34, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite" },

  // Confirmed dates
  { date: "2026-06-02", ticker: "BOAM",  name: "BOA Mali",                     amount: 305.04,  yield: 5.77, country: "ML", flag: "🇲🇱", sector: "Banque",        quality: "avoid" },
  { date: "2026-06-05", ticker: "ORAC",  name: "Orange CI",                    amount: 800.00,  yield: 5.00, country: "CI", flag: "🇨🇮", sector: "Télécoms",      quality: "core" },
  { date: "2026-06-12", ticker: "ONTBF", name: "ONATEL BF",                    amount: 145.32,  yield: 4.94, country: "BF", flag: "🇧🇫", sector: "Télécoms",      quality: "avoid" },

  // Dates to be confirmed
  { date: null,         ticker: "CIEC",  name: "CIE CI",                       amount: 205.92,  yield: 4.96, country: "CI", flag: "🇨🇮", sector: "Utilities",     quality: "core" },
  { date: null,         ticker: "SMBC",  name: "SMB CI",                       amount: 704.00,  yield: 5.27, country: "CI", flag: "🇨🇮", sector: "Industrie",     quality: "satellite" },
  { date: null,         ticker: "LNBJ",  name: "Loterie Nationale du Bénin",   amount: 164.00,  yield: 4.31, country: "BJ", flag: "🇧🇯", sector: "Services",      quality: "satellite" },
  { date: null,         ticker: "TMCI",  name: "Tractafric Motors CI",         amount: 183.92,  yield: 4.49, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite" },
  { date: null,         ticker: "NTLC",  name: "Nestlé CI",                    amount: 369.60,  yield: 2.84, country: "CI", flag: "🇨🇮", sector: "Agro",          quality: "satellite" },
  { date: null,         ticker: "TTLS",  name: "Total Sénégal",                amount: 169.81,  yield: 5.07, country: "SN", flag: "🇸🇳", sector: "Distribution",  quality: "satellite" },
  { date: null,         ticker: "SVAC",  name: "Servair Abidjan CI",           amount: 120.97,  yield: 3.56, country: "CI", flag: "🇨🇮", sector: "Services",      quality: "satellite" },
  { date: null,         ticker: "SDCC",  name: "SODECI",                       amount: 462.00,  yield: 4.19, country: "CI", flag: "🇨🇮", sector: "Utilities",     quality: "core" },
  { date: null,         ticker: "NEIC",  name: "NEI CEDA CI",                  amount: 140.39,  yield: 7.09, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "yieldTrap" },
  { date: null,         ticker: "SIBC",  name: "Société Ivoirienne de Banque", amount: 374.00,  yield: 4.40, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "satellite" },
  { date: null,         ticker: "SGBC",  name: "SGBCI",                        amount: 2293.28, yield: 6.20, country: "CI", flag: "🇨🇮", sector: "Banque",        quality: "core" },
  { date: null,         ticker: "ETIT",  name: "Ecobank ETI",                  amount: 0.93,    yield: 3.10, country: "TG", flag: "🇹🇬", sector: "Banque pan-AF", quality: "satellite" },
  { date: null,         ticker: "CBIBF", name: "Coris Bank International BF",  amount: 900.00,  yield: 4.15, country: "BF", flag: "🇧🇫", sector: "Banque",        quality: "avoid" },
  { date: null,         ticker: "TTLC",  name: "Total CI",                     amount: 139.77,  yield: 4.84, country: "CI", flag: "🇨🇮", sector: "Distribution",  quality: "satellite" },
];

export const QUALITY_META = {
  core:      { label: "Core",      color: "#2563EB", bg: "#DBEAFE", action: "PRIORITAIRE" },
  satellite: { label: "Satellite", color: "#8B5CF6", bg: "#EDE9FE", action: "OK" },
  avoid:     { label: "À éviter",  color: "#EF4444", bg: "#FEE2E2", action: "ÉVITER" },
  yieldTrap: { label: "Piège",     color: "#F59E0B", bg: "#FEF3C7", action: "PIÈGE" },
};
