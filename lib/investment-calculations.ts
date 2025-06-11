// Compound Interest Calculation
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  monthlyContribution = 0,
  compoundFrequency = 12,
) {
  const monthlyRate = rate / 100 / 12
  const totalMonths = time * 12

  // Calculate compound interest with monthly contributions
  let futureValue = principal
  let totalContributions = principal
  const yearlyData = []

  for (let month = 1; month <= totalMonths; month++) {
    futureValue = futureValue * (1 + monthlyRate) + monthlyContribution
    if (monthlyContribution > 0) {
      totalContributions += monthlyContribution
    }

    // Store yearly data points
    if (month % 12 === 0) {
      const year = month / 12
      const interestEarned = futureValue - totalContributions
      yearlyData.push({
        year,
        principal: totalContributions,
        balance: futureValue,
        interest: interestEarned,
      })
    }
  }

  const totalInterest = futureValue - totalContributions

  return {
    futureValue,
    totalInterest,
    totalContributions,
    yearlyData,
  }
}

// Rule of 72 Calculation
export function calculateRuleOf72(rate: number, currentAmount: number) {
  const yearsToDouble = 72 / rate
  const doubledAmount = currentAmount * 2

  return {
    yearsToDouble,
    doubledAmount,
    currentAmount,
  }
}

// Starting Early Comparison
export function calculateStartingEarly(
  monthlyContribution: number,
  interestRate: number,
  earlyStartAge: number,
  earlyStopAge: number,
  lateStartAge: number,
  retirementAge = 65,
) {
  const monthlyRate = interestRate / 100 / 12

  // Early investor calculation
  const earlyInvestmentYears = earlyStopAge - earlyStartAge
  const earlyInvestmentMonths = earlyInvestmentYears * 12
  const earlyGrowthYears = retirementAge - earlyStopAge
  const earlyGrowthMonths = earlyGrowthYears * 12

  // Calculate early investor's balance at stop age
  let earlyBalance = 0
  for (let month = 1; month <= earlyInvestmentMonths; month++) {
    earlyBalance = earlyBalance * (1 + monthlyRate) + monthlyContribution
  }

  // Grow without contributions until retirement
  const earlyFinalBalance = earlyBalance * Math.pow(1 + monthlyRate, earlyGrowthMonths)
  const earlyTotalContributions = monthlyContribution * earlyInvestmentMonths

  // Late investor calculation
  const lateInvestmentYears = retirementAge - lateStartAge
  const lateInvestmentMonths = lateInvestmentYears * 12

  let lateBalance = 0
  for (let month = 1; month <= lateInvestmentMonths; month++) {
    lateBalance = lateBalance * (1 + monthlyRate) + monthlyContribution
  }

  const lateTotalContributions = monthlyContribution * lateInvestmentMonths

  return {
    earlyInvestor: {
      finalBalance: earlyFinalBalance,
      totalContributions: earlyTotalContributions,
      totalReturns: earlyFinalBalance - earlyTotalContributions,
      investmentYears: earlyInvestmentYears,
    },
    lateInvestor: {
      finalBalance: lateBalance,
      totalContributions: lateTotalContributions,
      totalReturns: lateBalance - lateTotalContributions,
      investmentYears: lateInvestmentYears,
    },
    difference: earlyFinalBalance - lateBalance,
  }
}

// Inflation Impact Calculation
export function calculateInflationImpact(
  currentAmount: number,
  returnRate: number,
  inflationRate: number,
  years: number,
) {
  const realReturnRate = ((1 + returnRate / 100) / (1 + inflationRate / 100) - 1) * 100
  const nominalFutureValue = currentAmount * Math.pow(1 + returnRate / 100, years)
  const realFutureValue = currentAmount * Math.pow(1 + realReturnRate / 100, years)

  const yearlyData = []
  for (let year = 0; year <= years; year++) {
    const nominalValue = currentAmount * Math.pow(1 + returnRate / 100, year)
    const realValue = currentAmount * Math.pow(1 + realReturnRate / 100, year)
    const purchasingPower = (realValue / nominalValue) * 100

    yearlyData.push({
      year,
      nominalValue,
      realValue,
      purchasingPower: year === 0 ? 100 : purchasingPower,
    })
  }

  return {
    realReturnRate,
    nominalFutureValue,
    realFutureValue,
    yearlyData,
  }
}

// Asset Allocation Risk Assessment
export function calculatePortfolioRisk(allocation: {
  stocks: number
  bonds: number
  cash: number
  crypto: number
  realEstate: number
}) {
  // Risk weights (higher = more risky)
  const riskWeights = {
    stocks: 0.7,
    bonds: 0.2,
    cash: 0.0,
    crypto: 1.0,
    realEstate: 0.5,
  }

  // Expected returns (annual %)
  const expectedReturns = {
    stocks: 8.0,
    bonds: 4.0,
    cash: 1.5,
    crypto: 12.0,
    realEstate: 6.0,
  }

  const totalAllocation = Object.values(allocation).reduce((sum, val) => sum + val, 0)

  // Calculate weighted risk score
  let riskScore = 0
  let expectedReturn = 0

  Object.entries(allocation).forEach(([asset, percentage]) => {
    const weight = percentage / totalAllocation
    riskScore += riskWeights[asset as keyof typeof riskWeights] * weight
    expectedReturn += expectedReturns[asset as keyof typeof expectedReturns] * weight
  })

  // Determine risk profile
  let riskProfile = "Conservative"
  if (riskScore > 0.7) riskProfile = "Speculative"
  else if (riskScore > 0.5) riskProfile = "Aggressive"
  else if (riskScore > 0.3) riskProfile = "Moderate"
  else if (riskScore > 0.1) riskProfile = "Conservative"
  else riskProfile = "Very Conservative"

  return {
    riskScore: riskScore * 100,
    riskProfile,
    expectedReturn: expectedReturn.toFixed(1),
  }
}
