"use client";

import { useMemo, useState } from "react";

type CapacitanceUnit = "uf" | "nf" | "pf";
type InputMode = "value" | "code";

const unitMultipliersToPf: Record<CapacitanceUnit, number> = {
  uf: 1_000_000,
  nf: 1_000,
  pf: 1,
};

const formatNumber = (value: number, maximumFractionDigits = 6) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);

const normalizeCode = (code: string) => code.trim().replace(/\s+/g, "");

const decodeCapacitorCode = (code: string) => {
  const normalizedCode = normalizeCode(code);

  if (!/^\d{3}$/.test(normalizedCode)) {
    return null;
  }

  const significantDigits = Number(normalizedCode.slice(0, 2));
  const multiplierExponent = Number(normalizedCode.slice(2));
  const picofarads = significantDigits * 10 ** multiplierExponent;

  return {
    code: normalizedCode,
    picofarads,
  };
};

const encodeCapacitorCode = (picofarads: number) => {
  if (!Number.isFinite(picofarads) || picofarads <= 0) {
    return "-";
  }

  for (let exponent = 0; exponent <= 9; exponent += 1) {
    const significantDigits = picofarads / 10 ** exponent;

    if (
      Number.isInteger(significantDigits) &&
      significantDigits >= 10 &&
      significantDigits <= 99
    ) {
      return `${significantDigits}${exponent}`;
    }
  }

  return "No standard 3-digit code";
};

export default function CapacitorConverter() {
  const [inputMode, setInputMode] = useState<InputMode>("code");
  const [capacitance, setCapacitance] = useState("0.1");
  const [capacitanceUnit, setCapacitanceUnit] =
    useState<CapacitanceUnit>("uf");
  const [capacitorCode, setCapacitorCode] = useState("104");

  const result = useMemo(() => {
    if (inputMode === "code") {
      const decoded = decodeCapacitorCode(capacitorCode);

      return {
        isValid: decoded !== null,
        picofarads: decoded?.picofarads ?? 0,
        code: decoded?.code ?? "-",
      };
    }

    const value = Number(capacitance);
    const picofarads = value * unitMultipliersToPf[capacitanceUnit];

    return {
      isValid: value > 0 && Number.isFinite(picofarads),
      picofarads,
      code: encodeCapacitorCode(picofarads),
    };
  }, [capacitance, capacitanceUnit, capacitorCode, inputMode]);

  const microfarads = result.picofarads / unitMultipliersToPf.uf;
  const nanofarads = result.picofarads / unitMultipliersToPf.nf;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-zinc-900">
            Input mode
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <ModeOption
              checked={inputMode === "code"}
              label="Code to value"
              onChange={() => setInputMode("code")}
            />
            <ModeOption
              checked={inputMode === "value"}
              label="Value to code"
              onChange={() => setInputMode("value")}
            />
          </div>
        </fieldset>

        {inputMode === "code" ? (
          <label className="mt-5 block space-y-2">
            <span className="text-sm font-semibold text-zinc-900">
              Capacitor code
            </span>
            <input
              value={capacitorCode}
              onChange={(event) => setCapacitorCode(event.target.value)}
              inputMode="numeric"
              maxLength={3}
              placeholder="104"
              className="w-full rounded-sm border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-800"
            />
          </label>
        ) : (
          <label className="mt-5 block space-y-2">
            <span className="text-sm font-semibold text-zinc-900">
              Capacitance
            </span>
            <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={capacitance}
                onChange={(event) => setCapacitance(event.target.value)}
                className="min-w-0 rounded-sm border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-800"
              />
              <select
                value={capacitanceUnit}
                onChange={(event) =>
                  setCapacitanceUnit(event.target.value as CapacitanceUnit)
                }
                className="rounded-sm border border-zinc-300 bg-white px-2 py-2 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-800"
              >
                <option value="uf">uF</option>
                <option value="nf">nF</option>
                <option value="pf">pF</option>
              </select>
            </div>
          </label>
        )}

        {!result.isValid ? (
          <p className="mt-4 rounded-sm border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            3桁の数字コード、または 0 より大きい容量を入力してください。
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm">
        <p className="text-sm font-semibold text-zinc-300">Result</p>
        <dl className="mt-4 space-y-4">
          <ResultItem
            label="Microfarads"
            value={result.isValid ? `${formatNumber(microfarads)} uF` : "-"}
          />
          <ResultItem
            label="Nanofarads"
            value={result.isValid ? `${formatNumber(nanofarads)} nF` : "-"}
          />
          <ResultItem
            label="Picofarads"
            value={
              result.isValid ? `${formatNumber(result.picofarads, 2)} pF` : "-"
            }
          />
          <ResultItem label="Code" value={result.isValid ? result.code : "-"} />
        </dl>
      </div>
    </div>
  );
}

function ModeOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition-colors has-checked:border-zinc-900 has-checked:bg-zinc-900 has-checked:text-white">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-zinc-900"
      />
      {label}
    </label>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-zinc-400">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-white">{value}</dd>
    </div>
  );
}
