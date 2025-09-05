import Link from "next/link";
import { useTranslation } from "translations/index";
import { useCallback } from "react";

const NavPillItem = ({ href, label, active = false }: NavPillItemProps) => {
  const translate = useTranslation();

  const toTranslationMap = useCallback(
    (label: NavPillItemTranslatableLabel[]) =>
      label.reduce((translationMap: TranslationMap, { language, label }) => {
        translationMap[language] = label;
        return translationMap;
      }, {}),
    []
  );

  return (
    <li>
      <Link href={href}>
        <a
          className={["navpills__item", active && "navpills__item--active"]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{translate(toTranslationMap(label))}</span>
        </a>
      </Link>
    </li>
  );
};

export default NavPillItem;
