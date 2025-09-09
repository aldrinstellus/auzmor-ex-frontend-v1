import { useTranslation } from "react-i18next";

interface BetaTagProps {
  type?: "small" | "large";
}

export default function BetaTag({ type = "large" }: BetaTagProps) {
  const { t } = useTranslation('common');

  return (
    <span
      className={`
        inline-block rounded bg-neutral-800 italic text-white
        px-2 py-0.5
        ${type === "small" ? "text-xs" : "text-sm font-medium"}
      `}
    >
      {t("beta")}
    </span>
  );
}
