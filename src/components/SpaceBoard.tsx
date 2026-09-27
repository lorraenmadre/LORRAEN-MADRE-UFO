import React, { useState } from 'react';
import { Entity } from '../types';
import { boxLabel, boxRole, isUnnamed, orderForBoard } from '../entityOrder';
import styles from './SpaceBoard.module.css';

const COLS = 8;
const MIN_CELLS = 64;

interface Props {
  entities: Entity[];
  onSelect: (id: string) => void;
  onUpdate: (e: Entity) => void;
}

/** SPACE — the same true 8×8 checkerboard as the voice app. Unnamed boxes are terminals you type a name into. */
export default function SpaceBoard({ entities, onSelect, onUpdate }: Props) {
  const tiles = orderForBoard(entities);
  const cells = Math.max(MIN_CELLS, Math.ceil(tiles.length / COLS) * COLS);
  const claimed = tiles.filter((e) => !isUnnamed(e)).length;

  return (
    <section aria-label="Space board" className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.h2}>Space</h2>
        <p className={styles.tally}>
          {claimed}/{tiles.length} named and claimed
        </p>
      </div>
      <div className={styles.scroll}>
        <div className={styles.board} style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {Array.from({ length: cells }).map((_, i) => {
            const dark = (Math.floor(i / COLS) + (i % COLS)) % 2 === 0;
            const tone = dark ? styles.dark : styles.light;
            const e = tiles[i];
            if (!e) return <div key={i} className={`${styles.cell} ${tone}`} aria-hidden />;
            if (isUnnamed(e)) return <ClaimTile key={e.id} entity={e} dark={dark} onSelect={onSelect} onUpdate={onUpdate} />;
            return (
              <button key={e.id} type="button" className={`${styles.cell} ${styles.tile} ${tone}`} onClick={() => onSelect(e.id)}>
                <span className={styles.label}>{boxLabel(e)}</span>
                <span className={styles.title}>{e.name}</span>
                <span className={styles.role}>{boxRole(e)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClaimTile({ entity, dark, onSelect, onUpdate }: { entity: Entity; dark: boolean; onSelect: (id: string) => void; onUpdate: (e: Entity) => void }) {
  const [value, setValue] = useState('');
  return (
    <form
      className={`${styles.cell} ${dark ? styles.dark : styles.light}`}
      onSubmit={(ev) => {
        ev.preventDefault();
        const name = value.trim();
        if (name) onUpdate({ ...entity, name });
      }}
    >
      <button type="button" className={styles.labelBtn} onClick={() => onSelect(entity.id)}>
        {boxLabel(entity)}
      </button>
      <span className={styles.role}>{boxRole(entity) || 'unnamed'}</span>
      <label className={styles.term}>
        <span className={styles.prompt} aria-hidden>
          &gt;
        </span>
        <input
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          placeholder="name it"
          aria-label={`${boxLabel(entity)}: name it`}
          className={styles.input}
        />
      </label>
    </form>
  );
}
