export const meta = {
  project: "Drakken Lineage",
  canonRule: "A Drakken descendant must carry its history in its body.",
  sourcePolicy: "Source-backed facts remain distinct from inference. Unknown is a valid state.",
  sourceSummary: "Seeded from the Drakken Terraforming Compendium and the Drakken Evolutionary Fossil Record brief."
};

export const nodes = [
  { id:"mother", name:"Mother", tier:"origin", status:"canon", archetype:"Original architecture", function:"Source authority for engineered Drakken architecture", topology:"Governing origin; morphology not reconstructed here", evidence:"Compendium framework / Notebook Program", x:90, y:340 },
  { id:"egg", name:"The Egg", tier:"origin", status:"canon", archetype:"Origin node", function:"Initialization state carrying undifferentiated strain data", topology:"~3 m geode-like fixed spatial anchor with translucent shell and internal barcode light", evidence:"Compendium Egg entry", x:280, y:340 },
  { id:"crust", name:"CRUST-BINDERS", tier:"archetype", status:"canon", archetype:"War archetype", function:"Geological restructuring", topology:"Multiple specialized body plans; do not treat archetype as one morphology", evidence:"Compendium strain system", x:470, y:200 },
  { id:"atmos", name:"ATMOS-ENGINES", tier:"archetype", status:"canon", archetype:"War archetype", function:"Atmospheric restructuring", topology:"Source-defined family; individual strain topology required", evidence:"Compendium strain system", x:470, y:480 },
  { id:"pleuron", name:"Magma Pleuron", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Faultline tunneling; crust liquefaction; lavaflow stabilization", topology:"Towering centipede-like segmented basalt body with internal magma channels", evidence:"Compendium entry", x:720, y:80 },
  { id:"granithelion", name:"Granithelion", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Faultline reinforcement through bodily occupation and deep-earth resonance", topology:"Continent-scale leviathan partially submerged in crust", evidence:"Compendium entry", x:720, y:155 },
  { id:"fault-tongue", name:"Fault-Tongue", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Seismic fracture, displacement, realignment", topology:"Serpentine body; sideways-opening mouth with harmonic plates", evidence:"Compendium entry", x:720, y:230 },
  { id:"obsidian-gul", name:"Obsidian Gul", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Rapid lavaflow carving into basin grids", topology:"Jagged wingless quadruped with reforming obsidian armor", evidence:"Compendium entry", x:720, y:305 },
  { id:"tremorhound", name:"Tremorhound", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Fault scouting and micro-macro seismic propagation", topology:"Low ground-running wolf-shaped war form; familiar resemblance is source-established", evidence:"Compendium entry", x:720, y:380 },
  { id:"glassspine", name:"Glassspine", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Light-conductive terrain and optical macro-transmission", topology:"Thin towering hollow-glass lattice with prismatic filigree", evidence:"Compendium entry", x:720, y:455 },
  { id:"quarrymind", name:"Quarrymind", tier:"strain", status:"canon", archetype:"Crust-Binder", function:"Programmable mineral excavation and litho-colony deployment", topology:"Hive-backed quadruped carrying a dorsal quarry and orbiting harvesters", evidence:"Compendium entry", x:720, y:530 },
  { id:"aerokarst", name:"Aerokarst", tier:"strain", status:"canon", archetype:"Atmos-Engine", function:"Atmospheric / vacuum terraforming", topology:"Source-backed strain; full morphology deliberately deferred until source extraction", evidence:"Compendium Atmos-Engine entry", x:720, y:605 },
  { id:"postwall-unknown", name:"POST-WALL DESCENDANT SPACE", tier:"unknown", status:"unknown", archetype:"Unresolved clades", function:"Living rather than planetary terraforming", topology:"Must be derived from ancestry, Macro inheritance, and post-Wall selection", evidence:"Intentionally unresolved; requires canon development", x:1010, y:340 }
];

export const edges = [
  { source:"mother", target:"egg", type:"body", label:"original engineering" },
  { source:"egg", target:"crust", type:"body", label:"strain differentiation" },
  { source:"egg", target:"atmos", type:"body", label:"strain differentiation" },
  ...["pleuron","granithelion","fault-tongue","obsidian-gul","tremorhound","glassspine","quarrymind"].map(target => ({source:"crust",target,type:"body",label:"war-era lineage"})),
  { source:"atmos", target:"aerokarst", type:"body", label:"war-era lineage" },
  { source:"pleuron", target:"postwall-unknown", type:"body", label:"descendant hypothesis required" },
  { source:"fault-tongue", target:"postwall-unknown", type:"body", label:"descendant hypothesis required" },
  { source:"glassspine", target:"postwall-unknown", type:"body", label:"descendant hypothesis required" },
  { source:"quarrymind", target:"postwall-unknown", type:"macro", label:"possible inherited architecture — unratified", status:"provisional" }
];

export const characters = [
  { id:"E-001", structure:"Egg shell / anchor architecture", warFunction:"Protect initialization state and bind emergence to a site", state:"RETAINED AT ORIGIN", mechanism:"ENGINEERED", confidence:"CANONICALLY OBSERVED" },
  { id:"E-002", structure:"Embryonic Macro-code", warFunction:"Compile a uniquely tuned strain", state:"FOUNDATIONAL", mechanism:"ENGINEERED", confidence:"CANONICALLY OBSERVED" },
  { id:"M-001", structure:"Inherited Macro architecture", warFunction:"Permit older Drakken to configure subsequent generations", state:"LINEAGE MECHANISM", mechanism:"MACRO-INHERITED", confidence:"CANONICALLY OBSERVED" },
  { id:"C-001", structure:"Segmented basalt body / magma channels", warFunction:"Subsurface faultline tunneling and crust liquefaction", state:"WAR-ERA", mechanism:"ENGINEERED", confidence:"CANONICALLY OBSERVED" },
  { id:"C-002", structure:"Harmonic oral plates", warFunction:"Transmit seismic tones into bedrock", state:"WAR-ERA", mechanism:"ENGINEERED", confidence:"CANONICALLY OBSERVED" },
  { id:"C-003", structure:"Dorsal quarry / brainstone drones", warFunction:"Excavate and recursively program mineral systems", state:"WAR-ERA", mechanism:"ENGINEERED", confidence:"CANONICALLY OBSERVED" },
  { id:"P-001", structure:"Post-Wall homologues", warFunction:"Unknown until descendant evidence exists", state:"UNKNOWN", mechanism:"UNKNOWN", confidence:"UNRESOLVED" }
];

export const kernelStages = [
  { stage:"00", title:"Encoded origin", status:"canon", body:"Mother / Notebook Program establishes the architecture from which Eggs and strains derive." },
  { stage:"01", title:"Egg initialization", status:"canon", body:"A fixed geode-like Egg contains undifferentiated data and embryonic Macro-code; Mother impresses a unique ritual Macro." },
  { stage:"02", title:"Axis establishment", status:"unknown", body:"The sources establish differentiation but do not yet define a universal embryological body-axis rule. Do not invent one." },
  { stage:"03", title:"Organ primordia", status:"unknown", body:"Potential Mother Signatures belong here only after repeated source-supported homology is identified across strains." },
  { stage:"04", title:"Strain emergence", status:"canon", body:"War-era bodies are compiled around ecological jobs: crust, atmosphere, biosphere, oceanic, stellar, and other source-defined functions." },
  { stage:"05", title:"Post-Wall development", status:"unknown", body:"A future canon pass must determine what developmental rules survived miniaturization and selection after confinement." }
];

export const evidence = [
  { claim:"Drakken are engineered elemental terraforming entities created through the Notebook Program.", authorial:"SOURCE-BACKED", scholarly:"FOUNDATIONAL ASSUMPTION", source:"Drakken Compendium / canon summary" },
  { claim:"Older Drakken can customize later generations through inherited Macros.", authorial:"SOURCE-BACKED", scholarly:"SUPPORTED BY ARCHIVAL RECORD", source:"Compendium framework" },
  { claim:"War-era bodies exist because they perform ecological jobs at planetary scale.", authorial:"SOURCE-BACKED", scholarly:"CONSENSUS", source:"Compendium strain entries" },
  { claim:"A universal Mother developmental kernel beyond the Egg has been reconstructed.", authorial:"NOT YET ESTABLISHED", scholarly:"OPEN HYPOTHESIS", source:"Requires cross-strain developmental evidence" },
  { claim:"Modern post-Wall clades descend by simple proportional miniaturization.", authorial:"REJECTED BY PROJECT LAW", scholarly:"DISFAVORED MODEL", source:"Evolutionary Fossil Record brief" }
];
