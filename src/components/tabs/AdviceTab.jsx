import React from "react";
import { Shield, Brain, Landmark, TrendingUp, Clock, AlertTriangle, Lightbulb } from "lucide-react";
import { T, FONT_SANS, FONT_MONO } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";

const PRINCIPLES = [
  {
    n: "01",
    title: "Le marché récompense la patience, pas l'intelligence",
    desc: "90% de la performance vient du temps passé dans le marché, pas du timing. Un investisseur qui rate les 10 meilleurs jours sur 20 ans perd la moitié de ses gains. Reste investi.",
    color: T.blue,
  },
  {
    n: "02",
    title: "Le DCA est ton meilleur ami",
    desc: "Investir un montant fixe chaque mois élimine le biais émotionnel. Tu achètes plus quand c'est bas, moins quand c'est haut. Sur 20 ans, cette discipline bat 95% des tentatives de market timing.",
    color: T.green,
  },
  {
    n: "03",
    title: "N'investis jamais ce que tu ne peux pas perdre",
    desc: "Ton fonds d'urgence (3-6 mois de dépenses) est sacré. Ne touche jamais à cet argent pour investir. Le marché peut baisser de 30-50% sur quelques mois. Tu dois pouvoir tenir sans vendre.",
    color: T.red,
  },
  {
    n: "04",
    title: "L'intérêt composé est la 8e merveille du monde",
    desc: "Einstein : « Celui qui le comprend en profite, celui qui ne le comprend pas le paie. » Un rendement de 6% réinvesti double ton capital en 12 ans. En 24 ans, il le quadruple. C'est pour ça que le DRIP est non-négociable.",
    color: T.chart3,
  },
  {
    n: "05",
    title: "Le prix que tu paies détermine ton rendement",
    desc: "Un bon titre acheté trop cher est un mauvais investissement. Le P/E, le yield on cost, et la décote par rapport à la valeur intrinsèque sont tes guides. Ne cours jamais après un rallye.",
    color: T.amber,
  },
  {
    n: "06",
    title: "Concentre-toi sur ce que tu comprends",
    desc: "Buffett : « N'investis jamais dans une entreprise que tu ne comprends pas. » 5 lignes bien comprises battent 20 lignes achetées au hasard. La conviction vient de la connaissance.",
    color: T.blue,
  },
  {
    n: "07",
    title: "La peur et la cupidité sont tes ennemis",
    desc: "Quand tout le monde panique, c'est le moment d'acheter. Quand tout le monde est euphorique, c'est le moment d'être prudent. Ton journal de bord et ton IPS te protègent de toi-même.",
    color: T.red,
  },
  {
    n: "08",
    title: "Les frais composent aussi — en négatif",
    desc: "1% de frais annuels sur 20 ans détruit 18% de ton capital final. Choisis des intermédiaires à faible coût. Limite les allers-retours. Chaque transaction a un coût visible et invisible.",
    color: T.amber,
  },
];

const BRVM_RULES = [
  {
    title: "Liquidité limitée — adapte ta stratégie",
    desc: "La BRVM a ~47 titres et 970M FCFA de volume journalier. 5 blue chips concentrent la liquidité. Ne t'aventure pas sur les titres à faible volume : tu ne pourras pas sortir quand tu voudras. Limite-toi aux titres avec un volume > 10M FCFA/jour.",
    icon: Landmark,
  },
  {
    title: "Règlement T+2 — provisionne avant d'acheter",
    desc: "Depuis décembre 2025, le règlement est passé à T+2. Ton compte doit être provisionné AVANT de passer l'ordre. Pas de découvert, pas de marge. Planifie tes virements 2-3 jours avant la date d'exécution souhaitée.",
    icon: Clock,
  },
  {
    title: "La saisonnalité des dividendes est ta boussole",
    desc: "80% des détachements BRVM ont lieu entre avril et juillet. Achète 6-8 semaines AVANT le détachement pour capturer le dividende complet. Évite d'acheter dans les 14 jours précédant le détachement (prix déjà gonflé, risque de post-détachement).",
    icon: TrendingUp,
  },
  {
    title: "Zone AES = risque souverain maximal",
    desc: "Burkina Faso, Mali, Niger — instabilité politique, sanctions, risque de sortie UEMOA. Plafond strict de 5% du portefeuille pour la zone AES combinée. Préfère les blue chips CI et SN qui n'ont pas ce risque.",
    icon: AlertTriangle,
  },
  {
    title: "Le FCP n'est pas ton ennemi, c'est ton benchmark",
    desc: "Le FCP BAM WURUS est un bon produit pour les débutants. Mais à long terme, ton stock picking direct doit le battre. Si après 3 ans ton direct sous-performe le FCP net de frais, remets en question ta stratégie, pas le véhicule.",
    icon: Brain,
  },
  {
    title: "Les ordres à cours limité sont obligatoires",
    desc: "Sur un marché à faible liquidité comme la BRVM, un ordre au marché peut te coûter 2-5% de slippage. Utilise TOUJOURS des ordres à cours limité. Fixe ton prix maximum et sois patient. Le titre viendra à toi.",
    icon: Lightbulb,
  },
];

const IPS_RULES = [
  { n: "1", rule: "DCA automatisé", desc: "Virement permanent le 1er du mois. Pas de décision, pas d'émotion. L'automatisation est la discipline." },
  { n: "2", rule: "Réévaluation annuelle uniquement", desc: "Revoir les pondérations cibles une fois par an maximum (janvier). En dehors de ce rendez-vous, aucune modification stratégique." },
  { n: "3", rule: "Concentration décroissante avec l'âge", desc: "29-35 ans : 5 lignes max. 36-44 : 7 lignes. 45+ : 8-10 lignes. La diversification augmente avec le capital et l'âge." },
  { n: "4", rule: "DRIP actif jusqu'à 41-44 ans", desc: "Réinvestir 100% des dividendes jusqu'à la phase 3. Aucune distribution avant d'avoir atteint la masse critique de 15-30M FCFA." },
  { n: "5", rule: "Anti-fragilité comportementale", desc: "Si le marché chute de -20%, ne pas vendre. Si un titre core chute de -30%, considérer un renforcement. La baisse est une opportunité, pas une menace." },
  { n: "6", rule: "Revue triennale du glide path", desc: "Tous les 3 ans, vérifier si le glide path (actions → obligations → cash) est toujours adapté à ta situation personnelle et professionnelle." },
  { n: "7", rule: "Journal d'ordres systématique", desc: "Chaque ordre passé doit être documenté : date, ticker, quantité, prix, raisonnement. Le journal est ton miroir — il révèle tes biais et tes progrès." },
];

const GLIDE_PATH = [
  { phase: "29-35 ans", actions: 90, obligations: 5, cash: 5, label: "Accumulation agressive" },
  { phase: "36-44 ans", actions: 75, obligations: 15, cash: 10, label: "Croissance équilibrée" },
  { phase: "45-52 ans", actions: 55, obligations: 30, cash: 15, label: "Transition revenus" },
  { phase: "53+ ans",   actions: 35, obligations: 45, cash: 20, label: "Distribution & préservation" },
];

export default function AdviceTab() {
  const { isMobile, cols } = useResponsive();

  return (
    <div>
      <PageHeader
        eyebrow="Principes · rappels permanents"
        title="Les règles que tu ne dois jamais oublier."
        description="Ces principes ont été écrits quand tu étais lucide et rationnel. Relis-les quand le marché te rend émotionnel."
      />

      {/* 8 Universal Principles */}
      <Card title="8 principes fondamentaux" subtitle="Valables sur tous les marchés, dans toutes les conditions" icon={Brain} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "1fr", "repeat(2, 1fr)"),
          gap: 14,
        }}>
          {PRINCIPLES.map(p => (
            <div key={p.n} style={{
              padding: isMobile ? 16 : 20,
              background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
              borderLeft: `4px solid ${p.color}`, borderRadius: 12,
            }}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, color: p.color,
                fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6,
              }}>PRINCIPE {p.n}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: isMobile ? 14 : 15,
                fontWeight: 700, color: T.ink, lineHeight: 1.3,
                marginBottom: 8, letterSpacing: "-0.01em",
              }}>{p.title}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted,
                lineHeight: 1.6,
              }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* BRVM-specific rules */}
      <Card title="Règles spécifiques BRVM" subtitle="Ce qui est unique à ce marché" icon={Landmark} style={{ marginBottom: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: cols("1fr", "1fr", "repeat(2, 1fr)"),
          gap: 14,
        }}>
          {BRVM_RULES.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} style={{
                padding: isMobile ? 16 : 20,
                background: T.bgSubtle, border: `1px solid ${T.borderSoft}`,
                borderRadius: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: T.blueSoft, display: "grid", placeItems: "center",
                  marginBottom: 12,
                }}>
                  <Icon size={18} color={T.blue} strokeWidth={2.2} />
                </div>
                <div style={{
                  fontFamily: FONT_SANS, fontSize: isMobile ? 14 : 15,
                  fontWeight: 700, color: T.ink, lineHeight: 1.3,
                  marginBottom: 8, letterSpacing: "-0.01em",
                }}>{r.title}</div>
                <div style={{
                  fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted,
                  lineHeight: 1.6,
                }}>{r.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* IPS - Personal Investment Policy */}
      <Card title="IPS — Tes 7 règles gravées dans le marbre" subtitle="Investment Policy Statement · ne jamais déroger" icon={Shield} style={{ marginBottom: 16 }}>
        {IPS_RULES.map((r, i) => (
          <div key={r.n} style={{
            display: "flex", gap: 14, alignItems: "flex-start",
            padding: "16px 0",
            borderBottom: i < IPS_RULES.length - 1 ? `1px solid ${T.borderSoft}` : "none",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: T.blueSoft, display: "grid", placeItems: "center",
              fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700,
              color: T.blue, flexShrink: 0,
            }}>{r.n}</div>
            <div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 14, fontWeight: 700,
                color: T.ink, marginBottom: 4, letterSpacing: "-0.01em",
              }}>{r.rule}</div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: T.inkMuted,
                lineHeight: 1.6,
              }}>{r.desc}</div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 20, padding: isMobile ? 16 : 20,
          background: T.bgDark, borderRadius: 12,
          color: T.inkInv,
        }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, color: T.amber,
            fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
            marginBottom: 8,
          }}>Principe fondateur</div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: isMobile ? 15 : 17,
            fontWeight: 600, lineHeight: 1.5, fontStyle: "italic",
            color: "#E5E7EB",
          }}>
            « Construire un patrimoine qui travaille pour toi, pas l'inverse. Le marché est un outil, pas un casino. La discipline est le seul avantage compétitif durable d'un investisseur individuel. »
          </div>
        </div>
      </Card>

      {/* Glide Path */}
      <Card title="Glide Path — Allocation par phase de vie" subtitle="Ajuster le risque avec l'âge" icon={TrendingUp}>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%", borderCollapse: "collapse",
            fontFamily: FONT_SANS, fontSize: 13,
          }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {["Phase", "Actions", "Obligations UMOA", "Cash tactique", "Objectif"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left",
                    fontWeight: 600, color: T.inkMuted, fontSize: 11,
                    textTransform: "uppercase", letterSpacing: "0.03em",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GLIDE_PATH.map((g, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                  <td style={{
                    padding: "12px 14px", fontWeight: 600, color: T.ink,
                    whiteSpace: "nowrap",
                  }}>{g.phase}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        height: 8, borderRadius: 999,
                        width: `${g.actions}%`, maxWidth: 120,
                        background: T.blue,
                      }} />
                      <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.blue }}>{g.actions}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        height: 8, borderRadius: 999,
                        width: `${g.obligations}%`, maxWidth: 120,
                        background: T.chart3,
                      }} />
                      <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.chart3 }}>{g.obligations}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        height: 8, borderRadius: 999,
                        width: `${g.cash}%`, maxWidth: 120,
                        background: T.amber,
                      }} />
                      <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.amber }}>{g.cash}%</span>
                    </div>
                  </td>
                  <td style={{
                    padding: "12px 14px", fontFamily: FONT_SANS,
                    fontSize: 12, color: T.inkMuted, fontWeight: 500,
                  }}>{g.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
