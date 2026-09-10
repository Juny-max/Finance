export function formatGHS(amount: number, opts?: { hideDecimals?: boolean; compact?: boolean }): string {
  if (isNaN(amount)) return "GH₵ 0.00";
  if (opts?.compact) {
    if (Math.abs(amount) >= 1_000_000) return `GH₵ ${(amount / 1_000_000).toFixed(2)}M`;
    if (Math.abs(amount) >= 1_000) return `GH₵ ${(amount / 1_000).toFixed(amount >= 10_000 ? 0 : 1)}K`;
  }
  return `GH₵\u00A0${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: opts?.hideDecimals ? 0 : 2,
    maximumFractionDigits: opts?.hideDecimals ? 0 : 2,
  }).format(amount)}`;
}

export function formatMasked(amount: number, hidden: boolean, opts?: { hideDecimals?: boolean }): string {
  if (hidden) return "GH₵\u00A0••••••";
  return formatGHS(amount, opts);
}

export function formatNAV(nav: number): string {
  return `GH₵\u00A0${nav.toFixed(4)}`;
}

export function formatNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatPercent(value: number, sign = true): string {
  const s = sign && value > 0 ? "+" : "";
  return `${s}${value.toFixed(2)}%`;
}

export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateString));
  } catch { return dateString; }
}

export function formatDateLong(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateString));
  } catch { return dateString; }
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
