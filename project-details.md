# Project Details

## Project Background

This project is a static browser-based driving ground study and discussion app built with plain `HTML`, `CSS`, and `JavaScript`.

The original goal was to create something that:

- runs locally in a browser without a backend
- can be hosted on GitHub Pages
- uses a real driving ground map image as the base
- allows vehicles to be placed, operated, and discussed visually
- supports drawing and discussion overlays
- supports numbered driving-ground landmarks similar to Japanese training grounds

The current default ground map is:

- `maps/KDS-driving-ground.png`

Map note: the default image was collected from publicly available imagery of Kounodai Driving School and is included in this app for learning and study purposes only. Anyone using or redistributing it should remain conscious of the applicable usage policy, and licensing or permission should be verified before public use.

Project credit: planned and developed by Faruk Ahmad, with help from Codex vibe coding. Contact: `faruk.csebrur@gmail.com`.

The app is intended more as a training board / discussion simulator than as a physics-accurate driving simulator.

## Current Files

- `index.html`: overall app layout and UI structure
- `styles.css`: full UI styling, stage styling, vehicle visuals, landmark visuals, and control appearance
- `app.js`: app state, rendering, interaction logic, movement model, drawing tools, saving/loading, landmarks
- `APP_CONCEPT_PLAN.md`: original planning and concept document
- `project-details.md`: this handoff / continuity document
- `maps/KDS-driving-ground.png`: default driving ground map

## Current Product State

The app is currently a usable single-page static board with:

- landing page with studio entry flow and map attribution note
- URL-based studio state at `#driving-ground-studio`, so refresh keeps the studio open
- map loading
- vehicle placement and manipulation
- drive mode
- draw mode
- landmark pole placement
- save/load scenario support

It is already usable for route explanation, scenario discussion, parking/turn study, and training-ground planning.

It still needs iterative tuning for realism, especially around driving feel and polish.

## Features Implemented

### 1. Map System

- Default map loads from `maps/KDS-driving-ground.png`
- User can upload another map image from local disk
- User can reset back to the default map
- Stage preserves the map aspect ratio
- Studio mode is addressable through the `#driving-ground-studio` URL hash

### 2. App Modes

Top mode switching is implemented:

- `Edit`
- `Drive`
- `Draw`

Current behavior:

- `Edit` is for moving and rotating vehicles and moving landmarks
- `Drive` is for operating the selected vehicle
- `Draw` is for annotation tools

### 3. Vehicle System

Implemented:

- add vehicle
- duplicate vehicle
- delete vehicle
- select vehicle
- drag vehicle
- rotate vehicle with rotate handle
- single-letter labels like `A`, `B`, `C`
- different vehicle types:
  - compact
  - sedan
  - SUV
  - hatchback
  - truck
- motorcycle
- proportional vehicle size control from the selected-vehicle inspector

Vehicle visuals are generated dynamically in JS using inline SVG plus wheel/light overlays.

### 4. Driving Controls

Implemented:

- throttle
- brake
- reverse toggle
- steering wheel UI
- keyboard driving shortcuts
- left signal
- right signal
- hazard signal
- signal off

Current keyboard bindings:

- `W` / `ArrowUp`: throttle
- `S` / `ArrowDown`: brake
- `R`: reverse
- `Q`: left signal
- `E`: right signal
- `C`: clear signal
- `Tab`: cycle vehicles
- `Delete` / `Backspace`: delete selected item

### 5. Steering / Movement Model

Current implementation uses a simplified bicycle-like handling model.

Implemented:

- per-vehicle handling values
- smoothed steering input
- yaw velocity / heading change
- forward and reverse movement
- wheel turning visuals

Current note:

- driving feel is improved from the earliest version, but still considered an active tuning area

### 6. Vehicle Lights

Text signal badges were removed and replaced with dynamic light objects.

Implemented:

- front/rear light objects
- left-side blinking for left signal
- right-side blinking for right signal
- all-side blinking for hazard
- reverse state badge

### 7. Drawing Tools

Implemented:

- pen
- line
- arrow
- rectangle
- ellipse
- eraser
- color selection
- stroke width selection
- undo last drawing
- clear all drawings

Drawing is rendered on an SVG overlay layer.

### 8. Landmark Pole System

Implemented:

- new left-panel tab for landmarks
- add numbered pole
- delete selected pole
- pole selection
- pole drag/move in `Edit` mode
- auto-numbering
- manual number input
- yellow or white circular plate color
- selected landmark editor

Landmarks are intended to look like realistic numbered marker poles seen on driving grounds.

### 9. Left Panel Tabs

The left panel is now organized into tabs:

- `Vehicles`
- `Drawing`
- `Landmarks`

This makes the tool area more manageable and closer to an operations panel rather than a long stacked form.

### 10. Workspace Layout

- landing page with background, use cases, operation guide, about, contact, and map attribution
- short loading transition when entering the studio
- foldable left tools panel and right vehicle console
- map grid expands into the space released by folded desktop panels

### 11. Save / Load

Implemented:

- save scenario to JSON
- load scenario from JSON
- autosave to `localStorage`

Saved scenario data currently includes:

- map
- vehicles
- landmarks
- drawings
- counters

## Current State Model

The main app state is kept in one global `state` object in `app.js`.

High-level shape:

```js
state = {
  map,
  mode,
  panelTab,
  vehicles,
  landmarks,
  selectedVehicleId,
  selectedLandmarkId,
  drawings,
  ui,
  counters
}
```

Important sections:

- `state.mode`: current interaction mode
- `state.panelTab`: active left-panel tab
- `state.vehicles`: all vehicle entities
- `state.landmarks`: all landmark poles
- `state.drawings`: drawing overlay data
- `state.ui`: transient UI state like steering, selected draw tool, live drag state
- `state.counters`: running counters for vehicle/drawing/landmark IDs and numbering

## Design Pattern Used

The app uses a lightweight manual state/render architecture.

### Primary Pattern

Pattern in use:

- centralized mutable state
- explicit render functions
- event-driven updates
- DOM regeneration for dynamic layers

This is not using React/Vue/Svelte or a build step. It is a handcrafted static app architecture.

### Rendering Approach

The app is layered visually as:

1. map image
2. drawing SVG layer
3. landmark layer
4. vehicle layer

This layered approach makes interactions easier to reason about.

### Rendering Strategy

Different parts of the UI are rendered by dedicated functions, for example:

- `renderDrawings()`
- `renderLandmarks()`
- `renderVehicles()`
- `renderLandmarkEditor()`
- `renderInspector()`
- `updateStatus()`
- `updateControls()`
- `render()`

This is effectively a manual component-style pattern without a framework.

### Interaction Pattern

Interactions are handled by:

- DOM event listeners registered in `bindEvents()`
- pointer handlers for dragging and steering
- per-frame updates in `animate()`

This means the app uses:

- event-driven UI updates for clicks/input changes
- frame-loop updates for motion and steering behavior

### Data Modeling Pattern

Each interactive object is stored as plain JS data:

- vehicles are plain objects
- landmarks are plain objects
- drawings are plain objects

This makes serialization to JSON straightforward.

## Important Core Functions

These are the main functions worth knowing when resuming work:

### Vehicle / Landmark Creation

- `createVehicle()`
- `createLandmark()`
- `addVehicle()`
- `addLandmark()`

### Selection

- `selectVehicle()`
- `selectLandmark()`
- `getSelectedVehicle()`
- `getSelectedLandmark()`

### Rendering

- `render()`
- `renderVehicles()`
- `renderLandmarks()`
- `renderDrawings()`
- `renderInspector()`
- `renderLandmarkEditor()`
- `updateControls()`
- `updateStatus()`

### Motion / Driving

- `animate()`
- `getHandling()`
- `handleSteeringPointerDown()`
- `handleSteeringPointerMove()`
- `handleSteeringPointerUp()`

### Dragging

- `startDrag()`
- `updateDrag()`
- `stopDrag()`
- `handleStagePointerDown()`
- `handleStagePointerMove()`
- `handleStagePointerUp()`

### Persistence

- `saveScenario()`
- `loadScenarioObject()`
- `hydrateAutosave()`

## UI Structure

### Top Bar

Contains:

- app title
- mode buttons
- map upload
- default map reset
- save scenario
- load scenario

### Left Panel

Tabbed tool area:

- vehicles tab
- drawing tab
- landmarks tab

Also includes board notes.

### Center Board

Contains:

- current map status header
- selection status pills
- map stage

### Right Panel

Contains:

- selected vehicle inspector
- driving controls
- signal buttons
- steering wheel

## Visual Design Direction

Current visual direction:

- warm neutral panel colors
- glassy layered panels
- pill-style buttons and pills
- realistic top-down training board feel
- simple but stylized dynamic vehicle bodies

The UI is already cleaner than the first build, but still open to refinement.

## Known Limitations / Active Improvement Areas

### 1. Driving Feel

Still needs further tuning:

- steering smoothness
- turning realism
- acceleration / braking response
- reverse feel

### 2. Vehicle Realism

Current vehicles are dynamic inline SVG shapes, which is the right technical choice for live wheels/lights, but can still be improved visually.

Possible future work:

- richer body silhouettes
- subtle shadows
- more realistic windows/lights
- better truck and motorcycle detail

### 3. Landmark Realism

Landmark poles are implemented and usable, but could still be improved with:

- more authentic pole proportions
- optional Japanese text/marker presets
- preset placement templates

### 4. Stage Tools

Potential future additions:

- route arrows with editable handles
- text note boxes
- undo/redo stack beyond drawing undo
- multi-select
- snapping

### 5. Inspector Coverage

Right now the main inspector is still vehicle-focused.

Potential future work:

- unified inspector for both vehicles and landmarks
- better mode-aware control visibility

## Current UX Rules

- vehicles and landmarks are movable in `Edit`
- only selected vehicle is actively drivable
- drawing tools are active in `Draw`
- landmarks are not driven; they are reference objects
- scenario data is static and local-only

## How To Resume Later

When resuming work, the safest entry points are:

1. Read `project-details.md`
2. Open `index.html`, `styles.css`, and `app.js`
3. Start from `state`, `bindEvents()`, and `render()`
4. If working on driving feel, start from `animate()` and `VEHICLE_HANDLING`
5. If working on landmarks, start from `createLandmark()`, `renderLandmarks()`, and stage drag handlers
6. If working on UI polish, start from left-panel tabs and button styles in `styles.css`

## Suggested Next Work Items

Recommended next priorities:

- continue tuning steering and driving realism
- improve landmark realism and presets
- refine visual polish of vehicles and board tools
- add broader undo/redo support
- make the inspector more context-aware
- test more thoroughly in a real browser session

## Verification Notes

Latest known static verification:

- `node --check app.js` passed

Limit:

- no full live browser interaction test was performed inside the sandbox, so real interaction still needs manual review in the browser
