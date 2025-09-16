import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

// Convert fee units to DOT (you may need to adjust this conversion rate)
const feeUnitsToDOT = (feeUnits, conversionRate = 0.001) => {
  return feeUnits * conversionRate;
};

const blocksPerDay = 14400;

// A single object to hold all your tiered messages and headings
const wittyContent = {
  // Messages for durations in the hundreds of years
  hundreds: {
    headings: [
      "Taking the scenic route, are we?",
      "That's a bit of a commitment.",
      "Looks like a long-term plan.",
      "Even our servers are impressed.",
      "Plotting a course for the next century!",
    ],
    messages: [
      "This subscription would have started before the discovery of antibiotics.",
      "Your contract would be older than most historical relics.",
      "This calculation spans more time than the average dynasty.",
      "Let's hope you still remember your password in a few hundred years.",
    ],
  },
  // Messages for durations in the thousands of years
  thousands: {
    headings: [
      "Woah there, speed racer!",
      "Ahem, about that number...",
      "Plotting a course for the next millennium!",
      "You've found the end of the internet!",
    ],
    messages: [
      "You’d have enough time to see the rise and fall of several great civilizations.",
      "At this rate, your renewal date is a historical event.",
      "Let's hope you still remember your password in a thousand years.",
    ],
  },
  // Messages for durations in the millions of years
  millions: {
    headings: [
      "Looks like you've broken the space-time continuum!",
      "Are you a time traveler?",
      "Engaging time dilation protocols.",
      "Input validated... for its sheer audacity.",
    ],
    messages: [
      "A subscription this long would require a time machine. We're working on it.",
      "This calculation just made our historians nervous.",
      "We're pretty sure you'll have to pay for this in a different galaxy's currency.",
    ],
  },
  // Messages for durations in the billions of years
  billions: {
    headings: [
      "You've transcended the limits of our simulator.",
      "This is a longer commitment than most star systems. Impressive!",
      "Hold your horses!",
    ],
    messages: [
      "Please stand by for the heat death of the universe.",
      "We're pretty sure the sun will have turned into a red giant by then.",
      "At this rate, you'd witness the beginning and end of several technological epochs.",
      "The commitment level here is truly cosmic.",
      "Your subscription would have outlived the dinosaurs.",
    ],
  },
};

function PriceSimulator() {
  const creditDispatchRate = 1;
  const [feeConversionRate, setFeeConversionRate] = useState(0.0000000001);
  const [frequency, setFrequency] = useState(0);
  const [numPulses, setNumPulses] = useState(0);
  const [tiers, setTiers] = useState([
    { start: 1, discount: 0 },
    { start: 10001, discount: 5 },
    { start: 100001, discount: 10 },
    { start: 1000001, discount: 20 },
    { start: 10000001, discount: 30 }
  ]);
  const [dotToUSD, setDotToUsd] = useState(4); // Initial value
  const [error, setError] = useState(null);

  const baseFee = 2900000;

  const calculateSubscriptionFees = (credits) => {
    const TIERS = tiers.map(tier => [tier.start, tier.discount]);
    let totalFee = 0;
    let remainingCredits = credits;

    for (let i = 0; i < TIERS.length; i++) {
      if (remainingCredits === 0) break;
      const [currentTierStart, currentTierDiscount] = TIERS[i];
      const nextTierStart = i + 1 < TIERS.length ? TIERS[i + 1][0] : Number.MAX_SAFE_INTEGER;
      const maxCreditsInTier = Math.min(credits, nextTierStart - 1) - currentTierStart + 1;
      const creditsInTier = Math.min(maxCreditsInTier, remainingCredits);

      if (creditsInTier > 0) {
        const tierFee = Math.floor(baseFee * creditsInTier * (100 - currentTierDiscount) / 100);
        totalFee += tierFee;
        remainingCredits -= creditsInTier;
      }
    }
    return totalFee;
  };

  const getTierBreakdown = (credits) => {
    const sortedTiers = [...tiers].sort((a, b) => a.start - b.start);
    let breakdown = [];
    let remaining = credits;

    for (let i = 0; i < sortedTiers.length; i++) {
      const tier = sortedTiers[i];
      const nextTier = sortedTiers[i + 1];

      if (remaining <= 0 || credits < tier.start) break;
      const end = nextTier ? nextTier.start - 1 : Infinity;
      const creditsInTier = Math.min(remaining, Math.min(credits, end) - tier.start + 1);
      const costPerCredit = baseFee * (100 - tier.discount) / 100;
      const tierCost = creditsInTier * costPerCredit;

      if (creditsInTier > 0) {
        breakdown.push({
          range: end === Infinity ? `${tier.start.toLocaleString()}+` : `${tier.start.toLocaleString()}-${end.toLocaleString()}`,
          credits: creditsInTier,
          discount: tier.discount,
          costPerCredit: costPerCredit,
          tierCost: tierCost
        });
        remaining -= creditsInTier;
      }
    }
    return breakdown;
  };

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const results = (data, isCalculator = false) => {
    const creditsRequired = data[0] * (data[1] * creditDispatchRate + creditDispatchRate);
    const durationInHours = (6 * data[0] * (Number(data[1]) + 1)) / 3600;
    const durationInYears = durationInHours / 8760;

    // Easter Egg Condition
    if (isCalculator && durationInYears > 100) {
      let tier;
      if (durationInYears > 1000000000) {
        tier = wittyContent.billions;
      } else if (durationInYears > 100000) {
        tier = wittyContent.millions;
      } else if (durationInYears > 1000) {
        tier = wittyContent.thousands;
      } else {
        tier = wittyContent.hundreds;
      }

      return (
        <div className={clsx('card', 'shadow--md', styles.resultCard)}>
          <div className="card__header">
            <h4 className="title">{getRandomElement(tier.headings)}</h4>
          </div>
          <div className="card__body text--center">
            <h5 className="margin-bottom--md">{getRandomElement(tier.messages)}</h5>
            <p>This calculation spans over {Math.round(durationInYears).toLocaleString()} years.</p>
            <p className="margin-top--lg">Maybe try a more realistic number?</p>
          </div>
        </div>
      );
    }

    // Normal calculation
    const feeUnits = calculateSubscriptionFees(creditsRequired);
    const dotRequired = feeUnitsToDOT(feeUnits, feeConversionRate);
    const usd = dotRequired * dotToUSD;

    const cardClass = isCalculator ? styles.calculatorResult : clsx('card', 'shadow--md', 'margin-top--md', styles.resultCard);

    return (
      <div className={cardClass}>
        <div className="card__header">
          <h4 className="title">Rate for {data[2]}</h4>
        </div>
        <div className="card__body">
          <p>Duration: <strong>{durationInHours.toLocaleString()} hours</strong></p>
          <p>Credits: <strong>{creditsRequired.toLocaleString()}</strong></p>
          <p>Fee units: <strong>{feeUnits.toLocaleString()}</strong></p>
          <p>DOT: <strong>{dotRequired.toFixed(8)}</strong></p>
          <p>USD: <strong>${usd.toFixed(4)}</strong></p>
          <details className={clsx("margin-top--md", styles.tierBreakdown)}>
            <summary>Tier Breakdown</summary>
            <div className="margin-top--sm">
              {getTierBreakdown(creditsRequired).map((tier, idx) => (
                <div key={idx} className={clsx("margin-bottom--xs", styles.tierBreakdownItem)}>
                  <p><strong>{tier.range}</strong> credits: {tier.credits.toLocaleString()}</p>
                  <p className="text--xs">
                    {tier.discount}% discount • {tier.costPerCredit} per credit • {tier.tierCost.toLocaleString()} fee units
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="container padding-top--md padding-bottom--md">
        <h2 className="text--center margin-bottom--lg">VRaaS Pricing Simulator</h2>
        <div className="text--center">Error fetching Polkadot price: {error}</div>
      </div>
    );
  }

  return (
    <div className="container padding-top--md padding-bottom--md">
      <h2 className="text--center margin-bottom--lg">VRaaS Pricing Simulator</h2>

      {/* Tier Configuration */}
      <div className="card shadow--md margin-bottom--lg">
        <div className="card__header">
          <h3 className="text--center">Tier Configuration</h3>
        </div>
        <div className="card__body">
          <ul className={clsx('clean-list', styles.tierList)}>
            {tiers.map((tier, index) => (
              <li key={index}>
                <div className={styles.tierItem}>
                  <span>
                    <strong>{tier.start.toLocaleString()}+</strong> credits
                  </span>
                  <div className={styles.tierDetails}>
                    <span><strong>{tier.discount}%</strong> discount</span>
                    <span>
                      <span className="text--sm text--muted">per credit:</span>{' '}
                      {(baseFee * (100 - tier.discount) / 100).toLocaleString()} fee units
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.calculator}>
        <h2>Useful Conversions</h2>
        <p>
          1 block ≈ 6 seconds, 600 blocks ≈ 1 hour<br />
          14400 blocks ≈ 1 day<br />
          432000 blocks ≈ 1 month<br />
          5184000 blocks ≈ 1 year<br />
          "Unit" ≈ {feeConversionRate} DOT
        </p>
      </div>
      {/* Custom Calculator */}
      <div className={styles.calculator}>
        <div className={styles.calculatorInputs}>
          <h4>Calculate Custom Rate</h4>
          <div className={styles.inputGroup}>

            <label className={styles.formLabel} htmlFor='dotPrice'>
              DOT to USD
            </label>
            <input
              id="dotPrice"
              type="number"
              step="0.0000000001"
              value={dotToUSD}
              className={styles.formInput}
              onChange={(e) => setDotToUsd(e.target.value)}
              placeholder='Enter DOT to USD price'
            />

            <label className={styles.formLabel} htmlFor='num-pulses'>
              Number of Pulses
            </label>
            <input
              id="num-pulses"
              type="number"
              className={styles.formInput}
              value={numPulses}
              onChange={(e) => setNumPulses(e.target.value)}
              placeholder="Enter number of pulses"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.formLabel} htmlFor='frequency'>
              Frequency (blocks)
            </label>
            <input
              id="frequency"
              type="number"
              className={styles.formInput}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Enter frequency in blocks"
            />
          </div>
        </div>

        <div>
          {results([numPulses, frequency, 'custom calculation'], true)}
        </div>
      </div>

      {/* Preset Examples */}
      <div className="margin-top--xl">
        <h3 className="text--center margin-bottom--lg">Preset Examples</h3>
        <div className={styles.resultsGrid}>
          {[
            [1, 0, '1 block'],
            [10, 0, '10 blocks'],
            [10, 1, '10 pulses, 1 frequency'],
            [50 * 6, 0, '300 blocks'],
            [100 * 6, 0, '600 blocks'],
            [blocksPerDay, 0, 'day'],
            [blocksPerDay * 2, 0, '2 days'],
            [blocksPerDay * 10, 0, '10 days'],
            [blocksPerDay * 28, 0, '28 days'],
            [blocksPerDay * 100, 0, '100 days'],
            [blocksPerDay * 365, 0, 'year']
          ].map((data, idx) => (
            <div key={idx}>
              {results(data)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PriceSimulator;