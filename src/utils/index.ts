// Function to convert ISO date string to YYYY-MM-DD
export const formatDateForInput = (isoDate: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};
