# Driving Ground Discussion App

## Overview

This project is a browser-based driving ground study and discussion tool built with only HTML, CSS, and JavaScript so it can run locally in a browser or be hosted on GitHub Pages.

The app uses a driving ground image as the visual map background. The default map is:

- `maps/KDS-driving-ground.png`

Users can also load a different driving ground image and place vehicles on top of it for lesson planning, group discussion, route explanation, and maneuver study.

This is **not** a realistic physics simulator in the first version. The initial goal is a lightweight interactive board where people can:

- choose a map
- place one or more vehicles
- move and rotate vehicles on the map
- operate simple driving controls
- demonstrate driving situations visually

## Primary Use Cases

- Instructors explaining driving test routes
- Students discussing parking, turns, lane position, or hazard situations
- Group study sessions where multiple vehicle positions need to be shown
- Scenario planning such as overtaking, stopping, reversing, signaling, and parking approach discussion

## Product Direction

The first release should feel like an interactive whiteboard focused on driving grounds.

It should prioritize:

- simplicity
- fast loading
- zero backend
- easy sharing through static hosting
- clear visual control of multiple vehicles

It should avoid, in the first version:

- complex collision physics
- real-time multiplayer
- heavy animation systems
- map drawing/editing tools

## Core Experience

### 1. Map Layer

The map is a background image displayed inside a fixed stage area.

Initial behavior:

- default map loads automatically from `maps/KDS-driving-ground.png`
- user can switch to another map image using a file picker
- map scales to fit the viewport while preserving aspect ratio
- vehicle positions are stored relative to the map, not absolute screen pixels

Why relative positioning matters:

- vehicles stay in correct places if the browser window changes size
- the same scenario works both locally and on GitHub Pages

### 2. Vehicle Layer

Vehicles are draggable objects placed above the map.

Each vehicle should support:

- selecting a vehicle
- dragging to reposition
- rotating to set heading
- changing vehicle type
- duplicating
- deleting
- showing current state visually

Suggested initial vehicle types:

- compact car
- sedan
- SUV
- hatchback
- truck
- motorcycle

Each vehicle can have:

- unique ID
- type
- x position
- y position
- rotation angle
- speed state
- steering state
- brake state
- signal state
- label or name

### 3. Driving Controls

The first version should simulate driver intent, not full vehicle dynamics.

Suggested controls:

- steering wheel UI that can be dragged left or right with the mouse
- keyboard accelerator key
- keyboard brake key
- keyboard reverse control
- clickable signal icons for left, right, and hazard

Recommended initial key bindings:

- `ArrowUp` or `W`: accelerator
- `ArrowDown` or `S`: brake
- `R` or `X`: reverse
- `ArrowLeft` and `ArrowRight`: optional fine steering
- `Space`: emergency brake
- `Q`: left signal
- `E`: right signal
- `C`: reset signal
- `Tab`: cycle selected vehicle
- `Delete`: remove selected vehicle

Important note:

For the first version, acceleration, braking, and reverse can affect only a simple movement model for the selected vehicle. The app does not need realistic tire or steering geometry at the start.

### 4. Discussion Drawing Tools

The app should also support a free-form annotation layer for live discussion.

Initial drawing tools should include:

- pen
- straight line
- arrow
- rectangle
- circle / ellipse
- eraser
- color picker with multiple preset colors
- stroke width selection

Expected use cases:

- drawing intended routes
- marking stop points
- circling hazards or blind spots
- sketching temporary instructions during class or group review

The drawing layer should sit above the map and vehicle layer, with the option to switch between:

- `Drive/Edit Vehicles` mode
- `Draw/Annotate` mode

This avoids accidental vehicle dragging while drawing.

### 4. Scenario Demonstration

The selected vehicle should be operable while the other vehicles remain as static reference objects unless explicitly selected.

This supports:

- discussing one active car in relation to parked or moving reference cars
- marking exam route positions
- showing who yields, turns, stops, or signals

## UI Concept

### Layout

Recommended single-page layout:

- top bar
- left toolbar
- center map stage
- right inspector panel
- bottom compact control strip

### Top Bar

Contains:

- app title
- map selector / upload button
- add vehicle button
- reset view button
- save scenario button
- load scenario button

### Left Toolbar

Contains quick tools:

- select tool
- add vehicle
- duplicate vehicle
- delete vehicle
- rotate mode
- pan mode
- pen tool
- shape tools
- eraser

### Center Stage

The main map canvas area:

- background map image
- vehicle overlays
- drawing / annotation overlay

### Right Inspector

Shows selected vehicle details:

- vehicle type
- position
- heading
- label
- signal status
- brake status
- movement mode

### Bottom Controls

Contains:

- draggable steering wheel
- accelerator indicator
- brake indicator
- reverse indicator / toggle
- signal buttons
- color swatches when draw mode is active
- stroke size control when draw mode is active

## Interaction Model

### Vehicle Placement

- click `Add Vehicle`
- new vehicle appears at a default safe location
- drag it to the desired road position
- rotate with a handle or rotation slider

### Vehicle Selection

- clicking a vehicle selects it
- selected vehicle gets outline/highlight
- inspector panel updates to match selection

### Steering

The steering wheel widget is mouse-draggable.

Expected behavior:

- dragging left sets negative steering input
- dragging right sets positive steering input
- releasing can either return to center automatically or stay in place depending on selected mode

For version 1, automatic return-to-center is recommended because it is easier to understand and implement.

### Movement

Simple version 1 movement model:

- hold accelerator key to move forward in the current heading
- hold brake key to reduce movement speed
- hold or toggle reverse to move backward in the current heading
- steering input changes heading gradually while moving

Recommended behavior:

- reverse should be an explicit control, not merged with brake
- a vehicle can show a visible `R` state badge when reverse is active
- forward and reverse inputs should never be active at the same time

This creates enough realism for discussion without requiring a full car simulation engine.

### Signals and Status

Signal controls are clickable icons.

States:

- off
- left
- right
- hazard

The selected vehicle should visually reflect signal state, for example:

- small blinking corner indicators
- a status badge
- or a bright icon in the inspector

## Technical Plan

### Tech Stack

- `index.html`
- `styles.css`
- `app.js`

Optional structure if the project grows:

- `assets/vehicles/`
- `maps/`
- `data/`

### Rendering Approach

Recommended approach for the first build:

- render the map as an image inside a stage container
- render vehicles as absolutely positioned HTML elements over the map
- use CSS transforms for translation and rotation

Why this is a good first choice:

- simple to debug
- works well with pointer interactions
- easy to host statically
- no canvas redraw complexity at the beginning

Canvas can be considered later if performance or drawing tools become important.

### State Model

Recommended app state:

```js
{
  map: {
    name: "KDS driving ground",
    src: "maps/KDS-driving-ground.png",
    width: 944,
    height: 1112
  },
  vehicles: [
    {
      id: "veh-1",
      type: "sedan",
      x: 0.42,
      y: 0.68,
      angle: 90,
      speed: 0,
      steering: 0,
      brake: false,
      throttle: false,
      signal: "off",
      reverse: false,
      label: "Car A"
    }
  ],
  selectedVehicleId: "veh-1",
  ui: {
    controlMode: "drive",
    steeringReturn: true,
    drawTool: "pen",
    drawColor: "#ff3b30",
    drawWidth: 3
  },
  drawings: [
    {
      id: "draw-1",
      tool: "arrow",
      color: "#ff3b30",
      width: 3,
      points: [
        { x: 0.20, y: 0.30 },
        { x: 0.38, y: 0.44 }
      ]
    }
  }
}
```

Use normalized `x` and `y` values from `0` to `1` relative to the map size.

### Persistence

Initial save/load plan:

- save scenario JSON to local file
- load scenario JSON from local file
- optionally mirror latest state in `localStorage`

Saved scenario data should include:

- selected map
- all vehicles
- all drawing annotations
- current labels and control states

This keeps the app fully static with no server dependency.

## Suggested Feature Scope By Phase

### Phase 0: Product Brief

- define use case
- define controls
- define data model
- define layout

### Phase 1: Static Interactive Board

- load default map
- upload alternate map
- add/select/move/rotate/delete vehicles
- vehicle labels
- reverse-ready vehicle state model
- basic draw layer with pen, eraser, and color choice
- responsive layout

This is the best first implementation target.

### Phase 2: Driving Controls

- steering wheel widget
- keyboard accelerator and brake
- explicit reverse control
- selected vehicle movement
- signal icons and status
- simple shape tools for annotation
- draw/edit mode switching

### Phase 3: Scenario Tools

- save/load scenario
- duplicate vehicles
- reset positions
- route markers if still needed in addition to free drawing
- note markers
- undo/redo for drawing actions
- clear annotations button

### Phase 4: Polish

- better vehicle visuals
- blinking indicators
- touch support
- keyboard shortcut help overlay
- smoother animations
- annotation selection and editing

## Risks And Design Decisions

### 1. Map Alignment

If users upload arbitrary map images, vehicle size and orientation may not feel consistent.

Mitigation:

- allow manual vehicle scale setting per map
- keep map metadata extensible for future calibration

### 2. Physics Complexity

True vehicle dynamics can quickly become too complex for a simple static app.

Decision:

- keep the first version intentionally simplified
- represent discussion-grade motion, not simulation-grade physics

### 3. Input Conflicts

Dragging vehicles and driving them with keyboard/mouse could conflict.

Mitigation:

- separate `edit mode` and `drive mode`
- separate `draw mode` from vehicle manipulation
- only allow movement controls on the selected vehicle
- disable drawing input while actively driving

### 4. GitHub Pages Compatibility

The app must work as a static site.

Decision:

- no backend
- no build step required for version 1
- no external dependencies required

## Recommended Initial Deliverables

When implementation starts, the first coding milestone should produce:

- one HTML page
- one CSS file
- one JS file
- default map loaded from `maps/KDS-driving-ground.png`
- ability to add and manipulate vehicles on the map
- basic annotation tools with pen, eraser, and color presets

Then the next milestone should add:

- steering wheel drag control
- keyboard throttle/brake
- explicit reverse control
- clickable signal icons
- simple selected-vehicle motion
- line/arrow/shape drawing tools

## Open Questions For Later

- Should vehicle movement be free on the whole map, or lightly constrained to roads?
- Should the app support touch devices from the first build?
- Should annotations be tied to the map globally, or optionally attached to a vehicle?
- Should there be preset scenarios for lessons?
- Should multiple users eventually collaborate in real time?

## Recommended Build Strategy

Start with the app as a structured 2D teaching board, not a simulator.

That gives the fastest path to something useful:

1. map background
2. draggable vehicle tokens
3. annotation layer
4. selection and inspector
5. simple control widgets including reverse
6. scenario save/load

This path keeps the project lightweight, easy to maintain, and fully compatible with local browser use and GitHub Pages hosting.

## Assumptions Used In This Plan

- the default driving ground image is `maps/KDS-driving-ground.png`
- the app is intended for study/discussion more than game-like realism
- only HTML, CSS, and JavaScript should be used
- the current request is for planning and documentation only, not implementation
