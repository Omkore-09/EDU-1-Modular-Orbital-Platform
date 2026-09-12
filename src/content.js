export const sections = [
  {
    id: "chassis",
    code: "MOD-01 · CHASSIS",
    title: "One frame, built to be opened.",
    body: "The airframe is a machined 1U aluminium shell, designed so every subsystem slides out as its own tray. Students swap a single module without touching the rest of the stack.",
    specs: [
      { label: "Envelope", value: "10 × 10 × 11.3 cm" },
      { label: "Mass", value: "1.28 kg" },
      { label: "Material", value: "6061-T6 aluminium" },
      { label: "Rail mount", value: "CubeSat standard" },
    ],
    align: "left",
  },
  {
    id: "power",
    code: "MOD-02 · POWER",
    title: "Panels that unfold before anything else wakes up.",
    body: "Deployment is spring-loaded and sequenced first, so the platform is drawing power before the bus even finishes its boot check.",
    specs: [
      { label: "Cells", value: "4x triple-junction" },
      { label: "Peak output", value: "8.4 W" },
      { label: "Battery", value: "20 Wh Li-ion" },
      { label: "Deploy time", value: "1.4 s" },
    ],
    align: "right",
  },
  {
    id: "comms",
    code: "MOD-03 · COMMS",
    title: "A mast that only extends once you're clear to talk.",
    body: "The UHF whip stays folded flush against the frame through launch and separation, then extends on command once the ground station has line of sight.",
    specs: [
      { label: "Band", value: "UHF 435-438 MHz" },
      { label: "Downlink", value: "9.6 kbps GMSK" },
      { label: "Range", value: "≈ 2,200 km" },
      { label: "Antenna", value: "Deployable whip" },
    ],
    align: "left",
  },
  {
    id: "payload",
    code: "MOD-04 · PAYLOAD",
    title: "The bay where the actual lesson lives.",
    body: "A swappable sensor tray sits at the core — a camera for Earth-imaging labs one term, a spectrometer for atmospheric ones the next.",
    specs: [
      { label: "Slot", value: "1x standard tray" },
      { label: "Interface", value: "I²C / SPI breakout" },
      { label: "Power budget", value: "1.2 W avg" },
      { label: "Sample rate", value: "Configurable" },
    ],
    align: "right",
  },
];

export const exploded = {
  code: "FULL BREAKDOWN",
  title: "Every module, at once.",
  body: "Drag to rotate. Each tray separates along its own service axis — the same way it comes apart on a lab bench.",
};

export const hero = {
  code: "EDU-1 · TEACHING PLATFORM",
  title: "A satellite you're meant to take apart.",
  body: "EDU-1 is a modular 1U CubeSat built for classrooms — every subsystem is a labelled, swappable tray, so students learn spacecraft design by handling the real hardware.",
};
