"use client";

import { useMemo, useState } from "react";

type ResistanceUnit = "ohm" | "kohm" | "mohm";
type CapacitanceUnit = "pf" | "nf" | "uf";
type FilterType = "low-pass" | "high-pass";

const resistanceMultipliers: Record<ResistanceUnit, number> = {
  ohm: 1,
  kohm: 1_000,
  mohm: 1_000_000,
};

const capacitanceMultipliers: Record<CapacitanceUnit, number> = {
  pf: 1e-12,
  nf: 1e-9,
  uf: 1e-6,
};

const formatNumber = (value: number, fractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
  }).format(value);

const formatFrequency = (frequency: number) => {
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return "-";
  }

  if (frequency >= 1_000_000) {
    return `${formatNumber(frequency / 1_000_000, 3)} MHz`;
  }

  if (frequency >= 1_000) {
    return `${formatNumber(frequency / 1_000, 2)} kHz`;
  }

  return `${formatNumber(frequency, 2)} Hz`;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "-";
  }

  if (seconds < 0.001) {
    return `${formatNumber(seconds * 1_000_000, 2)} us`;
  }

  if (seconds < 1) {
    return `${formatNumber(seconds * 1_000, 2)} ms`;
  }

  return `${formatNumber(seconds, 3)} s`;
};

export default function RCFilterCalculator() {
  const [resistance, setResistance] = useState("10");
  const [resistanceUnit, setResistanceUnit] =
    useState<ResistanceUnit>("kohm");
  const [capacitance, setCapacitance] = useState("10");
  const [capacitanceUnit, setCapacitanceUnit] =
    useState<CapacitanceUnit>("nf");
  const [filterType, setFilterType] = useState<FilterType>("low-pass");

  const result = useMemo(() => {
    const resistanceValue = Number(resistance);
    const capacitanceValue = Number(capacitance);
    const resistanceOhms = resistanceValue * resistanceMultipliers[resistanceUnit];
    const capacitanceFarads =
      capacitanceValue * capacitanceMultipliers[capacitanceUnit];
    const timeConstant = resistanceOhms * capacitanceFarads;
    const cutoffFrequency = 1 / (2 * Math.PI * timeConstant);

    return {
      cutoffFrequency,
      timeConstant,
      resistanceOhms,
      capacitanceFarads,
      isValid:
        resistanceValue > 0 &&
        capacitanceValue > 0 &&
        Number.isFinite(cutoffFrequency),
    };
  }, [capacitance, capacitanceUnit, resistance, resistanceUnit]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Resistance">
            <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={resistance}
                onChange={(event) => setResistance(event.target.value)}
                className="min-w-0 rounded-sm border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-800"
              />
              <select
                value={resistanceUnit}
                onChange={(event) =>
                  setResistanceUnit(event.target.value as ResistanceUnit)
                }
                className="rounded-sm border border-zinc-300 bg-white px-2 py-2 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-800"
              >
                <option value="ohm">ohm</option>
                <option value="kohm">kohm</option>
                <option value="mohm">Mohm</option>
              </select>
            </div>
          </Field>

          <Field label="Capacitance">
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
                <option value="pf">pF</option>
                <option value="nf">nF</option>
                <option value="uf">uF</option>
              </select>
            </div>
          </Field>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold text-zinc-900">
            Filter type
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <FilterOption
              checked={filterType === "low-pass"}
              label="Low-pass"
              onChange={() => setFilterType("low-pass")}
            />
            <FilterOption
              checked={filterType === "high-pass"}
              label="High-pass"
              onChange={() => setFilterType("high-pass")}
            />
          </div>
        </fieldset>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm">
        <p className="text-sm font-semibold text-zinc-300">Result</p>
        <dl className="mt-4 space-y-4">
          <ResultItem
            label="Cutoff frequency"
            value={
              result.isValid ? formatFrequency(result.cutoffFrequency) : "-"
            }
          />
          <ResultItem
            label="Time constant"
            value={result.isValid ? formatTime(result.timeConstant) : "-"}
          />
          <ResultItem
            label="Circuit"
            value={filterType === "low-pass" ? "RC low-pass" : "RC high-pass"}
          />
        </dl>

        <div className="mt-5 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
          R = {result.isValid ? formatNumber(result.resistanceOhms, 2) : "-"} ohm
          <br />C ={" "}
          {result.isValid
            ? formatNumber(result.capacitanceFarads, 12)
            : "-"}{" "}
          F
        </div>
      </div>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-zinc-900">{label}</span>
      {children}
    </label>
  );
}

function FilterOption({
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
