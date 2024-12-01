export const formatCurrency = (amount, currency) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ?? 'EUR',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  
    const firstChar = formatted.charAt(0);
    return firstChar + ' ' + formatted.slice(1).trim();
  };