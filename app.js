const DEFAULT_MAP = {
  name: "KDS Driving Ground",
  src: "maps/KDS-driving-ground.png",
  width: 944,
  height: 1112,
};

const DRAW_COLORS = [
  "#ff5f57",
  "#f39c12",
  "#f4d03f",
  "#1e8449",
  "#148f77",
  "#2471a3",
  "#7d3c98",
  "#202124",
  "#ffffff",
];

const VEHICLE_TYPES = {
  compact: true,
  sedan: true,
  suv: true,
  hatchback: true,
  truck: true,
  motorcycle: true,
};

function getNextVehicleLabel(index = state.counters.vehicle - 1) {
  return String.fromCharCode(65 + (index % 26));
}

function getVehicleBodyMarkup(vehicle) {
  const stroke = "rgba(26, 24, 22, 0.86)";

  if (vehicle.type === "motorcycle") {
    return `
      <svg class="vehicle-icon" viewBox="0 0 64 144" aria-hidden="true">
        <defs>
          <linearGradient id="bikeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5f6f86" />
            <stop offset="100%" stop-color="#2c3948" />
          </linearGradient>
        </defs>
        <path d="M32 18 C43 28, 44 44, 32 58 C20 44, 21 28, 32 18 Z" fill="url(#bikeBody)" stroke="${stroke}" stroke-width="3" />
        <path d="M32 60 C40 71, 40 92, 32 108 C24 92, 24 71, 32 60 Z" fill="#8fa7c2" stroke="${stroke}" stroke-width="3" />
        <circle cx="32" cy="34" r="7" fill="#dfe8f5" />
        <rect x="25" y="74" width="14" height="22" rx="7" fill="#eef3fb" stroke="rgba(40, 52, 67, 0.2)" stroke-width="2" />
      </svg>
    `;
  }

  const bodyGradients = {
    compact: ["#79b9c4", "#2e7180"],
    sedan: ["#8abbd0", "#3c7590"],
    suv: ["#e4b66f", "#a86439"],
    hatchback: ["#d98b86", "#91434b"],
    truck: ["#afc5d4", "#536f82"],
  };
  const [top, bottom] = bodyGradients[vehicle.type] || bodyGradients.sedan;

  const pathByType = {
    compact: "M18 16 Q18 8 26 8 H38 Q46 8 46 16 V27 Q46 33 43 39 L41 108 Q41 118 33 122 H31 Q23 118 23 108 L21 39 Q18 33 18 27 Z",
    sedan: "M17 14 Q17 5 26 5 H38 Q47 5 47 14 V28 Q47 35 43 42 L41 111 Q41 122 33 126 H31 Q23 122 23 111 L21 42 Q17 35 17 28 Z",
    suv: "M15 15 Q15 5 24 5 H40 Q49 5 49 15 V31 Q49 38 45 44 L43 112 Q43 124 34 128 H30 Q21 124 21 112 L19 44 Q15 38 15 31 Z",
    hatchback: "M16 18 Q16 8 25 8 H39 Q48 8 48 18 V30 Q48 37 44 45 L42 108 Q42 120 33 124 H31 Q22 120 22 108 L20 45 Q16 37 16 30 Z",
    truck: "M14 12 Q14 4 24 4 H40 Q50 4 50 12 V33 Q50 40 45 46 L43 112 Q43 126 35 130 H29 Q21 126 21 112 L19 46 Q14 40 14 33 Z",
  };
  const cabinByType = {
    compact: "M24 22 Q24 16 29 16 H35 Q40 16 40 22 V47 Q40 52 37 57 L35 93 Q35 98 32 102 Q29 98 29 93 L27 57 Q24 52 24 47 Z",
    sedan: "M23 22 Q23 15 29 15 H35 Q41 15 41 22 V51 Q41 56 37 62 L35 95 Q35 101 32 105 Q29 101 29 95 L27 62 Q23 56 23 51 Z",
    suv: "M22 23 Q22 16 28 16 H36 Q42 16 42 23 V56 Q42 62 38 66 L36 96 Q36 102 32 106 Q28 102 28 96 L26 66 Q22 62 22 56 Z",
    hatchback: "M23 24 Q23 17 28 17 H36 Q41 17 41 24 V49 Q41 55 36 61 L35 92 Q35 98 32 102 Q29 98 29 92 L28 61 Q23 55 23 49 Z",
    truck: "M21 20 Q21 13 28 13 H36 Q43 13 43 20 V48 Q43 55 39 61 L37 90 Q37 97 32 102 Q27 97 27 90 L25 61 Q21 55 21 48 Z",
  };

  return `
    <svg class="vehicle-icon" viewBox="0 0 64 132" aria-hidden="true">
      <defs>
        <linearGradient id="body-${vehicle.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${top}" />
          <stop offset="100%" stop-color="${bottom}" />
        </linearGradient>
      </defs>
      <path d="${pathByType[vehicle.type] || pathByType.sedan}" fill="url(#body-${vehicle.id})" stroke="${stroke}" stroke-width="3.5" />
      <path d="${cabinByType[vehicle.type] || cabinByType.sedan}" fill="#eef3fb" stroke="rgba(40, 52, 67, 0.2)" stroke-width="2" />
      <path d="M25 70 H39" stroke="rgba(255,255,255,0.36)" stroke-width="4" stroke-linecap="round" />
      <path d="M24 26 H40" stroke="rgba(26, 24, 22, 0.12)" stroke-width="2" />
    </svg>
  `;
}

function getSignalLightClass(signal, position) {
  const isLeft = position.includes("left");
  const isRight = position.includes("right");

  if (signal === "hazard") {
    return "signal-on blinking";
  }
  if (signal === "left" && isLeft) {
    return "signal-on blinking";
  }
  if (signal === "right" && isRight) {
    return "signal-on blinking";
  }
  return "";
}

function getWheelMarkup(vehicle, steeringAngle) {
  if (vehicle.type === "motorcycle") {
    return `
      <div class="vehicle-wheel bike-wheel bike-front" style="--wheel-angle:${steeringAngle}deg;"></div>
      <div class="vehicle-wheel bike-wheel bike-rear"></div>
    `;
  }

  return `
    <div class="vehicle-wheel wheel-front-left" style="--wheel-angle:${steeringAngle}deg;"></div>
    <div class="vehicle-wheel wheel-front-right" style="--wheel-angle:${steeringAngle}deg;"></div>
    <div class="vehicle-wheel wheel-rear-left"></div>
    <div class="vehicle-wheel wheel-rear-right"></div>
  `;
}

function getLightMarkup(vehicle) {
  if (vehicle.type === "motorcycle") {
    return `
      <div class="vehicle-light bike-light front-light ${getSignalLightClass(vehicle.signal, "front-left")}"></div>
      <div class="vehicle-light bike-light rear-light ${getSignalLightClass(vehicle.signal, "rear-left")}"></div>
    `;
  }

  return `
    <div class="vehicle-light front-left-light ${getSignalLightClass(vehicle.signal, "front-left")}"></div>
    <div class="vehicle-light front-right-light ${getSignalLightClass(vehicle.signal, "front-right")}"></div>
    <div class="vehicle-light rear-left-light ${getSignalLightClass(vehicle.signal, "rear-left")}"></div>
    <div class="vehicle-light rear-right-light ${getSignalLightClass(vehicle.signal, "rear-right")}"></div>
  `;
}

const elements = {
  landingPage: document.getElementById("landingPage"),
  landingOpenStudio: document.getElementById("landingOpenStudio"),
  heroOpenStudio: document.getElementById("heroOpenStudio"),
  backToLanding: document.getElementById("backToLanding"),
  studioLoading: document.getElementById("studioLoading"),
  workspace: document.querySelector(".workspace"),
  toolbarPanel: document.querySelector(".toolbar-panel"),
  inspectorPanel: document.querySelector(".inspector-panel"),
  toggleToolbar: document.getElementById("toggleToolbar"),
  toggleInspector: document.getElementById("toggleInspector"),
  stage: document.getElementById("stage"),
  mapImage: document.getElementById("mapImage"),
  drawingLayer: document.getElementById("drawingLayer"),
  landmarkLayer: document.getElementById("landmarkLayer"),
  vehicleLayer: document.getElementById("vehicleLayer"),
  mapName: document.getElementById("mapName"),
  modeStatus: document.getElementById("modeStatus"),
  selectionStatus: document.getElementById("selectionStatus"),
  selectedVehicleStatus: document.getElementById("selectedVehicleStatus"),
  modeButtons: document.querySelectorAll(".mode-button"),
  panelTabButtons: document.querySelectorAll(".panel-tab-button"),
  panelTabPanels: document.querySelectorAll(".tab-panel"),
  drawToolButtons: document.querySelectorAll("[data-draw-tool]"),
  signalButtons: document.querySelectorAll(".signal-button"),
  landmarkColorButtons: document.querySelectorAll(".landmark-color-button"),
  newVehicleType: document.getElementById("newVehicleType"),
  addVehicle: document.getElementById("addVehicle"),
  duplicateVehicle: document.getElementById("duplicateVehicle"),
  deleteVehicle: document.getElementById("deleteVehicle"),
  addLandmark: document.getElementById("addLandmark"),
  deleteLandmark: document.getElementById("deleteLandmark"),
  landmarkNumberInput: document.getElementById("landmarkNumberInput"),
  landmarkEditor: document.getElementById("landmarkEditor"),
  vehicleInspector: document.getElementById("vehicleInspector"),
  reverseToggle: document.getElementById("reverseToggle"),
  throttleButton: document.getElementById("throttleButton"),
  brakeButton: document.getElementById("brakeButton"),
  steeringWheel: document.getElementById("steeringWheel"),
  steeringFace: document.getElementById("steeringFace"),
  steeringReadout: document.getElementById("steeringReadout"),
  colorSwatches: document.getElementById("colorSwatches"),
  strokeWidth: document.getElementById("strokeWidth"),
  clearDrawings: document.getElementById("clearDrawings"),
  undoDrawing: document.getElementById("undoDrawing"),
  mapUpload: document.getElementById("mapUpload"),
  resetDefaultMap: document.getElementById("resetDefaultMap"),
  saveScenario: document.getElementById("saveScenario"),
  loadScenario: document.getElementById("loadScenario"),
};

const state = {
  map: { ...DEFAULT_MAP },
  mode: "edit",
  panelTab: "vehicles",
  vehicles: [],
  landmarks: [],
  selectedVehicleId: null,
  selectedLandmarkId: null,
  drawings: [],
  ui: {
    drawTool: "pen",
    drawColor: DRAW_COLORS[0],
    drawWidth: 3,
    landmarkColor: "yellow",
    steering: 0,
    steeringInput: 0,
    targetSteering: 0,
    keys: {
      throttle: false,
      brake: false,
      steerLeft: false,
      steerRight: false,
    },
    pointerThrottle: false,
    pointerBrake: false,
    pointerThrottleId: null,
    pointerBrakeId: null,
    drawingSession: null,
    dragSession: null,
    steeringPointerId: null,
  },
  counters: {
    vehicle: 1,
    drawing: 1,
    landmark: 1,
  },
};

const svgNs = "http://www.w3.org/2000/svg";
let animationFrame = null;
let lastFrameTime = performance.now();
let studioOpenTimer = null;

const VEHICLE_HANDLING = {
  compact: { maxSpeed: 0.19, acceleration: 0.17, coast: 1.9, brake: 5.8, wheelBase: 0.06, steerAngle: 34 },
  sedan: { maxSpeed: 0.175, acceleration: 0.155, coast: 1.8, brake: 5.6, wheelBase: 0.068, steerAngle: 31 },
  suv: { maxSpeed: 0.165, acceleration: 0.145, coast: 1.75, brake: 5.3, wheelBase: 0.072, steerAngle: 29 },
  hatchback: { maxSpeed: 0.18, acceleration: 0.16, coast: 1.85, brake: 5.7, wheelBase: 0.064, steerAngle: 33 },
  truck: { maxSpeed: 0.145, acceleration: 0.12, coast: 1.55, brake: 4.8, wheelBase: 0.082, steerAngle: 25 },
  motorcycle: { maxSpeed: 0.205, acceleration: 0.18, coast: 2.1, brake: 6.2, wheelBase: 0.056, steerAngle: 36 },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

function getHandling(vehicle) {
  return VEHICLE_HANDLING[vehicle.type] || VEHICLE_HANDLING.sedan;
}

function getStageMetrics() {
  const rect = elements.stage.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    left: rect.left,
    top: rect.top,
  };
}

function getPointerNormalized(clientX, clientY) {
  const { width, height, left, top } = getStageMetrics();
  return {
    x: clamp((clientX - left) / width, 0, 1),
    y: clamp((clientY - top) / height, 0, 1),
  };
}

function createVehicle(type = "sedan", overrides = {}) {
  const id = `veh-${state.counters.vehicle++}`;
  const index = state.vehicles.length;
  return {
    id,
    type,
    x: overrides.x ?? clamp(0.5 + ((index % 3) - 1) * 0.08, 0.08, 0.92),
    y: overrides.y ?? clamp(0.5 + Math.floor(index / 3) * 0.08, 0.08, 0.92),
    angle: overrides.angle ?? 0,
    scale: clamp(Number(overrides.scale ?? 1) || 1, 0.55, 1.5),
    signal: overrides.signal ?? "off",
    reverse: overrides.reverse ?? false,
    label: overrides.label ?? getNextVehicleLabel(index),
    speed: overrides.speed ?? 0,
    yawVelocity: overrides.yawVelocity ?? 0,
  };
}

function getNextLandmarkNumber() {
  const highest = state.landmarks.reduce((max, landmark) => Math.max(max, landmark.number), 0);
  state.counters.landmark = Math.max(state.counters.landmark, highest + 1);
  return state.counters.landmark++;
}

function createLandmark(overrides = {}) {
  const manualNumber = Number(overrides.number);
  const number = Number.isFinite(manualNumber) && manualNumber > 0 ? Math.round(manualNumber) : getNextLandmarkNumber();
  state.counters.landmark = Math.max(state.counters.landmark, number + 1);
  return {
    id: overrides.id || `landmark-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x: overrides.x ?? 0.22,
    y: overrides.y ?? 0.22,
    number,
    color: overrides.color || state.ui.landmarkColor,
  };
}

function getSelectedVehicle() {
  return state.vehicles.find((vehicle) => vehicle.id === state.selectedVehicleId) || null;
}

function getSelectedLandmark() {
  return state.landmarks.find((landmark) => landmark.id === state.selectedLandmarkId) || null;
}

function selectVehicle(vehicleId) {
  state.selectedVehicleId = vehicleId;
  state.selectedLandmarkId = null;
  state.panelTab = "vehicles";
  render();
}

function selectLandmark(landmarkId) {
  state.selectedLandmarkId = landmarkId;
  state.selectedVehicleId = null;
  state.panelTab = "landmarks";
  render();
}

function setPanelTab(tab) {
  state.panelTab = tab;
  render();
}

function addVehicle(type = elements.newVehicleType.value) {
  const vehicle = createVehicle(type);
  state.vehicles.push(vehicle);
  selectVehicle(vehicle.id);
}

function duplicateVehicle() {
  const vehicle = getSelectedVehicle();
  if (!vehicle) {
    return;
  }

  const clone = createVehicle(vehicle.type, {
    x: clamp(vehicle.x + 0.05, 0.05, 0.95),
    y: clamp(vehicle.y + 0.05, 0.05, 0.95),
    angle: vehicle.angle,
    signal: vehicle.signal,
    reverse: vehicle.reverse,
    scale: vehicle.scale,
  });
  state.vehicles.push(clone);
  selectVehicle(clone.id);
}

function addLandmark() {
  const value = elements.landmarkNumberInput.value;
  const landmark = createLandmark({
    number: value ? Number(value) : undefined,
    color: state.ui.landmarkColor,
    x: 0.18 + (state.landmarks.length % 5) * 0.08,
    y: 0.18 + Math.floor(state.landmarks.length / 5) * 0.1,
  });
  state.landmarks.push(landmark);
  state.selectedLandmarkId = landmark.id;
  elements.landmarkNumberInput.value = "";
  render();
}

function deleteSelectedLandmark() {
  if (!state.selectedLandmarkId) {
    return;
  }
  state.landmarks = state.landmarks.filter(landmark => landmark.id !== state.selectedLandmarkId);
  state.selectedLandmarkId = state.landmarks[0]?.id ?? null;
  render();
}

function deleteVehicle() {
  if (!state.selectedVehicleId) {
    return;
  }

  state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== state.selectedVehicleId);
  state.selectedVehicleId = state.vehicles[0]?.id ?? null;
  render();
}

function setMode(mode) {
  resetTransientInteractionState();
  state.mode = mode;
  if (mode === "draw") {
    state.panelTab = "drawing";
  } else if (mode === "drive" || mode === "edit") {
    state.panelTab = "vehicles";
  }
  if (mode === "drive") {
    state.selectedLandmarkId = null;
    if (!state.selectedVehicleId && state.vehicles.length) {
      state.selectedVehicleId = state.vehicles[0].id;
    }
    document.activeElement?.blur();
  }
  render();
  if (mode === "drive") {
    elements.stage.focus({ preventScroll: true });
  }
}

function resetTransientInteractionState() {
  const dragPointerId = state.ui.dragSession?.pointerId;
  const steeringPointerId = state.ui.steeringPointerId;
  const throttlePointerId = state.ui.pointerThrottleId;
  const brakePointerId = state.ui.pointerBrakeId;

  if (dragPointerId !== undefined && elements.stage.hasPointerCapture(dragPointerId)) {
    elements.stage.releasePointerCapture(dragPointerId);
  }
  if (steeringPointerId !== null && elements.steeringWheel.hasPointerCapture(steeringPointerId)) {
    elements.steeringWheel.releasePointerCapture(steeringPointerId);
  }
  if (throttlePointerId !== null && elements.throttleButton.hasPointerCapture(throttlePointerId)) {
    elements.throttleButton.releasePointerCapture(throttlePointerId);
  }
  if (brakePointerId !== null && elements.brakeButton.hasPointerCapture(brakePointerId)) {
    elements.brakeButton.releasePointerCapture(brakePointerId);
  }

  state.ui.drawingSession = null;
  state.ui.dragSession = null;
  state.ui.steeringPointerId = null;
  state.ui.pointerThrottle = false;
  state.ui.pointerBrake = false;
  state.ui.pointerThrottleId = null;
  state.ui.pointerBrakeId = null;
  state.ui.keys.throttle = false;
  state.ui.keys.brake = false;
  state.ui.keys.steerLeft = false;
  state.ui.keys.steerRight = false;
  state.ui.steeringInput = 0;
  state.ui.targetSteering = 0;
}

function setStudioView(isVisible) {
  if (!isVisible) {
    resetTransientInteractionState();
  }
  elements.landingPage.classList.toggle("is-hidden", isVisible);
  document.querySelector(".app-shell").classList.toggle("is-visible", isVisible);
  history.replaceState(null, "", isVisible ? "#driving-ground-studio" : "#top");
  if (isVisible) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function syncViewToUrl() {
  const shouldShowStudio = window.location.hash === "#driving-ground-studio";
  if (!shouldShowStudio) {
    resetTransientInteractionState();
  }
  elements.landingPage.classList.toggle("is-hidden", shouldShowStudio);
  document.querySelector(".app-shell").classList.toggle("is-visible", shouldShowStudio);
}

function openStudioWithLoading() {
  if (studioOpenTimer) {
    window.clearTimeout(studioOpenTimer);
  }
  elements.studioLoading.classList.add("is-active");
  elements.studioLoading.setAttribute("aria-hidden", "false");
  studioOpenTimer = window.setTimeout(() => {
    setStudioView(true);
    elements.studioLoading.classList.remove("is-active");
    elements.studioLoading.setAttribute("aria-hidden", "true");
    studioOpenTimer = null;
  }, 720);
}

function setPanelFold(panelName, isFolded) {
  const panel = panelName === "toolbar" ? elements.toolbarPanel : elements.inspectorPanel;
  const toggle = panelName === "toolbar" ? elements.toggleToolbar : elements.toggleInspector;
  const className = panelName === "toolbar" ? "left-collapsed" : "right-collapsed";
  elements.workspace.classList.toggle(className, isFolded);
  panel.classList.toggle("is-folded", isFolded);
  toggle.setAttribute("aria-expanded", String(!isFolded));
  toggle.innerHTML = isFolded
    ? `<span aria-hidden="true">${panelName === "toolbar" ? "→" : "←"}</span><span class="toggle-label">Open</span>`
    : `<span class="toggle-label">Fold panel</span><span aria-hidden="true">${panelName === "toolbar" ? "←" : "→"}</span>`;
}

function setDrawTool(tool) {
  state.ui.drawTool = tool;
  setMode("draw");
}

function setSignal(signal) {
  const vehicle = getSelectedVehicle();
  if (!vehicle) {
    return;
  }

  vehicle.signal = signal;
  render();
}

function toggleReverse(forceValue) {
  const vehicle = getSelectedVehicle();
  if (!vehicle) {
    return;
  }

  vehicle.reverse = typeof forceValue === "boolean" ? forceValue : !vehicle.reverse;
  render();
}

function updateMap(mapData) {
  state.map = { ...state.map, ...mapData };
  elements.mapImage.src = state.map.src;
  elements.mapName.textContent = state.map.name;
  if (state.map.width && state.map.height) {
    elements.stage.style.aspectRatio = `${state.map.width} / ${state.map.height}`;
  }
  render();
}

function buildPathData(points) {
  if (!points.length) {
    return "";
  }
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * 100} ${point.y * 100}`)
    .join(" ");
}

function createArrowHead(start, end, color, width) {
  const group = document.createElementNS(svgNs, "g");
  const lineAngle = Math.atan2(end.y - start.y, end.x - start.x);
  const angleA = lineAngle + Math.PI * 0.82;
  const angleB = lineAngle - Math.PI * 0.82;
  const headLength = Math.max(0.01, width * 0.0048);
  const p1 = {
    x: end.x - Math.cos(angleA) * headLength,
    y: end.y - Math.sin(angleA) * headLength,
  };
  const p2 = {
    x: end.x - Math.cos(angleB) * headLength,
    y: end.y - Math.sin(angleB) * headLength,
  };

  const path = document.createElementNS(svgNs, "path");
  path.setAttribute(
    "d",
    `M ${p1.x * 100} ${p1.y * 100} L ${end.x * 100} ${end.y * 100} L ${p2.x * 100} ${p2.y * 100}`
  );
  path.setAttribute("class", "drawing-arrow-head");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", width);
  path.setAttribute("fill", "none");
  group.append(path);
  return group;
}

function createDrawingElement(drawing) {
  const group = document.createElementNS(svgNs, "g");
  group.dataset.drawingId = drawing.id;
  group.style.pointerEvents = state.mode === "draw" ? "auto" : "none";

  let element;
  if (drawing.tool === "pen") {
    element = document.createElementNS(svgNs, "path");
    element.setAttribute("d", buildPathData(drawing.points));
    element.setAttribute("class", "drawing-path");
  } else if (drawing.tool === "line" || drawing.tool === "arrow") {
    element = document.createElementNS(svgNs, "line");
    element.setAttribute("x1", `${drawing.start.x * 100}`);
    element.setAttribute("y1", `${drawing.start.y * 100}`);
    element.setAttribute("x2", `${drawing.end.x * 100}`);
    element.setAttribute("y2", `${drawing.end.y * 100}`);
    element.setAttribute("class", drawing.tool === "line" ? "drawing-line" : "drawing-arrow");
  } else if (drawing.tool === "rect") {
    element = document.createElementNS(svgNs, "rect");
    const x = Math.min(drawing.start.x, drawing.end.x);
    const y = Math.min(drawing.start.y, drawing.end.y);
    const width = Math.abs(drawing.end.x - drawing.start.x);
    const height = Math.abs(drawing.end.y - drawing.start.y);
    element.setAttribute("x", `${x * 100}`);
    element.setAttribute("y", `${y * 100}`);
    element.setAttribute("width", `${width * 100}`);
    element.setAttribute("height", `${height * 100}`);
    element.setAttribute("rx", "1.2");
    element.setAttribute("class", "drawing-rect");
  } else if (drawing.tool === "ellipse") {
    element = document.createElementNS(svgNs, "ellipse");
    element.setAttribute("cx", `${((drawing.start.x + drawing.end.x) / 2) * 100}`);
    element.setAttribute("cy", `${((drawing.start.y + drawing.end.y) / 2) * 100}`);
    element.setAttribute("rx", `${Math.abs(drawing.end.x - drawing.start.x) * 50}`);
    element.setAttribute("ry", `${Math.abs(drawing.end.y - drawing.start.y) * 50}`);
    element.setAttribute("class", "drawing-ellipse");
  }

  if (!element) {
    return group;
  }

  element.dataset.drawingId = drawing.id;
  element.setAttribute("stroke", drawing.color);
  element.setAttribute("stroke-width", drawing.width);
  element.setAttribute("vector-effect", "non-scaling-stroke");
  group.append(element);

  if (drawing.tool === "arrow") {
    group.append(createArrowHead(drawing.start, drawing.end, drawing.color, drawing.width));
  }

  return group;
}

function removeDrawingById(drawingId) {
  state.drawings = state.drawings.filter((drawing) => drawing.id !== drawingId);
  renderDrawings();
}

function beginDrawing(point) {
  const tool = state.ui.drawTool;
  const id = `draw-${state.counters.drawing++}`;
  const common = {
    id,
    tool,
    color: state.ui.drawColor,
    width: state.ui.drawWidth,
  };

  if (tool === "eraser") {
    eraseAtPointer(point);
    return;
  }

  if (tool === "pen") {
    state.ui.drawingSession = {
      drawing: {
        ...common,
        points: [point],
      },
    };
    return;
  }

  state.ui.drawingSession = {
    drawing: {
      ...common,
      start: point,
      end: point,
    },
  };
}

function updateDrawing(point) {
  const session = state.ui.drawingSession;
  if (!session) {
    return;
  }

  if (session.drawing.tool === "pen") {
    session.drawing.points.push(point);
  } else {
    session.drawing.end = point;
  }
  renderDrawings(session.drawing);
}

function finishDrawing() {
  const session = state.ui.drawingSession;
  if (!session) {
    return;
  }

  const drawing = session.drawing;
  if (drawing.tool === "pen" && drawing.points.length < 2) {
    state.ui.drawingSession = null;
    renderDrawings();
    return;
  }

  if (drawing.tool !== "pen") {
    const deltaX = Math.abs(drawing.end.x - drawing.start.x);
    const deltaY = Math.abs(drawing.end.y - drawing.start.y);
    if (deltaX < 0.002 && deltaY < 0.002) {
      state.ui.drawingSession = null;
      renderDrawings();
      return;
    }
  }

  state.drawings.push(JSON.parse(JSON.stringify(drawing)));
  state.ui.drawingSession = null;
  renderDrawings();
}

function renderDrawings(previewDrawing = null) {
  elements.drawingLayer.innerHTML = "";
  elements.drawingLayer.setAttribute("viewBox", "0 0 100 100");
  elements.drawingLayer.setAttribute("preserveAspectRatio", "none");

  if (state.mode === "draw") {
    const hitSurface = document.createElementNS(svgNs, "rect");
    hitSurface.setAttribute("class", "drawing-hit-surface");
    hitSurface.setAttribute("x", "0");
    hitSurface.setAttribute("y", "0");
    hitSurface.setAttribute("width", "100");
    hitSurface.setAttribute("height", "100");
    hitSurface.setAttribute("fill", "transparent");
    hitSurface.setAttribute("pointer-events", "all");
    elements.drawingLayer.append(hitSurface);
  }

  for (const drawing of state.drawings) {
    elements.drawingLayer.append(createDrawingElement(drawing));
  }

  if (previewDrawing) {
    const preview = createDrawingElement(previewDrawing);
    preview.style.opacity = "0.72";
    elements.drawingLayer.append(preview);
  }

  elements.drawingLayer.style.pointerEvents = state.mode === "draw" ? "all" : "none";
  elements.drawingLayer.style.zIndex = state.mode === "draw" ? "8" : "2";
}

function landmarkTemplate(landmark) {
  const selected = landmark.id === state.selectedLandmarkId;
  return `
    <div
      class="landmark ${landmark.color} ${selected ? "selected" : ""}"
      data-landmark-id="${landmark.id}"
      style="left:${landmark.x * 100}%; top:${landmark.y * 100}%;"
    >
      <div class="landmark-hitbox"></div>
      <div class="landmark-plate"><span class="landmark-number">${landmark.number}</span></div>
      <div class="landmark-pole"></div>
      <div class="landmark-base"></div>
    </div>
  `;
}

function renderLandmarks() {
  elements.landmarkLayer.innerHTML = state.landmarks.map(landmarkTemplate).join("");
  elements.landmarkLayer.style.pointerEvents = "none";

  for (const landmarkElement of elements.landmarkLayer.querySelectorAll("[data-landmark-id]")) {
    landmarkElement.style.pointerEvents = state.mode === "draw" ? "none" : "auto";
    landmarkElement.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();

      const landmarkId = landmarkElement.dataset.landmarkId;
      state.selectedLandmarkId = landmarkId;
      state.selectedVehicleId = null;
      state.panelTab = "landmarks";
      syncLandmarkSelectionUI();

      if (state.mode === "edit") {
        startDrag(event, "landmark", landmarkId, "move");
        elements.stage.setPointerCapture(event.pointerId);
      }
    });
  }
}

function syncLandmarkSelectionUI() {
  for (const landmarkElement of elements.landmarkLayer.querySelectorAll("[data-landmark-id]")) {
    landmarkElement.classList.toggle("selected", landmarkElement.dataset.landmarkId === state.selectedLandmarkId);
  }
  renderLandmarkEditor();
  updateStatus();
  updateControls();
}

function vehicleTemplate(vehicle) {
  const selected = vehicle.id === state.selectedVehicleId;
  const steeringAngle = selected ? Math.round(state.ui.steering * 28) : 0;

  return `
    <div
      class="vehicle ${vehicle.type} ${selected ? "selected" : ""}"
      data-vehicle-id="${vehicle.id}"
      style="
        left: ${vehicle.x * 100}%;
        top: ${vehicle.y * 100}%;
        --vehicle-scale: ${vehicle.scale ?? 1};
        transform: translate(-50%, -50%) rotate(${vehicle.angle}deg) scale(var(--vehicle-scale));
      "
    >
      <div class="vehicle-shell">
        ${getWheelMarkup(vehicle, steeringAngle)}
        ${getVehicleBodyMarkup(vehicle)}
        ${getLightMarkup(vehicle)}
      </div>
      <div class="vehicle-label">${vehicle.label}</div>
      ${vehicle.reverse ? '<div class="vehicle-reverse">R</div>' : ""}
      <div class="rotate-handle" title="Rotate vehicle"></div>
    </div>
  `;
}

function renderVehicles() {
  elements.vehicleLayer.innerHTML = state.vehicles.map(vehicleTemplate).join("");
  for (const vehicleElement of elements.vehicleLayer.querySelectorAll("[data-vehicle-id]")) {
    vehicleElement.style.pointerEvents = state.mode === "draw" ? "none" : "auto";
  }
}

function renderLandmarkEditor() {
  const landmark = getSelectedLandmark();
  if (!landmark) {
    elements.landmarkEditor.innerHTML =
      '<p class="small-copy">Select a landmark in Edit mode to move it, change its number, or recolor it.</p>';
    return;
  }

  elements.landmarkEditor.innerHTML = `
    <label>
      Selected Number
      <input id="selectedLandmarkNumber" type="number" min="1" max="999" value="${landmark.number}" />
    </label>
    <div>
      <span class="label">Selected Color</span>
      <div class="segmented landmark-color-strip">
        <button class="landmark-color-button ${landmark.color === "yellow" ? "active" : ""}" data-selected-landmark-color="yellow">Yellow</button>
        <button class="landmark-color-button ${landmark.color === "white" ? "active" : ""}" data-selected-landmark-color="white">White</button>
      </div>
    </div>
    <p class="small-copy">Drag the selected pole on the map while in Edit mode.</p>
  `;

  document.getElementById("selectedLandmarkNumber").addEventListener("input", event => {
    landmark.number = Math.max(1, Math.min(999, Number(event.target.value) || 1));
    renderLandmarks();
    updateStatus();
  });

  for (const button of elements.landmarkEditor.querySelectorAll("[data-selected-landmark-color]")) {
    button.addEventListener("click", () => {
      landmark.color = button.dataset.selectedLandmarkColor;
      renderLandmarkEditor();
      renderLandmarks();
      updateStatus();
    });
  }
}

function renderInspector() {
  const vehicle = getSelectedVehicle();
  if (!vehicle) {
    elements.vehicleInspector.innerHTML = '<p class="small-copy">Select a vehicle to edit its properties.</p>';
    return;
  }

  elements.vehicleInspector.innerHTML = `
    <div class="inspector-card stack">
      <label>
        Label
        <input id="vehicleLabelInput" type="text" maxlength="1" value="${vehicle.label}" />
      </label>
      <label>
        Type
        <select id="vehicleTypeInput">
          ${Object.keys(VEHICLE_TYPES)
            .map(
              type =>
                `<option value="${type}" ${vehicle.type === type ? "selected" : ""}>${
                  type.charAt(0).toUpperCase() + type.slice(1)
                }</option>`
            )
            .join("")}
        </select>
      </label>
      <label>
        Heading <output id="vehicleAngleOutput">${Math.round(vehicle.angle)}°</output>
        <input id="vehicleAngleInput" type="range" min="0" max="359" value="${Math.round(vehicle.angle)}" />
      </label>
      <label>
        Vehicle Size <output id="vehicleSizeOutput">${Math.round((vehicle.scale ?? 1) * 100)}%</output>
        <input id="vehicleSizeInput" type="range" min="55" max="150" value="${Math.round((vehicle.scale ?? 1) * 100)}" />
      </label>
      <div class="inspector-meta">
        <div>X: ${(vehicle.x * 100).toFixed(1)}%</div>
        <div>Y: ${(vehicle.y * 100).toFixed(1)}%</div>
      </div>
      <div class="inspector-badge-row">
        <span class="inspector-badge">Signal: ${vehicle.signal}</span>
        <span class="inspector-badge">Reverse: ${vehicle.reverse ? "On" : "Off"}</span>
      </div>
    </div>
  `;

  document.getElementById("vehicleLabelInput").addEventListener("input", event => {
    vehicle.label = (event.target.value || getNextVehicleLabel()).slice(0, 1).toUpperCase();
    event.target.value = vehicle.label;
    renderVehicles();
    updateStatus();
  });

  document.getElementById("vehicleTypeInput").addEventListener("change", event => {
    vehicle.type = event.target.value;
    renderVehicles();
  });

  document.getElementById("vehicleAngleInput").addEventListener("input", event => {
    vehicle.angle = Number(event.target.value);
    renderVehicles();
    document.getElementById("vehicleAngleOutput").textContent = `${Math.round(vehicle.angle)}°`;
  });

  document.getElementById("vehicleSizeInput").addEventListener("input", event => {
    vehicle.scale = clamp(Number(event.target.value) / 100, 0.55, 1.5);
    document.getElementById("vehicleSizeOutput").textContent = `${Math.round(vehicle.scale * 100)}%`;
    renderVehicles();
  });
}

function updateStatus() {
  const modeLabel = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  elements.modeStatus.textContent = `Mode: ${modeLabel}`;

  const landmark = getSelectedLandmark();
  const vehicle = getSelectedVehicle();
  elements.selectionStatus.textContent = landmark
    ? `Selection: Pole ${landmark.number}`
    : vehicle
      ? `Selection: Vehicle ${vehicle.label}`
      : "Selection: None";
  elements.selectedVehicleStatus.textContent = vehicle
    ? `${vehicle.label} · ${vehicle.type} · ${Math.round(vehicle.angle)}°`
    : "No vehicle selected";
}

function updateControls() {
  for (const button of elements.modeButtons) {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  }

  for (const button of elements.drawToolButtons) {
    button.classList.toggle("active", button.dataset.drawTool === state.ui.drawTool);
  }

  for (const button of elements.panelTabButtons) {
    button.classList.toggle("active", button.dataset.panelTab === state.panelTab);
  }

  for (const panel of elements.panelTabPanels) {
    panel.classList.toggle("active", panel.dataset.tabPanel === state.panelTab);
  }

  for (const button of elements.signalButtons) {
    const selectedVehicle = getSelectedVehicle();
    button.classList.toggle("active", selectedVehicle?.signal === button.dataset.signal);
  }

  for (const button of elements.landmarkColorButtons) {
    button.classList.toggle("active", button.dataset.landmarkColor === state.ui.landmarkColor);
  }

  const selectedVehicle = getSelectedVehicle();
  elements.reverseToggle.classList.toggle("active", Boolean(selectedVehicle?.reverse));
  elements.throttleButton.classList.toggle("active", isThrottleActive());
  elements.brakeButton.classList.toggle("active", isBrakeActive());
  elements.strokeWidth.value = String(state.ui.drawWidth);

  const steeringPercent = Math.round(state.ui.targetSteering * 100);
  elements.steeringReadout.textContent = `${steeringPercent}%`;
  elements.steeringFace.style.transform = `rotate(${state.ui.steering * 145}deg)`;
  elements.vehicleLayer.style.pointerEvents = state.mode === "draw" ? "none" : "auto";
  for (const vehicleElement of elements.vehicleLayer.querySelectorAll("[data-vehicle-id]")) {
    vehicleElement.style.pointerEvents = state.mode === "draw" ? "none" : "auto";
  }
  for (const landmarkElement of elements.landmarkLayer.querySelectorAll("[data-landmark-id]")) {
    landmarkElement.style.pointerEvents = state.mode === "draw" ? "none" : "auto";
  }
}

function renderColorSwatches() {
  elements.colorSwatches.innerHTML = DRAW_COLORS.map(
    color => `<button class="swatch ${state.ui.drawColor === color ? "active" : ""}" data-color="${color}" style="background:${color};"></button>`
  ).join("");

  for (const swatch of elements.colorSwatches.querySelectorAll(".swatch")) {
    swatch.addEventListener("click", () => {
      state.ui.drawColor = swatch.dataset.color;
      renderColorSwatches();
    });
  }
}

function render() {
  renderDrawings();
  renderLandmarks();
  renderVehicles();
  renderLandmarkEditor();
  renderInspector();
  updateStatus();
  updateControls();
}

function isThrottleActive() {
  return state.ui.keys.throttle || state.ui.pointerThrottle;
}

function isBrakeActive() {
  return state.ui.keys.brake || state.ui.pointerBrake;
}

function animate(now) {
  const delta = Math.min((now - lastFrameTime) / 1000, 0.033);
  lastFrameTime = now;
  const vehicle = getSelectedVehicle();
  const previousSteering = state.ui.steering;
  let vehiclePoseChanged = false;

  if (vehicle && state.mode === "drive") {
    const handling = getHandling(vehicle);

    if (state.ui.steeringPointerId === null) {
      state.ui.steeringInput = ((state.ui.keys.steerRight ? 1 : 0) - (state.ui.keys.steerLeft ? 1 : 0)) * 0.92;
    }

    const steeringInputRate = state.ui.steeringInput === 0 ? 5.2 : 7.5;
    state.ui.targetSteering = lerp(
      state.ui.targetSteering,
      state.ui.steeringInput,
      Math.min(1, delta * steeringInputRate)
    );
    const steeringRate = state.ui.targetSteering === 0 ? 3.8 : 5.6;
    state.ui.steering = lerp(state.ui.steering, state.ui.targetSteering, Math.min(1, delta * steeringRate));

    const throttle = isThrottleActive() ? 1 : 0;
    const brake = isBrakeActive() ? 1 : 0;
    const direction = vehicle.reverse ? -1 : 1;
    const speedSign = vehicle.speed === 0 ? direction : Math.sign(vehicle.speed);
    const acceleratingAgainstMotion = throttle && vehicle.speed !== 0 && speedSign !== direction;

    if (throttle) {
      const accelMultiplier = acceleratingAgainstMotion ? 1.6 : 1;
      vehicle.speed += direction * delta * handling.acceleration * accelMultiplier;
    } else {
      vehicle.speed *= Math.max(0, 1 - delta * handling.coast);
    }

    if (brake) {
      vehicle.speed *= Math.max(0, 1 - delta * handling.brake);
    }

    vehicle.speed = clamp(vehicle.speed, -handling.maxSpeed, handling.maxSpeed);
    if (Math.abs(vehicle.speed) < 0.00045) {
      vehicle.speed = 0;
    }

    if (Math.abs(vehicle.speed) > 0.0005) {
      const steerAngleRad = (state.ui.steering * handling.steerAngle * Math.PI) / 180;
      const reverseMultiplier = vehicle.speed >= 0 ? 1 : -1;
      const targetYawVelocity =
        (vehicle.speed / handling.wheelBase) * Math.tan(steerAngleRad) * reverseMultiplier;
      vehicle.yawVelocity = lerp(vehicle.yawVelocity, targetYawVelocity, Math.min(1, delta * 4.5));
      vehicle.angle += vehicle.yawVelocity * delta * (180 / Math.PI);
      const radians = (vehicle.angle * Math.PI) / 180;
      vehicle.x = clamp(vehicle.x + Math.sin(radians) * vehicle.speed * delta, 0.02, 0.98);
      vehicle.y = clamp(vehicle.y - Math.cos(radians) * vehicle.speed * delta, 0.02, 0.98);
      vehiclePoseChanged = true;
    } else {
      vehicle.yawVelocity = lerp(vehicle.yawVelocity, 0, Math.min(1, delta * 6.2));
    }
  } else if (state.ui.steeringPointerId === null) {
    state.ui.steeringInput = 0;
    state.ui.targetSteering = 0;
    state.ui.steering = lerp(state.ui.steering, 0, Math.min(1, delta * 4.6));
  }

  if (Math.abs(state.ui.steering) < 0.005 && Math.abs(state.ui.targetSteering) < 0.005) {
    state.ui.steering = 0;
  }

  if (vehiclePoseChanged) {
    renderVehicles();
    renderInspector();
    updateStatus();
  } else if (Math.abs(state.ui.steering - previousSteering) > 0.001) {
    renderVehicles();
  }

  updateControls();
  animationFrame = requestAnimationFrame(animate);
}

function startDrag(pointerEvent, entityType, entityId, dragType) {
  state.ui.dragSession = {
    pointerId: pointerEvent.pointerId,
    entityType,
    entityId,
    dragType,
  };

  if (entityType === "vehicle") {
    const vehicleElement = elements.vehicleLayer.querySelector(`[data-vehicle-id="${entityId}"]`);
    const rotateHandle = vehicleElement?.querySelector(".rotate-handle");
    if (dragType === "move") {
      vehicleElement?.classList.add("dragging");
    } else {
      rotateHandle?.classList.add("dragging");
    }
    return;
  }

  if (entityType === "landmark") {
    const landmarkElement = elements.landmarkLayer.querySelector(`[data-landmark-id="${entityId}"]`);
    landmarkElement?.classList.add("dragging");
  }
}

function updateDrag(pointerEvent) {
  const session = state.ui.dragSession;
  if (!session || pointerEvent.pointerId !== session.pointerId) {
    return;
  }

  const point = getPointerNormalized(pointerEvent.clientX, pointerEvent.clientY);
  if (session.entityType === "landmark") {
    const landmark = state.landmarks.find(entry => entry.id === session.entityId);
    if (!landmark) {
      return;
    }
    landmark.x = point.x;
    landmark.y = point.y;
    const landmarkElement = elements.landmarkLayer.querySelector(`[data-landmark-id="${session.entityId}"]`);
    if (landmarkElement) {
      landmarkElement.style.left = `${landmark.x * 100}%`;
      landmarkElement.style.top = `${landmark.y * 100}%`;
    }
    renderLandmarkEditor();
    updateStatus();
    return;
  }

  const vehicle = state.vehicles.find(entry => entry.id === session.entityId);
  if (!vehicle) {
    return;
  }

  if (session.dragType === "move") {
    vehicle.x = point.x;
    vehicle.y = point.y;
  } else {
    const stagePoint = getStageMetrics();
    const centerX = stagePoint.left + vehicle.x * stagePoint.width;
    const centerY = stagePoint.top + vehicle.y * stagePoint.height;
    const angle = (Math.atan2(pointerEvent.clientY - centerY, pointerEvent.clientX - centerX) * 180) / Math.PI + 90;
    vehicle.angle = (angle + 360) % 360;
  }

  renderVehicles();
  renderInspector();
  updateStatus();
}

function stopDrag(pointerEvent) {
  const session = state.ui.dragSession;
  if (!session || (pointerEvent && pointerEvent.pointerId !== session.pointerId)) {
    return;
  }
  state.ui.dragSession = null;
  render();
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }
  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
  const nearestX = start.x + t * dx;
  const nearestY = start.y + t * dy;
  return Math.hypot(point.x - nearestX, point.y - nearestY);
}

function drawingContainsPoint(drawing, point) {
  const tolerance = Math.max(0.01, drawing.width * 0.0016);

  if (drawing.tool === "pen") {
    for (let index = 1; index < drawing.points.length; index += 1) {
      if (distanceToSegment(point, drawing.points[index - 1], drawing.points[index]) <= tolerance) {
        return true;
      }
    }
    return false;
  }

  if (drawing.tool === "line" || drawing.tool === "arrow") {
    return distanceToSegment(point, drawing.start, drawing.end) <= tolerance;
  }

  if (drawing.tool === "rect") {
    const minX = Math.min(drawing.start.x, drawing.end.x);
    const maxX = Math.max(drawing.start.x, drawing.end.x);
    const minY = Math.min(drawing.start.y, drawing.end.y);
    const maxY = Math.max(drawing.start.y, drawing.end.y);
    const onLeft = Math.abs(point.x - minX) <= tolerance && point.y >= minY - tolerance && point.y <= maxY + tolerance;
    const onRight = Math.abs(point.x - maxX) <= tolerance && point.y >= minY - tolerance && point.y <= maxY + tolerance;
    const onTop = Math.abs(point.y - minY) <= tolerance && point.x >= minX - tolerance && point.x <= maxX + tolerance;
    const onBottom = Math.abs(point.y - maxY) <= tolerance && point.x >= minX - tolerance && point.x <= maxX + tolerance;
    return onLeft || onRight || onTop || onBottom;
  }

  if (drawing.tool === "ellipse") {
    const rx = Math.abs(drawing.end.x - drawing.start.x) / 2;
    const ry = Math.abs(drawing.end.y - drawing.start.y) / 2;
    if (rx === 0 || ry === 0) {
      return false;
    }
    const cx = (drawing.start.x + drawing.end.x) / 2;
    const cy = (drawing.start.y + drawing.end.y) / 2;
    const normalized =
      ((point.x - cx) * (point.x - cx)) / (rx * rx) + ((point.y - cy) * (point.y - cy)) / (ry * ry);
    return Math.abs(normalized - 1) <= tolerance * 18;
  }

  return false;
}

function eraseAtPointer(point = null) {
  const normalizedPoint = point || getPointerNormalized(window._lastPointerX || 0, window._lastPointerY || 0);
  const drawing = [...state.drawings].reverse().find(entry => drawingContainsPoint(entry, normalizedPoint));
  if (drawing) {
    removeDrawingById(drawing.id);
  }
}

function handleStagePointerDown(event) {
  window._lastPointerX = event.clientX;
  window._lastPointerY = event.clientY;

  const vehicleElement = event.target.closest("[data-vehicle-id]");
  if (vehicleElement) {
    const vehicleId = vehicleElement.dataset.vehicleId;
    selectVehicle(vehicleId);

    if (state.mode === "edit") {
      if (event.target.closest(".rotate-handle")) {
        startDrag(event, "vehicle", vehicleId, "rotate");
      } else {
        startDrag(event, "vehicle", vehicleId, "move");
      }
      elements.stage.setPointerCapture(event.pointerId);
    }
    return;
  }

  if (state.mode === "edit") {
    state.selectedVehicleId = null;
    state.selectedLandmarkId = null;
    render();
  }

  if (state.mode === "draw") {
    beginDrawing(getPointerNormalized(event.clientX, event.clientY));
    elements.stage.setPointerCapture(event.pointerId);
  }
}

function handleDrawingPointerDownCapture(event) {
  if (state.mode !== "draw") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  window._lastPointerX = event.clientX;
  window._lastPointerY = event.clientY;
  beginDrawing(getPointerNormalized(event.clientX, event.clientY));
  elements.stage.setPointerCapture(event.pointerId);
}

function handleStagePointerDownCapture(event) {
  const landmarkElement = event.target.closest?.("[data-landmark-id]");
  if (!landmarkElement || state.mode === "draw") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const landmarkId = landmarkElement.dataset.landmarkId;
  state.selectedLandmarkId = landmarkId;
  state.selectedVehicleId = null;
  state.panelTab = "landmarks";
  syncLandmarkSelectionUI();

  if (state.mode === "edit") {
    startDrag(event, "landmark", landmarkId, "move");
    elements.stage.setPointerCapture(event.pointerId);
  }
}

function handleStagePointerMove(event) {
  window._lastPointerX = event.clientX;
  window._lastPointerY = event.clientY;

  if (state.ui.dragSession) {
    updateDrag(event);
    return;
  }

  if (state.mode === "draw") {
    if (state.ui.drawTool === "eraser" && event.buttons === 1) {
      eraseAtPointer(getPointerNormalized(event.clientX, event.clientY));
    } else if (state.ui.drawingSession) {
      updateDrawing(getPointerNormalized(event.clientX, event.clientY));
    }
  }
}

function handleStagePointerUp(event) {
  if (state.ui.dragSession) {
    stopDrag(event);
  }
  if (state.mode === "draw" && state.ui.drawingSession) {
    finishDrawing();
  }
}

function handleSteeringPointerDown(event) {
  if (state.mode !== "drive") {
    return;
  }
  state.ui.steeringPointerId = event.pointerId;
  elements.steeringWheel.setPointerCapture(event.pointerId);
  handleSteeringPointerMove(event);
}

function handleSteeringPointerMove(event) {
  if (state.mode !== "drive" || state.ui.steeringPointerId !== event.pointerId) {
    return;
  }

  const rect = elements.steeringWheel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = centerY - event.clientY;
  const angle = Math.atan2(dx, Math.max(12, dy));
  const normalized = angle / (Math.PI / 2.35);
  state.ui.steeringInput = clamp(normalized, -1, 1);
  updateControls();
}

function handleSteeringPointerUp(event) {
  if (state.ui.steeringPointerId !== event.pointerId) {
    return;
  }
  state.ui.steeringPointerId = null;
  state.ui.steeringInput = 0;
  state.ui.targetSteering = 0;
}

function createDownload(filename, content) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function saveScenario() {
  const payload = {
    map: state.map,
    vehicles: state.vehicles,
    landmarks: state.landmarks,
    drawings: state.drawings,
    counters: state.counters,
  };
  createDownload("driving-ground-scenario.json", JSON.stringify(payload, null, 2));
  localStorage.setItem("driving-ground-autosave", JSON.stringify(payload));
}

function loadScenarioObject(payload) {
  state.map = payload.map || { ...DEFAULT_MAP };
  state.vehicles = Array.isArray(payload.vehicles)
    ? payload.vehicles.map(vehicle => ({
        ...vehicle,
        scale: clamp(Number(vehicle.scale ?? 1) || 1, 0.55, 1.5),
      }))
    : [];
  state.landmarks = Array.isArray(payload.landmarks) ? payload.landmarks : [];
  state.drawings = Array.isArray(payload.drawings) ? payload.drawings : [];
  state.counters = {
    vehicle: Math.max((payload.counters?.vehicle || 1), state.vehicles.length + 1),
    drawing: Math.max((payload.counters?.drawing || 1), state.drawings.length + 1),
    landmark: Math.max((payload.counters?.landmark || 1), state.landmarks.length + 1),
  };
  state.selectedVehicleId = state.vehicles[0]?.id ?? null;
  state.selectedLandmarkId = null;
  state.ui.steering = 0;
  state.ui.steeringInput = 0;
  state.ui.targetSteering = 0;
  updateMap(state.map);
  render();
}

function hydrateAutosave() {
  const saved = localStorage.getItem("driving-ground-autosave");
  if (!saved) {
    return;
  }

  try {
    loadScenarioObject(JSON.parse(saved));
  } catch (error) {
    console.warn("Unable to restore autosave", error);
  }
}

function bindEvents() {
  elements.landingOpenStudio.addEventListener("click", openStudioWithLoading);
  elements.heroOpenStudio.addEventListener("click", openStudioWithLoading);
  elements.backToLanding.addEventListener("click", () => setStudioView(false));
  window.addEventListener("hashchange", syncViewToUrl);
  elements.toggleToolbar.addEventListener("click", () => {
    setPanelFold("toolbar", !elements.toolbarPanel.classList.contains("is-folded"));
  });
  elements.toggleInspector.addEventListener("click", () => {
    setPanelFold("inspector", !elements.inspectorPanel.classList.contains("is-folded"));
  });
  elements.addVehicle.addEventListener("click", () => addVehicle());
  elements.duplicateVehicle.addEventListener("click", duplicateVehicle);
  elements.deleteVehicle.addEventListener("click", deleteVehicle);
  elements.addLandmark.addEventListener("click", addLandmark);
  elements.deleteLandmark.addEventListener("click", deleteSelectedLandmark);
  elements.clearDrawings.addEventListener("click", () => {
    state.drawings = [];
    renderDrawings();
  });
  elements.undoDrawing.addEventListener("click", () => {
    state.drawings.pop();
    renderDrawings();
  });
  elements.strokeWidth.addEventListener("input", event => {
    state.ui.drawWidth = Number(event.target.value);
  });

  for (const button of elements.modeButtons) {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  }
  for (const button of elements.panelTabButtons) {
    button.addEventListener("click", () => {
      const tab = button.dataset.panelTab;
      if (tab === "drawing") {
        setMode("draw");
      } else if (state.mode === "draw") {
        resetTransientInteractionState();
        state.mode = "edit";
        state.panelTab = tab;
        render();
      } else {
        setPanelTab(tab);
      }
    });
  }
  for (const button of elements.drawToolButtons) {
    button.addEventListener("click", () => setDrawTool(button.dataset.drawTool));
  }
  for (const button of elements.signalButtons) {
    button.addEventListener("click", () => setSignal(button.dataset.signal));
  }
  for (const button of elements.landmarkColorButtons) {
    button.addEventListener("click", () => {
      state.ui.landmarkColor = button.dataset.landmarkColor;
      updateControls();
    });
  }

  elements.reverseToggle.addEventListener("click", () => toggleReverse());

  const activatePointerControl = (key, button) => {
    button.addEventListener("pointerdown", event => {
      if (state.mode !== "drive") {
        return;
      }
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      state.ui[key] = true;
      state.ui[`${key}Id`] = event.pointerId;
      updateControls();
    });
    const end = event => {
      if (!state.ui[key] || state.ui[`${key}Id`] !== event.pointerId) {
        return;
      }
      if (button.hasPointerCapture(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }
      state.ui[key] = false;
      state.ui[`${key}Id`] = null;
      updateControls();
    };
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  activatePointerControl("pointerThrottle", elements.throttleButton);
  activatePointerControl("pointerBrake", elements.brakeButton);

  elements.stage.addEventListener("pointerdown", handleDrawingPointerDownCapture, true);
  elements.stage.addEventListener("pointerdown", handleStagePointerDown);
  elements.stage.addEventListener("pointerdown", handleStagePointerDownCapture, true);
  elements.stage.addEventListener("pointermove", handleStagePointerMove);
  elements.stage.addEventListener("pointerup", handleStagePointerUp);
  elements.stage.addEventListener("pointercancel", handleStagePointerUp);
  window.addEventListener("pointermove", handleStagePointerMove);
  window.addEventListener("pointerup", handleStagePointerUp);
  window.addEventListener("pointercancel", handleStagePointerUp);

  elements.steeringWheel.addEventListener("pointerdown", handleSteeringPointerDown);
  elements.steeringWheel.addEventListener("pointermove", handleSteeringPointerMove);
  elements.steeringWheel.addEventListener("pointerup", handleSteeringPointerUp);
  elements.steeringWheel.addEventListener("pointercancel", handleSteeringPointerUp);

  window.addEventListener("keydown", event => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      return;
    }

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
      state.ui.keys.throttle = true;
      event.preventDefault();
    }
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
      state.ui.keys.brake = true;
      event.preventDefault();
    }
    if (event.key === "ArrowLeft") {
      state.ui.keys.steerLeft = true;
      event.preventDefault();
    }
    if (event.key === "ArrowRight") {
      state.ui.keys.steerRight = true;
      event.preventDefault();
    }
    if (event.key.toLowerCase() === "q") {
      setSignal("left");
    }
    if (event.key.toLowerCase() === "e") {
      setSignal("right");
    }
    if (event.key.toLowerCase() === "c") {
      setSignal("off");
    }
    if (event.key.toLowerCase() === "r") {
      toggleReverse();
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      if (state.selectedLandmarkId) {
        deleteSelectedLandmark();
      } else {
        deleteVehicle();
      }
    }
    if (event.key === "Tab") {
      event.preventDefault();
      if (!state.vehicles.length) {
        return;
      }
      const index = state.vehicles.findIndex(vehicle => vehicle.id === state.selectedVehicleId);
      const next = state.vehicles[(index + 1) % state.vehicles.length];
      selectVehicle(next.id);
    }
  });

  window.addEventListener("keyup", event => {
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
      state.ui.keys.throttle = false;
    }
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
      state.ui.keys.brake = false;
    }
    if (event.key === "ArrowLeft") {
      state.ui.keys.steerLeft = false;
    }
    if (event.key === "ArrowRight") {
      state.ui.keys.steerRight = false;
    }
  });

  elements.mapUpload.addEventListener("change", event => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      const image = new Image();
      image.onload = () => {
        updateMap({
          name: file.name.replace(/\.[^.]+$/, ""),
          src: String(loadEvent.target.result),
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      };
      image.src = String(loadEvent.target.result);
    };
    reader.readAsDataURL(file);
  });

  elements.resetDefaultMap.addEventListener("click", () => updateMap({ ...DEFAULT_MAP }));
  elements.saveScenario.addEventListener("click", saveScenario);
  elements.loadScenario.addEventListener("change", event => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }
    file.text().then(text => loadScenarioObject(JSON.parse(text)));
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      "driving-ground-autosave",
      JSON.stringify({
        map: state.map,
        vehicles: state.vehicles,
        landmarks: state.landmarks,
        drawings: state.drawings,
        counters: state.counters,
      })
    );
  });
}

function init() {
  renderColorSwatches();
  updateMap({ ...DEFAULT_MAP });
  addVehicle("sedan");
  hydrateAutosave();
  bindEvents();
  render();
  syncViewToUrl();
  animationFrame = requestAnimationFrame(animate);
}

init();
