import { SIGNS, type SkySnapshot, type BodyId } from "../sky/skyMath";
import styles from "./SkyWheel.module.css";

interface SkyWheelProps {
  sky: SkySnapshot;
  /** Optional second chart whose positions are drawn as small ticks on each track (e.g. birth over now). */
  overlay?: SkySnapshot | null;
  selected?: BodyId | null;
  onSelect?: (id: BodyId) => void;
  centerTop: string;
  centerMain: string;
  centerSub: string;
  className?: string;
}

const C = 500;
const R_SIGN_OUT = 492;
const R_SIGN_IN = 438;
const R_HOUSE_IN = 398;
const R_TRACK_OUT = 378;
const R_TRACK_IN = 146;

/**
 * The sky as a circular Gantt chart: zodiac + whole-sign houses on the rim,
 * one concentric track per body showing where it has been (faint) and where it is going (bright).
 */
export const SkyWheel = ({ sky, overlay, selected, onSelect, centerTop, centerMain, centerSub, className }: SkyWheelProps) => {
  // Ascendant sits at 9 o'clock; zodiac runs counter-clockwise.
  const ang = (lon: number) => ((180 + lon - sky.asc) * Math.PI) / 180;
  const pt = (lon: number, r: number) => [C + r * Math.cos(ang(lon)), C - r * Math.sin(ang(lon))] as const;

  const wedge = (from: number, to: number, rOut: number, rIn: number) => {
    const [x1, y1] = pt(from, rOut);
    const [x2, y2] = pt(to, rOut);
    const [x3, y3] = pt(to, rIn);
    const [x4, y4] = pt(from, rIn);
    return `M${x1},${y1} A${rOut},${rOut} 0 0 0 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 0 1 ${x4},${y4} Z`;
  };

  const n = sky.bodies.length;
  const gap = (R_TRACK_OUT - R_TRACK_IN) / Math.max(1, n - 1);
  const trackR = (i: number) => R_TRACK_OUT - i * gap;

  const pathD = (pts: { lon: number }[], r: number) => {
    let d = "";
    pts.forEach((p, i) => {
      const [x, y] = pt(p.lon, r);
      const jump = i > 0 && Math.abs(((p.lon - pts[i - 1].lon + 540) % 360) - 180) > 40;
      d += `${i === 0 || jump ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
    });
    return d;
  };

  return (
    <svg viewBox="0 0 1000 1000" className={`${styles.wheel} ${className ?? ""}`} role="img" aria-label="Sky wheel">
      {/* Zodiac ring — checkerboard of signs */}
      {SIGNS.map((s, i) => {
        const from = i * 30;
        const [gx, gy] = pt(from + 15, (R_SIGN_OUT + R_SIGN_IN) / 2);
        const dark = i % 2 === 0;
        return (
          <g key={s.name}>
            <path d={wedge(from, from + 30, R_SIGN_OUT, R_SIGN_IN)} className={dark ? styles.inkCell : styles.ivoryCell} />
            <text x={gx} y={gy} className={`${styles.signGlyph} ${dark ? styles.onInk : styles.onIvory}`}>
              {s.glyph}
            </text>
          </g>
        );
      })}

      {/* House ring — whole-sign houses, opposite checker tone */}
      {Array.from({ length: 12 }).map((_, h) => {
        const signIdx = (sky.ascSign + h) % 12;
        const from = signIdx * 30;
        const [hx, hy] = pt(from + 15, (R_SIGN_IN + R_HOUSE_IN) / 2);
        const dark = signIdx % 2 === 1;
        return (
          <g key={h}>
            <path d={wedge(from, from + 30, R_SIGN_IN, R_HOUSE_IN)} className={dark ? styles.inkCell : styles.ivoryCell} />
            <text x={hx} y={hy} className={`${styles.houseNum} ${dark ? styles.onInk : styles.onIvory}`}>
              {h + 1}
            </text>
          </g>
        );
      })}

      {/* Sign cusp spokes through the tracks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const [x1, y1] = pt(i * 30, R_HOUSE_IN);
        const [x2, y2] = pt(i * 30, R_TRACK_IN - 10);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.spoke} />;
      })}

      {/* Ascendant marker */}
      {(() => {
        const [x1, y1] = pt(sky.asc, R_SIGN_OUT + 6);
        const [x2, y2] = pt(sky.asc, R_TRACK_IN - 12);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} className={styles.ascLine} />;
      })()}

      {/* Tracks */}
      {sky.bodies.map((b, i) => {
        const r = trackR(i);
        const past = b.path.filter((p) => p.offset <= 0);
        const future = b.path.filter((p) => p.offset >= 0);
        const retroPts = b.path.filter((p) => p.retro);
        const [bx, by] = pt(b.lon, r);
        const ov = overlay?.bodies.find((o) => o.id === b.id);
        const isSel = selected === b.id;
        return (
          <g key={b.id} className={`${styles.track} ${isSel ? styles.trackSel : ""}`} onClick={() => onSelect?.(b.id)}>
            <circle cx={C} cy={C} r={r} className={styles.trackLine} />
            {past.length > 1 && <path d={pathD(past, r)} className={styles.pastPath} />}
            {future.length > 1 && <path d={pathD(future, r)} className={styles.futurePath} />}
            {retroPts.length > 0 &&
              retroPts.map((p, k) => {
                const [x, y] = pt(p.lon, r);
                return <circle key={k} cx={x} cy={y} r={2.2} className={styles.retroDot} />;
              })}
            {ov && (() => {
              const [ox, oy] = pt(ov.lon, r);
              return <circle cx={ox} cy={oy} r={5} className={styles.overlayMark} />;
            })()}
            <circle cx={bx} cy={by} r={isSel ? 13 : 10} className={styles.bodyDisc} />
            <text x={bx} y={by} className={styles.bodyGlyph}>
              {b.glyph}
            </text>
            <circle cx={bx} cy={by} r={22} className={styles.hit} />
          </g>
        );
      })}

      {/* Center */}
      <circle cx={C} cy={C} r={R_TRACK_IN - 22} className={styles.center} />
      <text x={C} y={C - 44} className={styles.centerTop}>
        {centerTop}
      </text>
      <text x={C} y={C + 2} className={styles.centerMain}>
        {centerMain}
      </text>
      <text x={C} y={C + 44} className={styles.centerSub}>
        {centerSub}
      </text>
    </svg>
  );
};
