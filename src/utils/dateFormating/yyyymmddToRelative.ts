export const yyyymmddToRelative = (yyyymmdd: string) => {
  const date = new Date(yyyymmdd);
  if (Number.isNaN(date.getTime())) return yyyymmdd;

  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absDiffInSeconds = Math.abs(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absDiffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  const absDiffInMinutes = Math.abs(diffInMinutes);
  if (absDiffInMinutes < 60) {
    return rtf.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  const absDiffInHours = Math.abs(diffInHours);
  if (absDiffInHours < 24) {
    return rtf.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInHours / 24);
  const absDiffInDays = Math.abs(diffInDays);
  if (absDiffInDays < 30) {
    return rtf.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInDays / 30);
  const absDiffInMonths = Math.abs(diffInMonths);
  if (absDiffInMonths < 12) {
    return rtf.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInMonths / 12);
  return rtf.format(diffInYears, "year");
};
