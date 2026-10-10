import React from 'react';

/**
 * Wonderland, the Space board. Cleared for now: an empty eight-by-eight board.
 * Planets, Dinosaurs and Satellites are listed below the board with their progress.
 */
export default function SpaceBoard() {
  return (
    <section aria-label="Space board">
      <div className="lm-chess-scroll">
        <div className="lm-checkerboard" aria-label="Eight by eight board, cleared for now">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className={`lm-checker-cell ${(Math.floor(i / 8) + i % 8) % 2 ? 'is-dark' : ''}`} aria-hidden="true" />
          ))}
        </div>
      </div>
      <p className="lm-caption">The board is clear for now. Your planets, dinosaurs and satellites are listed below.</p>
    </section>
  );
}
