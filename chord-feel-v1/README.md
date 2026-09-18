# Chord Feel — V1

A zero-dependency, browser-based chord progression generator built for songwriting. It generates progressions from **key + mode + feel + adventure**, rather than choosing chords independently at random.

## Included in V1

- 12 keys
- Major and minor modes
- 6 feel presets: Dreamy, Melancholic, Dark, Hopeful, Nostalgic, Tense
- 4 / 8 / 16 chord lengths
- Independent Adventure control
- Feel-specific scale-degree preferences
- Feel-specific chord-to-chord transition weights
- Maj7, m7, add9, 9ths, sus chords, dominant 7ths, diminished chords
- Modal interchange / borrowed chords with visual labels
- Roman-numeral analysis
- Lock individual chords and generate variations around them
- Browser playback using the native Web Audio API
- Adjustable BPM
- Copy progression
- Local browser persistence
- Responsive phone/tablet/desktop layout
- Automated harmony-engine tests
- GitHub Pages deployment workflow

## Why V1 has no framework dependencies

The site is plain HTML/CSS/JavaScript modules. This keeps GitHub Pages deployment completely free and removes a package-install/build step. The harmony engine is still cleanly separated from the interface, so React or another UI layer can be introduced later without rewriting the music logic.

## Run locally

From the project folder:

```bash
npm run serve
```

Then visit:

```text
http://localhost:4173
```

You can also serve the `site/` folder with any static web server.

## Run tests

Node.js 22+ is recommended.

```bash
npm test
```

The tests verify key/mode support, progression shape, playable chord data, borrowed harmony, flat-key note spelling, validation, and locked-chord preservation during variation.

## Deploy to GitHub Pages for free

1. Create a **public** GitHub repository.
2. Put this project in the repository and push it to the `main` branch.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. The included workflow tests the engine and publishes the `site/` folder automatically.

No API keys, database, server, or paid hosting are required.

## Project layout

```text
site/
  index.html
  styles.css
  src/
    app.js             UI, local storage, Web Audio playback
    engine.js          Harmony generation logic
    feel-presets.js    Feel definitions and weights
tests/
  engine.test.js
.github/workflows/
  deploy.yml
```

## Feel engine

Each feel defines six conceptual dimensions:

- brightness
- tension
- resolution
- complexity
- adventure tendency
- openness

It also supplies explicit weights for scale degrees, chord colors, borrowed chords, chord-to-chord transitions, voice-leading preference, and cadence strength. The user's Adventure slider is applied separately so the same emotional feel can range from safe to harmonically unusual.

## Good next additions

- Indie and Shoegaze feel presets
- chord substitution drawer
- drag-and-drop chord reordering
- voicing/inversion engine
- guitar and piano views
- MIDI export
- loop/rhythm patterns
- progression history / undo
- shareable URL encoding
- optional cloud sync later
