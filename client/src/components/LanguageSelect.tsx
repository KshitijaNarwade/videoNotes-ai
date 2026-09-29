import { Languages } from "lucide-react";

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
    <div className="w-full max-w-xs">
      {/* Label */}
      <label
        htmlFor="language"
        className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"
      >
        <Languages size={14} className="text-indigo-400" />
        Analysis language
      </label>

      {/* Select */}
      <div className="relative">
        <select
          id="language"
          value={value}
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          className="
            h-11
            w-full
            appearance-none
            rounded-xl
            border
            border-white/[0.08]
            bg-slate-900/70
            px-4
            pr-10
            text-sm
            font-medium
            text-slate-200
            outline-none
            transition
            duration-200
            hover:border-white/[0.14]
            focus:border-indigo-500/50
            focus:ring-4
            focus:ring-indigo-500/10
            cursor-pointer
          "
        >
          {LANGUAGE_CODES.map((code) => (
            <option
              key={code}
              value={code}
              className="bg-[#0b1120] text-slate-200"
            >
              {getLanguageName(code)}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
