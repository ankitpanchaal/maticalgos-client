const formatPNL = (value: number) => {
  const absValue = Math.abs(value);
  const formattedValue = absValue.toLocaleString();
  return value >= 0 ? `₹${formattedValue}` : `- ₹${formattedValue}`;
};

export default formatPNL;