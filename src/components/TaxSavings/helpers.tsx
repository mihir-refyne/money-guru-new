function getTaxCalculator({
  standardDeduction,
  taxSlabs,
}: {
  standardDeduction?: number;
  taxSlabs: Record<number, number>;
}) {
  return (yearlyIncome: number) => {
    const taxableIncome = yearlyIncome - (standardDeduction ?? 0);

    let tax = 0;

    if (taxableIncome <= 700000) {
      return tax;
    }

    const slabRates = Object.entries(taxSlabs);
    slabRates.sort((a, b) => {
      return a[1] - b[1];
    });

    for (let i = 0; i < slabRates.slice(0, -1).length; i++) {
      const [slab, percent] = slabRates[i];
      tax +=
        (Math.min(
          Math.max(0, taxableIncome - Number(slab)),
          Math.abs(Number(slab) - Number(slabRates[i + 1][0]))
        ) *
          percent) /
        100;
    }

    tax +=
      (Math.max(0, taxableIncome - Number(slabRates[slabRates.length - 1][0])) *
        slabRates[slabRates.length - 1][1]) /
      100;
    // Cess
    tax += (tax * 4) / 100;

    return tax;
  };
}

const taxSlabsBudget2023 = {
  300000: 5,
  600000: 10,
  900000: 15,
  1200000: 20,
  1500000: 30,
};

const taxSlabsBudget2024 = {
  300000: 5,
  700000: 10,
  1000000: 15,
  1200000: 20,
  1500000: 30,
};

export const getTaxFor2023 = getTaxCalculator({
  standardDeduction: 50000,
  taxSlabs: taxSlabsBudget2023,
});

export const getTaxFor2024 = getTaxCalculator({
  standardDeduction: 75000,
  taxSlabs: taxSlabsBudget2024,
});
