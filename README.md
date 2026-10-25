# Maan Candles — React Storefront

A responsive, static React website for the Maan Candles product collection. Includes the 22 product photos, the latest product names/prices, search and category filters, WhatsApp order links for individual products, Instagram links, shipping information, and a downloadable PDF catalogue.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build for hosting

```bash
npm run build
npm run preview
```

The production website is generated in the `dist/` folder. Upload that folder to any static host.

## Host it online

### Vercel (easy option)
1. Unzip this project and push the `maan-candles-react-site` folder to a GitHub repository.
2. In Vercel, select **Add New → Project** and import that repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Click **Deploy**. The site is static; no backend or database is required.

### Netlify
1. Push the project to GitHub, or run `npm run build` on your computer.
2. Import the repository into Netlify with build command `npm run build` and publish directory `dist`.
3. If building locally, you can also drag and drop the generated `dist` folder into Netlify's manual deploy area.

### Other static hosts
Run `npm run build` and upload the contents of `dist/` to your static hosting provider. `vite.config.js` uses relative asset paths to also support deployment under a subpath.

## Product edits

Product names, prices, categories, and image filenames are defined in `src/products.js`. Product photographs live in `public/images/`. Replace an image by keeping the same filename, or update the matching `image` value in `src/products.js`.

Prices are displayed as provided. The two per-piece prices are shown as `₹49/Piece`.

## Contact links

The WhatsApp number and Instagram page are set in `src/App.jsx`:
- WhatsApp: `+91 6388184100`
- Instagram: `@maancandles.13`

Update the constants near the top of `src/App.jsx` if these change. WhatsApp ordering opens a pre-filled message; no online payment or cart backend is configured.

## Notes

- All product photos are included locally in `public/images/`, so the site doesn't depend on an external image service.
- The PDF catalogue is included at `public/maan-candles-catalogue.pdf` and linked from the site.
- The optional Google Fonts import improves typography when available; system fonts are used as fallbacks.
