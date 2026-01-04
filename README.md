# Germany Train Stations

This app fetches German train station data, renders stations on a Leaflet map, and supports city filtering with list-to-map interaction.

## Features

- Fetches stations from a hosted API and handles loading/error states
- Interactive Leaflet map with markers for each station
- City filter (dropdown) that updates both the list and the map
- Clicking a station in the list zooms to its marker and highlights it
- One meaningful UI test with React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to view the app.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel example)

1. Push this folder to a GitHub repo.
2. Create a new Vercel project and import the repo.
3. Use the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

Netlify works as well with the same build/output settings.

## Data Source

Stations API (GitHub Gist):
`https://gist.github.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c`
