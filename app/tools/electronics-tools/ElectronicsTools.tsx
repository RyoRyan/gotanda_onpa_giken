"use client";

import type { CSSProperties, ReactNode } from "react";
import { useId, useState } from "react";

type UnitInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: ReactNode;
  inputMode?: "decimal" | "numeric";
  maxLength?: number;
};

function UnitInput({
  label,
  value,
  onChange,
  suffix,
  inputMode = "decimal",
  maxLength,
}: UnitInputProps) {
  const inputId = useId();

  return (
    <div className="flex min-w-0 flex-col gap-2 text-sm font-semibold">
      <label htmlFor={inputId}>{label}</label>

      <div className="flex w-full min-w-0 overflow-hidden rounded-lg border border-zinc-300 bg-white focus-within:border-zinc-700">
        <input
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 flex-1 px-3 py-2 text-right text-base outline-none"
          inputMode={inputMode}
          maxLength={maxLength}
        />

        <div className="flex shrink-0 items-center border-l border-zinc-300 bg-zinc-100 text-sm text-zinc-700">
          {suffix}
        </div>
      </div>
    </div>
  );
}

function stripNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  return Number(value.toPrecision(10)).toString();
}

function parsePositiveNumber(value: string): number | null {
  if (value.trim() === "") return null;

  const num = Number(value);

  if (!Number.isFinite(num) || num < 0) {
    return null;
  }

  return num;
}

function normalizeNumberInput(value: string) {
  return value
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace("．", ".");
}

function sanitizeDecimalInput(value: string) {
  const normalized = normalizeNumberInput(value);

  let result = "";
  let hasDot = false;

  for (const char of normalized) {
    if (char >= "0" && char <= "9") {
      result += char;
    }

    if (char === "." && !hasDot) {
      result += char;
      hasDot = true;
    }
  }

  return result;
}

function sanitizeCodeInput(value: string) {
  const normalized = normalizeNumberInput(value);
  return normalized.replace(/\D/g, "").slice(0, 3);
}

function codeToOhm(code: string): number | null {
  const normalized = code.trim();

  if (!/^\d{3}$/.test(normalized)) {
    return null;
  }

  const significant = Number(normalized.slice(0, 2));
  const exponent = Number(normalized[2]);

  return significant * Math.pow(10, exponent);
}

function ohmToCode(ohm: number): string {
  if (!Number.isFinite(ohm) || ohm < 10) {
    return "";
  }

  let exponent = Math.floor(Math.log10(ohm)) - 1;
  let significant = Math.round(ohm / Math.pow(10, exponent));

  if (significant === 100) {
    significant = 10;
    exponent += 1;
  }

  if (significant < 10 || significant > 99 || exponent < 0 || exponent > 9) {
    return "";
  }

  return String(significant).padStart(2, "0") + String(exponent);
}

type CapField = "uf" | "nf" | "pf" | "code";

type CapValues = {
  uf: string;
  nf: string;
  pf: string;
  code: string;
};

function codeToPf(code: string): number | null {
  const normalized = code.trim();

  if (!/^\d{3}$/.test(normalized)) {
    return null;
  }

  const significant = Number(normalized.slice(0, 2));
  const multiplier = Number(normalized[2]);

  return significant * Math.pow(10, multiplier);
}

function pfToCode(pf: number): string {
  if (!Number.isFinite(pf) || pf < 10) {
    return "";
  }

  let exponent = Math.floor(Math.log10(pf)) - 1;
  let significant = Math.round(pf / Math.pow(10, exponent));

  if (significant >= 100) {
    significant = Math.round(significant / 10);
    exponent += 1;
  }

  if (exponent < 0 || exponent > 9 || significant < 10 || significant > 99) {
    return "";
  }

  return `${significant}${exponent}`;
}

function buildCapValuesFromPf(
  pf: number,
  changedField?: CapField,
  rawValue?: string,
): CapValues {
  const values: CapValues = {
    uf: stripNumber(pf / 1_000_000),
    nf: stripNumber(pf / 1_000),
    pf: stripNumber(pf),
    code: pfToCode(pf),
  };

  if (changedField && rawValue !== undefined) {
    values[changedField] = rawValue;
  }

  return values;
}

type MultiplierOption = "" | "K" | "M";
type BandValue = `${number}`;
type FiveBandMultiplierValue = BandValue | "gold" | "silver";
type ToleranceValue =
  | "brown"
  | "red"
  | "green"
  | "blue"
  | "violet"
  | "grey"
  | "gold"
  | "silver";

const digitBandOptions = [
  { value: "0", name: "Black", hex: "#000000" },
  { value: "1", name: "Brown", hex: "#8B4513" },
  { value: "2", name: "Red", hex: "#FF0000" },
  { value: "3", name: "Orange", hex: "#FFA500" },
  { value: "4", name: "Yellow", hex: "#FFFF00" },
  { value: "5", name: "Green", hex: "#00AA00" },
  { value: "6", name: "Blue", hex: "#0000FF" },
  { value: "7", name: "Violet", hex: "#EE82EE" },
  { value: "8", name: "Grey", hex: "#808080" },
  { value: "9", name: "White", hex: "#FFFFFF" },
] as const;

const fiveBandMultiplierOptions = [
  { value: "silver", name: "Silver", hex: "#C0C0C0" },
  { value: "gold", name: "Gold", hex: "#FFD700" },
  ...digitBandOptions,
] as const;

const toleranceOptions = [
  { value: "brown", name: "Brown", hex: "#8B4513", label: "±1%" },
  { value: "red", name: "Red", hex: "#FF0000", label: "±2%" },
  { value: "green", name: "Green", hex: "#00AA00", label: "±0.5%" },
  { value: "blue", name: "Blue", hex: "#0000FF", label: "±0.25%" },
  { value: "violet", name: "Violet", hex: "#EE82EE", label: "±0.1%" },
  { value: "grey", name: "Grey", hex: "#808080", label: "±0.05%" },
  { value: "gold", name: "Gold", hex: "#FFD700", label: "±5%" },
  { value: "silver", name: "Silver", hex: "#C0C0C0", label: "±10%" },
] as const;

const goldBandStyle: CSSProperties = {
  background: "linear-gradient(180deg, #f7db72 0%, #e7b63b 58%, #cc9322 100%)",
  borderColor: "#cfa044",
};

const silverBandStyle: CSSProperties = {
  background: "linear-gradient(180deg, #f2f2f2 0%, #cfcfcf 58%, #adadad 100%)",
  borderColor: "#bdbdbd",
};

function getBandStyle(band: { name: string; hex: string }): CSSProperties {
  if (band.name === "Gold") return goldBandStyle;
  if (band.name === "Silver") return silverBandStyle;
  return { backgroundColor: band.hex };
}

function getBandOption(value: string) {
  return digitBandOptions.find((option) => option.value === value);
}

function getFiveBandMultiplierOption(value: string) {
  return fiveBandMultiplierOptions.find((option) => option.value === value);
}

function getToleranceOption(value: ToleranceValue) {
  return toleranceOptions.find((option) => option.value === value);
}

function getMultiplierOptionFromExponent(exponent: number) {
  if (exponent === -2) return "silver";
  if (exponent === -1) return "gold";
  return String(exponent);
}

function getExponentFromMultiplierOption(value: string) {
  if (value === "silver") return -2;
  if (value === "gold") return -1;
  return Number(value);
}

function getFiveBandValuesFromOhms(ohms: number | null) {
  if (ohms === null || !Number.isFinite(ohms) || ohms <= 0) {
    return ["1", "0", "0", "0"];
  }

  let exponent = Math.floor(Math.log10(ohms)) - 2;
  let significant = Math.round(ohms / Math.pow(10, exponent));

  if (significant === 1000) {
    significant = 100;
    exponent += 1;
  }

  if (significant < 100 || significant > 999 || exponent < -2 || exponent > 9) {
    return ["1", "0", "0", "0"];
  }

  return [
    ...String(significant).split(""),
    getMultiplierOptionFromExponent(exponent),
  ];
}

export function ResistanceConverter() {
  const [rValue, setRValue] = useState("1");
  const [multiplier, setMultiplier] = useState<MultiplierOption>("K");
  const [code, setCode] = useState("102");
  const [tolerance, setTolerance] = useState<ToleranceValue>("gold");
  const toleranceOption = getToleranceOption(tolerance) ?? toleranceOptions[6];

  function computeCodeFromOhms(ohmValue: number | null) {
    return ohmValue === null ? "" : ohmToCode(ohmValue);
  }

  function syncResistanceValueFromOhms(actualOhms: number) {
    const nextMultiplier: MultiplierOption =
      actualOhms >= 1_000_000 ? "M" : actualOhms >= 1_000 ? "K" : "";
    setMultiplier(nextMultiplier);
    setRValue(
      stripNumber(
        actualOhms /
          (nextMultiplier === "M"
            ? 1_000_000
            : nextMultiplier === "K"
              ? 1_000
              : 1),
      ),
    );
  }

  function handleRChange(rawValue: string) {
    const sanitized = sanitizeDecimalInput(rawValue);
    setRValue(sanitized);

    const num = parsePositiveNumber(sanitized);
    const factor =
      multiplier === "K" ? 1_000 : multiplier === "M" ? 1_000_000 : 1;
    const actualOhms = num === null ? null : num * factor;
    setCode(computeCodeFromOhms(actualOhms));
  }

  function handleMultiplierChange(value: MultiplierOption) {
    setMultiplier(value);

    const num = parsePositiveNumber(rValue);
    const factor = value === "K" ? 1_000 : value === "M" ? 1_000_000 : 1;
    const actualOhms = num === null ? null : num * factor;
    setCode(computeCodeFromOhms(actualOhms));
  }

  function handleCodeChange(rawValue: string) {
    const sanitized = sanitizeCodeInput(rawValue);
    setCode(sanitized);

    const actualOhms = codeToOhm(sanitized);
    if (actualOhms === null) return;

    syncResistanceValueFromOhms(actualOhms);
  }

  function handleFourBandChange(index: number, value: BandValue) {
    const nextCode = /^\d{3}$/.test(code) ? code.split("") : ["4", "7", "0"];
    nextCode[index] = value;

    if (nextCode[0] === "0") {
      nextCode[0] = "1";
    }

    handleCodeChange(nextCode.join(""));
  }

  function handleFiveBandChange(
    index: number,
    value: BandValue | FiveBandMultiplierValue,
  ) {
    const nextBands = getFiveBandValuesFromOhms(actualOhmsValue);
    nextBands[index] = value;

    if (nextBands[0] === "0") {
      nextBands[0] = "1";
    }

    const significant = Number(`${nextBands[0]}${nextBands[1]}${nextBands[2]}`);
    const multiplierExponent = getExponentFromMultiplierOption(nextBands[3]);
    const nextOhms = significant * Math.pow(10, multiplierExponent);

    syncResistanceValueFromOhms(nextOhms);
    setCode(computeCodeFromOhms(nextOhms));
  }

  const ohms = parsePositiveNumber(rValue);
  const actualOhmsValue =
    ohms === null
      ? null
      : ohms *
        (multiplier === "K" ? 1_000 : multiplier === "M" ? 1_000_000 : 1);

  const toleranceBand = (
    <>
      <select
        aria-label="Tolerance color"
        value={tolerance}
        onChange={(event) => setTolerance(event.target.value as ToleranceValue)}
        className="ml-2 h-10 w-4 appearance-none rounded-sm border border-zinc-300 text-transparent shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
        style={getBandStyle(toleranceOption)}
        title={`${toleranceOption.name} (${toleranceOption.label})`}
      >
        {toleranceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      <span className="ml-2 whitespace-nowrap text-sm font-semibold text-zinc-700">
        {toleranceOption.label}
      </span>
    </>
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">抵抗値</h2>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <UnitInput
          label="resistance"
          value={rValue}
          onChange={handleRChange}
          suffix={
            <select
              aria-label="Resistance unit"
              value={multiplier}
              onChange={(event) =>
                handleMultiplierChange(event.target.value as MultiplierOption)
              }
              className="max-w-16 bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:ring-0"
            >
              <option value="">Ω</option>
              <option value="K">KΩ</option>
              <option value="M">MΩ</option>
            </select>
          }
        />

        <UnitInput
          label="code"
          value={code}
          onChange={handleCodeChange}
          suffix={<span className="px-3">code</span>}
        />

        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-semibold">4 band colorcode</p>
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
            {(() => {
              const bandValues = /^\d{3}$/.test(code)
                ? code.split("")
                : ["1", "0", "0"];
              return (
                <>
                  {bandValues.map((value, i) => {
                    const band = getBandOption(value);

                    return (
                      <select
                        key={i}
                        aria-label={`4 band colorcode band ${i + 1}`}
                        value={value}
                        onChange={(event) =>
                          handleFourBandChange(
                            i,
                            event.target.value as BandValue,
                          )
                        }
                        className="h-10 w-4 appearance-none rounded-sm border border-zinc-300 text-transparent shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
                        style={
                          band
                            ? getBandStyle(band)
                            : { backgroundColor: "#ffffff" }
                        }
                        title={band?.name ?? "Select color"}
                      >
                        {digitBandOptions
                          .filter((option) => i !== 0 || option.value !== "0")
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                    );
                  })}
                  <div className="ml-4 h-10 w-1 bg-zinc-200" />
                  {toleranceBand}
                </>
              );
            })()}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-semibold">5 band colorcode</p>
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
            {(() => {
              const bandValues = getFiveBandValuesFromOhms(actualOhmsValue);
              return (
                <>
                  {bandValues.map((value, i) => {
                    const band =
                      i === 3
                        ? getFiveBandMultiplierOption(value)
                        : getBandOption(value);
                    const options =
                      i === 3 ? fiveBandMultiplierOptions : digitBandOptions;

                    return (
                      <select
                        key={i}
                        aria-label={`5 band colorcode band ${i + 1}`}
                        value={value}
                        onChange={(event) =>
                          handleFiveBandChange(
                            i,
                            event.target.value as FiveBandMultiplierValue,
                          )
                        }
                        className="h-10 w-4 appearance-none rounded-sm border border-zinc-300 text-transparent shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
                        style={
                          band
                            ? getBandStyle(band)
                            : { backgroundColor: "#ffffff" }
                        }
                        title={band?.name ?? "Select color"}
                      >
                        {options
                          .filter((option) => i !== 0 || option.value !== "0")
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                    );
                  })}
                  <div className="ml-4 h-10 w-1 bg-zinc-200" />
                  {toleranceBand}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CapacitanceConverter() {
  const [values, setValues] = useState<CapValues>(() =>
    buildCapValuesFromPf(100_000),
  );

  function updateFromField(field: CapField, rawValue: string) {
    let pf: number | null = null;

    if (field === "uf") {
      const num = parsePositiveNumber(rawValue);
      pf = num === null ? null : num * 1_000_000;
    }

    if (field === "nf") {
      const num = parsePositiveNumber(rawValue);
      pf = num === null ? null : num * 1_000;
    }

    if (field === "pf") {
      pf = parsePositiveNumber(rawValue);
    }

    if (field === "code") {
      pf = codeToPf(rawValue);
    }

    if (pf === null) {
      setValues((current) => ({
        ...current,
        [field]: rawValue,
      }));
      return;
    }

    setValues(buildCapValuesFromPf(pf, field, rawValue));
  }

  function handleDecimalChange(field: "uf" | "nf" | "pf", rawValue: string) {
    updateFromField(field, sanitizeDecimalInput(rawValue));
  }

  function handleCodeChange(rawValue: string) {
    updateFromField("code", sanitizeCodeInput(rawValue));
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">容量値</h2>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <UnitInput
          label="microfarad"
          value={values.uf}
          onChange={(value) => handleDecimalChange("uf", value)}
          suffix={<span className="px-3">µF</span>}
        />

        <UnitInput
          label="nanofarad"
          value={values.nf}
          onChange={(value) => handleDecimalChange("nf", value)}
          suffix={<span className="px-3">nF</span>}
        />

        <UnitInput
          label="picofarad"
          value={values.pf}
          onChange={(value) => handleDecimalChange("pf", value)}
          suffix={<span className="px-3">pF</span>}
        />

        <UnitInput
          label="code"
          value={values.code}
          onChange={handleCodeChange}
          suffix={<span className="px-3">code</span>}
          inputMode="numeric"
          maxLength={3}
        />
      </div>
    </section>
  );
}

type ResistanceUnit = "ohm" | "kohm" | "mohm";
type CapacitanceUnit = "pf" | "nf" | "uf";
type FilterType = "low-pass" | "high-pass";

const resistanceFactors: Record<ResistanceUnit, number> = {
  ohm: 1,
  kohm: 1_000,
  mohm: 1_000_000,
};

const capacitanceFactors: Record<CapacitanceUnit, number> = {
  pf: 1e-12,
  nf: 1e-9,
  uf: 1e-6,
};

function formatFrequency(value: number) {
  if (!Number.isFinite(value)) return "";

  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toPrecision(4))} MHz`;
  }

  if (value >= 1_000) {
    return `${Number((value / 1_000).toPrecision(4))} kHz`;
  }

  return `${Number(value.toPrecision(4))} Hz`;
}

function getPositiveValue(value: string) {
  const parsed = parsePositiveNumber(value);
  return parsed === null || parsed <= 0 ? null : parsed;
}

type CutoffGraphProps = {
  cutoffFrequency: number | null;
  filterType: FilterType;
};

function CutoffGraph({ cutoffFrequency, filterType }: CutoffGraphProps) {
  const width = 640;
  const height = 320;
  const padding = { top: 22, right: 26, bottom: 46, left: 62 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const minFrequency = 20;
  const maxFrequency = 20_000;
  const minLog = Math.log10(minFrequency);
  const maxLog = Math.log10(maxFrequency);
  const minGain = -30;
  const maxGain = 10;
  const horizontalTicks = [10, 5, 0, -5, -10, -15, -20, -25, -30];
  const frequencyLabels = [
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 500, label: "500" },
    { value: 1_000, label: "1k" },
    { value: 2_000, label: "2k" },
    { value: 5_000, label: "5k" },
    { value: 10_000, label: "10k" },
    { value: 20_000, label: "20k" },
  ];
  const gridFrequencies = [20, 30, 40, 50, 60, 70, 80, 90];

  for (const decade of [100, 1_000, 10_000]) {
    for (let multiplier = 1; multiplier < 10; multiplier += 1) {
      gridFrequencies.push(decade * multiplier);
    }
  }

  if (!gridFrequencies.includes(maxFrequency)) {
    gridFrequencies.push(maxFrequency);
  }

  function getX(frequency: number) {
    const progress = (Math.log10(frequency) - minLog) / (maxLog - minLog);
    return padding.left + progress * graphWidth;
  }

  function getY(gainDb: number) {
    const clampedGain = Math.max(minGain, Math.min(maxGain, gainDb));
    return (
      padding.top +
      ((maxGain - clampedGain) / (maxGain - minGain)) * graphHeight
    );
  }

  const cutoffX =
    cutoffFrequency === null
      ? null
      : Math.max(
          padding.left,
          Math.min(padding.left + graphWidth, getX(cutoffFrequency)),
        );
  const cutoffY = getY(-3);

  const responsePath = Array.from({ length: 96 }, (_, index) => {
    const progress = index / 95;
    const frequency = Math.pow(10, minLog + progress * (maxLog - minLog));
    const ratio =
      cutoffFrequency === null || cutoffFrequency <= 0
        ? 0
        : frequency / cutoffFrequency;
    const gain =
      filterType === "high-pass"
        ? ratio / Math.sqrt(1 + ratio * ratio)
        : 1 / Math.sqrt(1 + ratio * ratio);
    const gainDb = 20 * Math.log10(Math.max(gain, Number.EPSILON));
    const x = padding.left + progress * graphWidth;
    const y = getY(gainDb);

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-3">
      <svg
        aria-label="RC filter cutoff frequency graph"
        className="h-auto w-full max-w-full"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect width={width} height={height} fill="#ffffff" />
        <rect
          x={padding.left}
          y={padding.top}
          width={graphWidth}
          height={graphHeight}
          fill="#ffffff"
          stroke="#a1a1aa"
        />

        {gridFrequencies.map((frequency) => {
          const x = getX(frequency);
          const isMajor = frequencyLabels.some(
            (label) => label.value === frequency,
          );

          return (
            <line
              key={frequency}
              x1={x}
              x2={x}
              y1={padding.top}
              y2={padding.top + graphHeight}
              stroke={isMajor ? "#d4d4d8" : "#e4e4e7"}
              strokeWidth={isMajor ? "1.2" : "1"}
            />
          );
        })}

        {horizontalTicks.map((gain) => {
          const y = getY(gain);
          const isMajor = gain % 10 === 0;

          return (
            <g key={gain}>
              <line
                x1={padding.left}
                x2={padding.left + graphWidth}
                y1={y}
                y2={y}
                stroke={isMajor ? "#d4d4d8" : "#e4e4e7"}
                strokeWidth={isMajor ? "1.2" : "1"}
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                fill="#52525b"
                fontSize="14"
                textAnchor="end"
              >
                {gain}
              </text>
            </g>
          );
        })}

        <text
          x={18}
          y={padding.top + graphHeight / 2}
          fill="#52525b"
          fontSize="13"
          textAnchor="middle"
          transform={`rotate(-90 18 ${padding.top + graphHeight / 2})`}
        >
          Gain [dB]
        </text>

        <path
          d={responsePath}
          fill="none"
          stroke="#27272a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />

        {cutoffX !== null ? (
          <>
            <line
              x1={cutoffX}
              x2={cutoffX}
              y1={padding.top}
              y2={padding.top + graphHeight}
              stroke="#71717a"
              strokeDasharray="6 5"
              strokeWidth="1.6"
            />
            <circle cx={cutoffX} cy={cutoffY} r="5" fill="#18181b" />

            <text
              x={cutoffX}
              y={padding.top + 16}
              fill="#52525b"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
            >
              fc
            </text>
          </>
        ) : null}

        {frequencyLabels.map((frequency) => (
          <text
            key={frequency.value}
            x={getX(frequency.value)}
            y={height - 20}
            fill="#52525b"
            fontSize="12"
            textAnchor="middle"
          >
            {frequency.label}
          </text>
        ))}

        <text
          x={padding.left + graphWidth / 2}
          y={height - 5}
          fill="#52525b"
          fontSize="12"
          textAnchor="middle"
        >
          Frequency [Hz]
        </text>
      </svg>
    </div>
  );
}

export function RcFilterCutoff() {
  const [filterType, setFilterType] = useState<FilterType>("low-pass");
  const [resistance, setResistance] = useState("10");
  const [resistanceUnit, setResistanceUnit] = useState<ResistanceUnit>("kohm");
  const [capacitance, setCapacitance] = useState("10");
  const [capacitanceUnit, setCapacitanceUnit] = useState<CapacitanceUnit>("nf");

  const resistanceValue = getPositiveValue(resistance);
  const capacitanceValue = getPositiveValue(capacitance);
  const actualResistance =
    resistanceValue === null
      ? null
      : resistanceValue * resistanceFactors[resistanceUnit];
  const actualCapacitance =
    capacitanceValue === null
      ? null
      : capacitanceValue * capacitanceFactors[capacitanceUnit];
  const cutoffFrequency =
    actualResistance === null || actualCapacitance === null
      ? null
      : 1 / (2 * Math.PI * actualResistance * actualCapacitance);

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl font-semibold">
        <span>RCフィルタ カットオフ周波数</span>
        <span className="text-sm font-medium text-zinc-500">
          fc = 1 / (2πRC)
        </span>
      </h2>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="grid min-w-0 content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-2 text-sm font-semibold sm:col-span-2 lg:col-span-1">
            <p>filter type</p>
            <div className="grid min-w-0 grid-cols-2 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 p-1">
              {[
                { value: "low-pass", label: "Low pass" },
                { value: "high-pass", label: "High pass" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilterType(option.value as FilterType)}
                  className={`min-w-0 rounded-md px-2 py-2 text-center text-sm font-semibold leading-snug transition ${
                    filterType === option.value
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <UnitInput
            label="resistance"
            value={resistance}
            onChange={(value) => setResistance(sanitizeDecimalInput(value))}
            suffix={
              <select
                aria-label="Resistance unit"
                value={resistanceUnit}
                onChange={(event) =>
                  setResistanceUnit(event.target.value as ResistanceUnit)
                }
                className="max-w-16 bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:ring-0"
              >
                <option value="ohm">Ω</option>
                <option value="kohm">kΩ</option>
                <option value="mohm">MΩ</option>
              </select>
            }
          />

          <UnitInput
            label="capacitance"
            value={capacitance}
            onChange={(value) => setCapacitance(sanitizeDecimalInput(value))}
            suffix={
              <select
                aria-label="Capacitance unit"
                value={capacitanceUnit}
                onChange={(event) =>
                  setCapacitanceUnit(event.target.value as CapacitanceUnit)
                }
                className="max-w-16 bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:ring-0"
              >
                <option value="pf">pF</option>
                <option value="nf">nF</option>
                <option value="uf">µF</option>
              </select>
            }
          />

          <div className="min-w-0 rounded-lg bg-zinc-100 p-4">
            <p className="text-sm font-semibold text-zinc-600">
              cutoff frequency
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">
              {cutoffFrequency === null
                ? "Enter R and C"
                : formatFrequency(cutoffFrequency)}
            </p>
          </div>
        </div>

        <CutoffGraph
          cutoffFrequency={cutoffFrequency}
          filterType={filterType}
        />
      </div>
    </section>
  );
}
