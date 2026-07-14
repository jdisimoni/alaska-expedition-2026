# Jay's Alaska Adventure — Premium GitHub Pages Site

This package replaces the old travel site with a premium, mobile-friendly experience.

## Before uploading

Delete the old site files from the repository root:

- `camera.html`
- `itinerary.html`
- `packing.html`
- `wildlife.html`
- `styles.css`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`

Keep GitHub configuration files if present.

## Upload these files to the repository root

- `index.html`
- `README.md`
- `.nojekyll`
- `assets/`
- `daily-updates/`

The repository root must show `index.html` directly. Do not upload the enclosing folder.

## GitHub Pages setting

Open **Settings → Pages**:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

## Updating during the trip

Most updates only require editing:

`assets/data.js`

### Trip stats

Update:

```js
stats: {
  photos: 245,
  wildlifeSightings: 3
}
```

### Force the displayed trip day

Normally the site calculates the day automatically. To override it:

```js
currentDayOverride: 3
```

Set it back to `null` for automatic behavior.

### Publish a journal card

Change a card from:

```js
status: "pending"
```

to:

```js
status: "published"
```

Then replace its title, copy, and tags.

### Mark wildlife as spotted

Change:

```js
seen: false
```

to:

```js
seen: true
```

## Add real photos

Put optimized JPG or WebP files in:

`assets/photos/`

Then replace a placeholder art block in `index.html` with:

```html
<img src="assets/photos/your-photo.jpg" alt="Description of the photo">
```

Add this to `assets/styles.css` if needed:

```css
.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Important cache fix

The old site used `sw.js`, a service worker. Delete it from GitHub.

After publishing, open the site in an incognito window. If the old site still appears:

1. Open Chrome DevTools
2. Go to **Application**
3. Select **Service Workers**
4. Click **Unregister**
5. Select **Storage**
6. Click **Clear site data**


## The easiest iPhone workflow

You do not need to edit the website during the trip.

Each evening, send ChatGPT:

1. Your favorite photos
2. The day's destination
3. Three highlights
4. Favorite meal
5. Wildlife sightings
6. Funniest or most unexpected moment
7. Approximate photo/video count
8. Anything you want coworkers to know

ChatGPT prepares the polished journal entry, captions, featured image, updated route, wildlife tracker, statistics, and replacement site files.

## Share with coworkers and leadership

The site includes a native Share button. On iPhone, it opens the iOS share sheet so the site can be shared through Messages, Mail, Teams, or other installed apps.
