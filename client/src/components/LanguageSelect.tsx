import {
  LANGUAGE_CODES,
  getLanguageName,
  type LanguageCode,
} from "../utils/languages";

interface LanguageSelectProps {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
}

const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  return (
    <div>
      <label htmlFor="language">Language</label>

      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
      >
        {LANGUAGE_CODES.map((code) => (
          <option key={code} value={code}>
            {getLanguageName(code)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelect;
