export const DIVIDEND_CALENDAR = [
  { date: "2026-05-05", ticker: "BOAC",  name: "BOA Côte d'Ivoire",         amount: 594.53,  yield: 6.91, country: "CI", flag: "🇨🇮", sector: "Banque",       quality: "core" },
  { date: "2026-05-22", ticker: "SNTS",  name: "Sonatel",                   amount: 1740.00, yield: 6.11, country: "SN", flag: "🇸🇳", sector: "Télécoms",     quality: "core" },
  { date: "2026-05-28", ticker: "BOAS",  name: "BOA Sénégal",               amount: 450.00,  yield: 6.52, country: "SN", flag: "🇸🇳", sector: "Banque",       quality: "core" },
  { date: "2026-06-01", ticker: "BOAM",  name: "BOA Mali",                  amount: 305.04,  yield: 6.53, country: "ML", flag: "🇲🇱", sector: "Banque",       quality: "avoid" },
  { date: "2026-06-12", ticker: "ONTBF", name: "ONATEL BF",                 amount: 145.32,  yield: 5.36, country: "BF", flag: "🇧🇫", sector: "Télécoms",     quality: "avoid" },
  { date: null,         ticker: "NEIC",  name: "NEI CEDA CI",               amount: 140.39,  yield: 8.89, country: "CI", flag: "🇨🇮", sector: "Distribution", quality: "yieldTrap" },
  { date: null,         ticker: "SIBC",  name: "Société Ivoirienne de Banque", amount: 374.00, yield: 5.34, country: "CI", flag: "🇨🇮", sector: "Banque",     quality: "satellite" },
  { date: null,         ticker: "SGBC",  name: "SGBCI",                     amount: 2293.28, yield: 6.56, country: "CI", flag: "🇨🇮", sector: "Banque",       quality: "core" },
  { date: null,         ticker: "BOAB",  name: "BOA Bénin",                 amount: 585.00,  yield: 7.13, country: "BJ", flag: "🇧🇯", sector: "Banque",       quality: "core" },
  { date: null,         ticker: "ETIT",  name: "Ecobank ETI",               amount: 0.93,    yield: 3.21, country: "TG", flag: "🇹🇬", sector: "Banque pan-AF", quality: "satellite" },
  { date: null,         ticker: "ECOC",  name: "Ecobank CI",                amount: 781.00,  yield: 4.79, country: "CI", flag: "🇨🇮", sector: "Banque",       quality: "satellite" },
  { date: null,         ticker: "CBIBF", name: "Coris Bank International BF", amount: 900.00, yield: 5.46, country: "BF", flag: "🇧🇫", sector: "Banque",     quality: "avoid" },
  { date: null,         ticker: "TTLC",  name: "Total CI",                  amount: 139.77,  yield: 5.18, country: "CI", flag: "🇨🇮", sector: "Distribution", quality: "satellite" },
  { date: null,         ticker: "PALC",  name: "PALMCI",                    amount: 441.76,  yield: 5.74, country: "CI", flag: "🇨🇮", sector: "Agro",         quality: "satellite" },
  { date: null,         ticker: "SPHC",  name: "SAPH",                      amount: 430.32,  yield: 5.83, country: "CI", flag: "🇨🇮", sector: "Agro",         quality: "satellite" },
  { date: null,         ticker: "ORAC",  name: "Orange CI",                 amount: 704.00,  yield: 4.72, country: "CI", flag: "🇨🇮", sector: "Télécoms",     quality: "core" },
  { date: null,         ticker: "SCBC",  name: "SICABLE CI",                amount: 152.02,  yield: 4.22, country: "CI", flag: "🇨🇮", sector: "Industrie",    quality: "satellite" },
];

export const QUALITY_META = {
  core:      { label: "Core",      color: "#2563EB", bg: "#DBEAFE", action: "PRIORITAIRE" },
  satellite: { label: "Satellite", color: "#8B5CF6", bg: "#EDE9FE", action: "OK" },
  avoid:     { label: "À éviter",  color: "#EF4444", bg: "#FEE2E2", action: "ÉVITER" },
  yieldTrap: { label: "Piège",     color: "#F59E0B", bg: "#FEF3C7", action: "PIÈGE" },
};
