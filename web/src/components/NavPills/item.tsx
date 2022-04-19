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
      <a
        className={["navpills__item", active && "navpills__item--active"]
          .filter(window.Boolean)
          .join(" ")}
        href={href}
      >
        <span>{translate(toTranslationMap(label))}</span>
      </a>
    </li>
  );
};

export default NavPillItem;
