# Omaad Capital — Omaad Intelligence Platform

Plateforme d'investissement interactive pour la BRVM (Bourse Régionale des Valeurs Mobilières).  
Simulateurs DCA, dividendes, allocation de portefeuille et stratégie sur 20 ans.

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Déploiement

### Vercel (recommandé)

1. Pusher le repo sur GitHub
2. Aller sur [vercel.com](https://vercel.com) → **New Project**
3. Importer le repo → Vercel détecte Vite automatiquement
4. Cliquer **Deploy**

Ou via CLI :

```bash
npx vercel
```

### Netlify

1. Pusher le repo sur GitHub
2. Aller sur [netlify.com](https://netlify.com) → **New site from Git**
3. Build command : `npm run build`
4. Publish directory : `dist`

### Autres (Render, Railway, GitHub Pages...)

Le build produit un dossier `dist/` avec des fichiers statiques. Tout hébergeur de sites statiques fonctionne.

## Structure du projet

```
src/
├── main.jsx                    # Point d'entrée React
├── App.jsx                     # Composant racine + routing par onglets
├── theme.js                    # Design tokens (couleurs, fonts)
├── data/
│   └── stocks.js               # Données actions BRVM
├── utils/
│   ├── format.js               # Formateurs (FCFA, EUR, %)
│   └── projections.js          # Moteur de calcul (DCA, DRIP, etc.)
└── components/
    ├── ui/                     # Composants réutilisables
    │   ├── Nav.jsx
    │   ├── Card.jsx
    │   ├── MetricCard.jsx
    │   ├── Slider.jsx
    │   ├── PageHeader.jsx
    │   ├── ChartTooltip.jsx
    │   └── Pill.jsx
    └── tabs/                   # Onglets de l'application
        ├── OverviewTab.jsx
        ├── DCATab.jsx
        ├── TargetTab.jsx
        ├── DividendTab.jsx
        ├── PortfolioTab.jsx
        ├── StrategyTab.jsx
        └── RisksTab.jsx
```

## Technologies

- **React 19** — UI
- **Vite 6** — Build & dev server
- **Recharts** — Graphiques interactifs
- **Lucide React** — Icônes
