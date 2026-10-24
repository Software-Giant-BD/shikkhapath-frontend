export function formatBengaliRelativeTime(dateString?: string | null): string {
  if (!dateString || typeof dateString !== "string") {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (Number.isNaN(diffInSeconds) || diffInSeconds < 0) {
    return "এখনই";
  }

  const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBengaliNumber = (num: number) =>
    String(num)
      .split("")
      .map((d) => (/\d/.test(d) ? bengaliNumbers[parseInt(d)] : d))
      .join("");

  if (diffInSeconds < 60) {
    return "এখনই";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toBengaliNumber(diffInMinutes)} মিনিট আগে`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toBengaliNumber(diffInHours)} ঘণ্টা আগে`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${toBengaliNumber(diffInDays)} দিন আগে`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${toBengaliNumber(diffInMonths)} মাস আগে`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${toBengaliNumber(diffInYears)} বছর আগে`;
}
