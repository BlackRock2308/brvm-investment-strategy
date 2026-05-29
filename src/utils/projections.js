export function projectDCA({ monthly, years, annualRate }) {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const data = [];
  let value = 0,
    invested = 0;
  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) {
      value = value * (1 + monthlyRate) + monthly;
      invested += monthly;
    }
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        invested,
        value: Math.round(value),
        gain: Math.round(value - invested),
      });
    }
  }
  return data;
}

export function projectEscalated({ phases, annualRate }) {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const data = [{ year: 0, invested: 0, value: 0, gain: 0, phase: "Départ" }];
  let value = 0,
    invested = 0,
    year = 0;
  for (const ph of phases) {
    for (let y = 0; y < ph.duration; y++) {
      for (let m = 0; m < 12; m++) {
        value = value * (1 + monthlyRate) + ph.monthly;
        invested += ph.monthly;
      }
      year++;
      data.push({
        year,
        invested: Math.round(invested),
        value: Math.round(value),
        gain: Math.round(value - invested),
        phase: ph.label,
      });
    }
  }
  return data;
}

export function requiredMonthly({ target, years, annualRate }) {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const n = years * 12;
  if (monthlyRate === 0) return target / n;
  return (target * monthlyRate) / (Math.pow(1 + monthlyRate, n) - 1);
}

export function computeDividendTargets({ targets, stocks, phaseWeights, currentHoldings, taxRate, dcaMonthly }) {
  const taxMul = 1 - taxRate / 100;

  const tickers = Object.keys(phaseWeights);
  const stockMap = Object.fromEntries(stocks.map(s => [s.ticker, s]));
  const holdMap  = Object.fromEntries(currentHoldings.map(h => [h.ticker, h]));

  const weightedYieldGross = tickers.reduce((sum, t) => {
    const w = phaseWeights[t] / 100;
    const y = (stockMap[t]?.yield || 0) / 100;
    return sum + w * y;
  }, 0);
  const weightedYieldNet = weightedYieldGross * taxMul;

  const currentValue = tickers.reduce((sum, t) => {
    const h = holdMap[t];
    const s = stockMap[t];
    if (!h || !s) return sum;
    return sum + h.qty * s.price;
  }, 0);
  const currentDivGross = tickers.reduce((sum, t) => {
    const h = holdMap[t];
    const s = stockMap[t];
    if (!h || !s) return sum;
    return sum + h.qty * s.price * (s.yield / 100);
  }, 0);

  return targets.map(target => {
    const requiredCapital = weightedYieldNet > 0 ? Math.round(target / weightedYieldNet) : 0;
    const additionalCapital = Math.max(0, requiredCapital - currentValue);
    const yearsNeeded = dcaMonthly > 0 ? additionalCapital / (dcaMonthly * 12) : Infinity;
    const fullYears = Math.floor(yearsNeeded);
    const remainingMonths = Math.round((yearsNeeded - fullYears) * 12);

    const breakdown = tickers.map(t => {
      const s = stockMap[t];
      const h = holdMap[t] || { qty: 0 };
      const w = phaseWeights[t] / 100;
      const capitalForTicker = requiredCapital * w;
      const sharesNeeded = s ? Math.ceil(capitalForTicker / s.price) : 0;
      const toBuy = Math.max(0, sharesNeeded - h.qty);
      const divPerShare = s ? s.price * (s.yield / 100) : 0;
      const annualDivNet = Math.round(sharesNeeded * divPerShare * taxMul);
      return {
        ticker: t,
        name: s?.name || t,
        weight: phaseWeights[t],
        capitalTarget: Math.round(capitalForTicker),
        sharesNeeded,
        sharesHeld: h.qty,
        toBuy,
        annualDivNet,
      };
    });

    return {
      target,
      monthlyEquiv: Math.round(target / 12),
      requiredCapital,
      currentValue,
      additionalCapital,
      fullYears,
      remainingMonths,
      progressPct: requiredCapital > 0 ? Math.min(100, Math.round((currentValue / requiredCapital) * 100)) : 0,
      breakdown,
      weightedYieldGross: +(weightedYieldGross * 100).toFixed(2),
      weightedYieldNet: +(weightedYieldNet * 100).toFixed(2),
      currentDivGross: Math.round(currentDivGross),
      currentDivNet: Math.round(currentDivGross * taxMul),
    };
  });
}

export function projectDRIP({
  initial,
  monthly,
  years,
  yieldPct,
  growthDiv,
  dripYears,
  taxRate,
}) {
  const data = [];
  let value = initial,
    invested = initial;
  let curYield = yieldPct / 100;
  const divGrowth = growthDiv / 100;
  const monthlyPriceGrowth = Math.pow(1.05, 1 / 12) - 1;
  for (let y = 0; y <= years; y++) {
    const divAnnual = value * curYield;
    const divNet = divAnnual * (1 - taxRate / 100);
    data.push({
      year: y,
      value: Math.round(value),
      invested: Math.round(invested),
      dividendsAnnual: Math.round(divAnnual),
      dividendsNet: Math.round(divNet),
      dividendsMonthly: Math.round(divNet / 12),
    });
    if (y < years) {
      for (let m = 0; m < 12; m++) {
        value = value * (1 + monthlyPriceGrowth) + monthly;
        invested += monthly;
      }
      if (y < dripYears) value += divAnnual;
      curYield = curYield * (1 + divGrowth);
    }
  }
  return data;
}
