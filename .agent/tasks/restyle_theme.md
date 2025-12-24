Style Update Plan: Elegant Minimal Red Theme

## Goal
Restyle the entire website (except the homepage fullscreen image) to use a primary red color scheme (matching the header) and an elegant, minimal, ordered, and simple aesthetic.

## 1. Color Palette Update
- **Primary Color:** `#8E1C14` (Venetian Red) - currently used for active links.
- **Secondary/Text Color:** `#333333` or `#2c2c2c` (Dark Charcoal) for main text - simpler and more legible than the previous ink dark if it had blue tints.
- **Backgrounds:** Keep the clean paper/white backgrounds but remove blueish tints from shadows or borders.
- **Accents:** Remove "lagoon blue" accents and replace with either neutral greys or the primary red.

## 2. Typography & Layout (Elegant & Minimal)
- **Headings (h1, h2, h3):**
    - Font: `Crimson Text` (Serif) or `Amoria` (Custom). simpler.
    - Color: `#8E1C14` (Red) or Dark Grey. The user said "colore principale alla fine è i rosso", so headers in Red is a strong choice.
    - Style: Letter-spacing slightly increased for elegance.
- **Body Text:**
    - Font: `Crimson Text`.
    - Line-height: `1.8` for better readability (minimal/ordered feel).
    - Color: Dark Grey/Black (high contrast but soft).
    - Margins: Increase white space between paragraphs.
- **Buttons:**
    - Outline styles or solid Red (`#8E1C14`) with simple hover effects.
    - Rounded corners (border-radius) or sharp? "Minimal" often implies sharp or slightly rounded. I'll stick to slightly rounded `4px` or `25px` if it fits the "ordered" vibe.

## 3. Specific Element Updates
- **Header:** Already has the red active state. Ensure non-active links are clean black/dark grey.
- **Cards (Gallery/Links):** Remove blue borders/shadows. Use subtle grey shadows.
- **Forms (Contact):** Simplify inputs. Remove blue focus rings, use Red or Grey focus rings.
- **Footer:** Simple, minimal.

## 4. CSS Variable Changes
- Redefine `--color-lagoon-blue`, `--color-lagoon-deep` to align with the new theme (or remove them and use new variables like `--color-primary-red`).

## Execution Steps
1.  **Modify `:root` in `styles.css`**: Update color variables.
2.  **Update General Typography**: Set body text and headers.
3.  **Update Components**: Cards, Buttons, Forms.
4.  **Verify Pages**: fast check on `chi-sono`, `materiali`, `contatti`.
