# Weather Forecast (WeatherAPI) — Responsive App

Simple responsive weather forecast UI that uses WeatherAPI (https://www.weatherapi.com/).

## Features
- Current weather and 5-day forecast
- Unit toggle (°C / °F)
- Save & reuse recent searches (localStorage)
- Use browser geolocation for quick local weather
- Basic alerts display (if WeatherAPI returns alerts)
- Rain animation when precipitation is detected
- Accessible controls and progressive enhancement

## Files
- `index.html` — app shell and layout
- `styles.css` — styling and rain animation
- `script.js` — application logic and WeatherAPI requests
- `README.md` — this document

## Getting started
1. Clone or download this repo.
2. Add your WeatherAPI key to `script.js`:
   ```js
   const API_KEY = "YOUR_KEY_HERE";




---

# 2) Commit log

Below is a suggested commit history. Each entry shows a commit message and which files were changed. You can create these commits locally with `git commit` messages exactly as shown.

1. `chore: repo init and add basic index.html`  
   - Files: `index.html`

2. `style: extract styles to styles.css and add base glass styling`  
   - Files: `styles.css`, `index.html` (link update)

3. `feat: add script.js skeleton and wire up script to HTML`  
   - Files: `script.js`, `index.html`

4. `feat: implement basic fetch to WeatherAPI and display placeholders`  
   - Files: `script.js`

5. `fix: handle missing API key error with user-friendly message`  
   - Files: `script.js`

6. `feat: implement search input, button, and Enter key handler`  
   - Files: `index.html`, `script.js`

7. `feat: add geolocation support (Use my location)`  
   - Files: `index.html`, `script.js`

8. `feat: process API response and render current weather card`  
   - Files: `script.js`

9. `feat: implement 5-day forecast rendering`  
   - Files: `script.js`

10. `style: responsive layout tweaks and mobile icon hiding`  
    - Files: `styles.css`

11. `feat: add unit toggle (°C / °F) with correct conversions`  
    - Files: `script.js`

12. `feat: add recent searches stored in localStorage and dropdown`  
    - Files: `script.js`, `index.html`

13. `fix: sanitize and dedupe recent searches; limit history length`  
    - Files: `script.js`

14. `perf: avoid re-creating rain DOM nodes on every toggle`  
    - Files: `script.js`, `styles.css`

15. `feat: add alerts area to show WeatherAPI alerts`  
    - Files: `index.html`, `script.js`

16. `fix: improved error parsing for non-200 responses`  
    - Files: `script.js`

17. `style: improve glass contrast on dark/rain theme`  
    - Files: `styles.css`

18. `docs: add README with usage notes and file overview`  
    - Files: `README.md`

19. `chore: add footer note about API key location`  
    - Files: `index.html`

20. `test: handle forecast missing astro data gracefully`  
    - Files: `script.js`

21. `fix: accessibility improvements (aria attributes, roles)`  
    - Files: `index.html`, `script.js`

22. `style: clamp forecast card widths and add overflow-x behavior`  
    - Files: `styles.css`

23. `chore: update comments and add console redaction for API key`  
    - Files: `script.js`

24. `docs: README updates — tips about rate limits and server proxy`  
    - Files: `README.md`

---

# 3) How to apply these commits locally (suggested workflow)

If you want to apply the commits above in one local repo, do this:

```bash
mkdir weather-forecast && cd weather-forecast
git init
# create files index.html, styles.css, script.js, README.md using the content above
git add index.html
git commit -m "chore: repo init and add basic index.html"

git add styles.css index.html
git commit -m "style: extract styles to styles.css and add base glass styling"

git add script.js index.html
git commit -m "feat: add script.js skeleton and wire up script to HTML"

# ...repeat add/commit for each commit in the list above, changing the files parameter to match














