# Shared Design / Work / Play contract

Confirmed by Rae on September 28, 2026. Apply when touching the UFO website, Floot/CarPlay app, Sanctuary Cell and other family-office surfaces.

- One shared size: 112px wide, 44px high (the Design-sized pill used in this app).
- Design: white background, black #111 text.
- Work: blue #004aad background, white text.
- Play: red #f41c1c background, white text.
- No black resting border. Soft shadow: `0 4px 12px #0002`.
- Figtree 600, 14px. Center the label; do not shrink Work or Play to text width.
- Keyboard focus remains visible via an offset focus indicator.
- Preserve each surface’s routes. Local actions take priority over a default external URL.
- Website/UFO remains white; CarPlay remains black. This shared rule does not change that distinction.

Implemented in `ActionPills.tsx` and `index.css` throughout this app. Other repositories/apps have not been modified in this revision. Reuse this contract when their source is available; do not report a cross-app rollout as complete before verifying it.
