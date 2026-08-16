# Driving Ground Studio

Driving Ground Studio is a static HTML/CSS/JavaScript workspace for driving-ground demonstrations, group discussion, and independent study. It runs locally in a browser and can be hosted directly with GitHub Pages.

## Run Locally

Open `index.html` in a browser. For the most reliable local behavior, serve the folder with any simple static web server and open the resulting local URL.

## GitHub Pages

1. Push the repository to GitHub.
2. Open the repository's **Settings > Pages**.
3. Select the deployment branch and the repository root as the source.
4. Open the generated Pages URL.

There is no build step and no backend. Keep relative paths such as `maps/KDS-driving-ground.png` unchanged when deploying.

## Main Features

- Landing page with studio overview and operating guidance
- Default driving-ground map with map browsing and reset
- Edit, Drive, and Draw modes
- Dynamic vehicles with movement, rotation, resizing, wheels, lights, signals, reverse, and keyboard controls
- Pen, line, arrow, rectangle, ellipse, eraser, color, and stroke-width drawing tools
- Numbered yellow or white landmark poles that can be selected, moved, edited, and deleted
- Save/load scenario JSON and browser autosave
- Foldable side panels that allow the map workspace to expand

## Controls

- `W` / `ArrowUp`: throttle
- `S` / `ArrowDown`: brake
- `R`: reverse
- `Q`: left signal
- `E`: right signal
- `C`: clear signal
- `Tab`: cycle vehicles
- `Delete` / `Backspace`: delete the selected vehicle or landmark

## Default Map Note

The included `maps/KDS-driving-ground.png` was collected from publicly available imagery of Kounodai Driving School and is included in this app for learning and study purposes only. Anyone using or redistributing it should remain conscious of the applicable usage policy and verify permission or licensing before public use.

## Project Credit

Planned and developed by Faruk Ahmad, with help from Codex vibe coding.

Contact: `faruk.csebrur@gmail.com`
