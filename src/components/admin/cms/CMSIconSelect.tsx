import React from 'react';
import {
  Eye,
  Target,
  Shield,
  ShieldCheck,
  ShieldWarning,
  ShieldPlus,
  Check,
  CheckCircle,
  Certificate,
  SealCheck,
  Buildings,
  Briefcase,
  Handshake,
  Users,
  User,
  Globe,
  GlobeHemisphereWest,
  ArrowsClockwise,
  ChatCircle,
  ChatCircleText,
  ChatCircleDots,
  ChatTeardropText,
  Scales,
  Compass,
  Gear,
  Clipboard,
  ClipboardText,
  FileText,
  MagnifyingGlass,
  Medal,
  GraduationCap,
  Sparkle,
  TreeStructure,
  Leaf,
  Lightning,
  Flame,
  Crane,
  Wrench,
  Factory,
  Cylinder,
  Engine,
  Fan,
  Cpu,
  Pipe,
  Gauge,
  Anchor,
  HardHat,
  Barbell,
  Boat,
  Waves,
  Scroll,
  PenNib,
  PaintRoller,
  Timer,
  ClockCountdown,
  Faders,
  Nut,
  Vault,
  Equalizer,
  UserFocus,
  Broadcast,
  Waveform,
  GameController,
  Package,
  Lifebuoy,
  Lock,
  Flask,
  ForkKnife,
  Presentation,
  Devices,
  SlidersHorizontal,
  BookOpen,
  Stack,
  Desktop,
  Pill,
  MapPin,
} from '@phosphor-icons/react';

export interface IconOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: any }>;
}

export const PHOSPHOR_ICON_OPTIONS: IconOption[] = [
  // Core Identity & Vision
  { key: 'eye', label: 'Eye (Vision / Observation)', icon: Eye },
  { key: 'target', label: 'Target (Mission / Goals)', icon: Target },
  { key: 'shield', label: 'Shield (Protection / Assurance)', icon: Shield },
  { key: 'shield-check', label: 'Shield Check (Verified Security / Assurance)', icon: ShieldCheck },
  { key: 'shield-warning', label: 'Shield Warning (ATEX / Hazard Protection)', icon: ShieldWarning },
  { key: 'shield-plus', label: 'Shield Plus (Added Protection / Oil & Gas)', icon: ShieldPlus },
  { key: 'certificate', label: 'Certificate (Accreditation / Reports)', icon: Certificate },
  { key: 'seal-check', label: 'Seal Check (Certification Approved / Quality)', icon: SealCheck },
  { key: 'check', label: 'Check (Standard Conformity)', icon: Check },
  { key: 'check-circle', label: 'Check Circle (Completed Audit)', icon: CheckCircle },

  // Corporate & Communication
  { key: 'buildings', label: 'Buildings (Corporate / Infrastructure / Construction)', icon: Buildings },
  { key: 'briefcase', label: 'Briefcase (Business / Management / Advisory)', icon: Briefcase },
  { key: 'handshake', label: 'Handshake (Partnership / Trust)', icon: Handshake },
  { key: 'users', label: 'Users (Auditors / Community / Social)', icon: Users },
  { key: 'user', label: 'User (Specialist / Lead Auditor)', icon: User },
  { key: 'globe', label: 'Globe (International / Worldwide)', icon: Globe },
  { key: 'globe-west', label: 'Globe West (Global Scope / Declaration / ESG)', icon: GlobeHemisphereWest },
  { key: 'arrows-clockwise', label: 'Arrows Clockwise (Continual Improvement)', icon: ArrowsClockwise },
  { key: 'chat', label: 'Chat (Clear Communication)', icon: ChatCircleText },
  { key: 'chat-circle', label: 'Chat Circle (Support / Dialogue)', icon: ChatCircle },
  { key: 'chat-dots', label: 'Chat Dots (Consultation)', icon: ChatCircleDots },
  { key: 'chat-teardrop-text', label: 'Chat Teardrop (Energy & Power Support)', icon: ChatTeardropText },
  { key: 'scales', label: 'Scales (Impartiality / Governance / Anti-Bribery)', icon: Scales },
  { key: 'compass', label: 'Compass (Strategic Direction)', icon: Compass },

  // Process, Audit & Documentation
  { key: 'gear', label: 'Gear (Process / Machinery / Operations)', icon: Gear },
  { key: 'clipboard', label: 'Clipboard (Assessment / Checklist)', icon: Clipboard },
  { key: 'clipboard-text', label: 'Clipboard Text (Audit Report / Checklist)', icon: ClipboardText },
  { key: 'file-text', label: 'File Text (Standard Documentation / Emissions)', icon: FileText },
  { key: 'magnifying-glass', label: 'Magnifying Glass (Inspection / Review / NDT)', icon: MagnifyingGlass },
  { key: 'medal', label: 'Medal (Quality Excellence)', icon: Medal },
  { key: 'graduation-cap', label: 'Graduation Cap (Academy / Training / Course)', icon: GraduationCap },
  { key: 'tree-structure', label: 'Tree Structure (Systems / Organization)', icon: TreeStructure },
  { key: 'sparkle', label: 'Sparkle (Innovation / Advisory)', icon: Sparkle },
  { key: 'book-open', label: 'Book Open (Knowledge / Curriculum)', icon: BookOpen },

  // Sector Specific: Sustainability, Energy, Food & Lab
  { key: 'leaf', label: 'Leaf (Sustainability / ESG / ISO 14001)', icon: Leaf },
  { key: 'lightning', label: 'Lightning (Energy / Low Voltage / Power)', icon: Lightning },
  { key: 'flame', label: 'Flame (Gas Appliances / Boilers / Heat)', icon: Flame },
  { key: 'hard-hat', label: 'Hard Hat (Site Safety / Personnel / ISO 45001)', icon: HardHat },
  { key: 'lifebuoy', label: 'Lifebuoy (Business Continuity / ISO 22301)', icon: Lifebuoy },
  { key: 'lock', label: 'Lock (Information Security / ISO 27001)', icon: Lock },
  { key: 'flask', label: 'Flask (Testing & Calibration / ISO 17025)', icon: Flask },
  { key: 'fork-knife', label: 'Fork & Knife (Food Safety / HACCP / ISO 22000)', icon: ForkKnife },

  // Training & Delivery Formats
  { key: 'presentation', label: 'Presentation (Classroom Training / Instructor-Led)', icon: Presentation },
  { key: 'devices', label: 'Devices (eLearning / Digital & Blended)', icon: Devices },
  { key: 'sliders-horizontal', label: 'Sliders (In-House & Bespoke Programmes)', icon: SlidersHorizontal },

  // Product Certification & Engineering
  { key: 'broadcast', label: 'Broadcast (Telecom / Radio / Antenna)', icon: Broadcast },
  { key: 'waveform', label: 'Waveform (EMC / Electromagnetic Compatibility)', icon: Waveform },
  { key: 'game-controller', label: 'Game Controller (Toys / Interactive CE)', icon: GameController },
  { key: 'package', label: 'Package (General Product Certification)', icon: Package },

  // Heavy Equipment, Marine & Technical Inspection
  { key: 'crane', label: 'Crane (Construction / Heavy Lifting Tackles)', icon: Crane },
  { key: 'wrench', label: 'Wrench (Installation / Mechanical Maintenance)', icon: Wrench },
  { key: 'factory', label: 'Factory (Manufacturing / Mill Producer)', icon: Factory },
  { key: 'cylinder', label: 'Cylinder (Pressure Vessels)', icon: Cylinder },
  { key: 'equalizer', label: 'Equalizer (Heat Exchangers / Process Columns)', icon: Equalizer },
  { key: 'vault', label: 'Vault (Storage Tanks & Pressure Containment)', icon: Vault },
  { key: 'engine', label: 'Engine (Pumps, Compressors & Turbines)', icon: Engine },
  { key: 'fan', label: 'Fan (HVAC & Ventilation Systems)', icon: Fan },
  { key: 'cpu', label: 'CPU (Instrumentation & Automation)', icon: Cpu },
  { key: 'faders', label: 'Faders (Valves, Actuators & Flow Control)', icon: Faders },
  { key: 'pipe', label: 'Pipe (Piping, Tubing & Pipelines)', icon: Pipe },
  { key: 'nut', label: 'Nut (Flanges, Fittings & Fasteners)', icon: Nut },
  { key: 'gauge', label: 'Gauge (Pressure Equipment & Instruments)', icon: Gauge },
  { key: 'anchor', label: 'Anchor (Offshore & Subsea Equipment / Loading)', icon: Anchor },
  { key: 'barbell', label: 'Barbell (Load Testing / Rigging & Proof Load)', icon: Barbell },
  { key: 'boat', label: 'Boat (Marine Inspection / Offshore)', icon: Boat },
  { key: 'waves', label: 'Waves (Subsea / Marine Environment)', icon: Waves },
  { key: 'scroll', label: 'Scroll (Forming / Raw Materials / Certs)', icon: Scroll },
  { key: 'pen-nib', label: 'Pen Nib (Welding & Fabrication / Torch)', icon: PenNib },
  { key: 'stack', label: 'Stack (Threading / Mill Process Stages)', icon: Stack },
  { key: 'paint-roller', label: 'Paint Roller (Coatings & Surface Protection)', icon: PaintRoller },
  { key: 'timer', label: 'Timer (Expediting / Schedule)', icon: Timer },
  { key: 'clock-countdown', label: 'Clock Countdown (Vendor Expediting)', icon: ClockCountdown },
  { key: 'user-focus', label: 'User Focus (Witnessing & Commissioning)', icon: UserFocus },

  // Specialized Industries
  { key: 'desktop', label: 'Desktop (Technology / Mining Systems)', icon: Desktop },
  { key: 'pill', label: 'Pill (Pharmaceutical & Chemical)', icon: Pill },
  { key: 'map-pin', label: 'Map Pin (Agriculture & Regional Food)', icon: MapPin },
];

/**
 * Unified icon resolution logic.
 * Guarantees that any stored key across all CMS pages (including domain aliases,
 * case differences, and legacy names) resolves to the exact same Phosphor icon
 * rendered on the public website.
 */
export const getPhosphorIconByKey = (
  key: string
): React.ComponentType<{ size?: number; className?: string; weight?: any }> => {
  if (!key) return ShieldCheck;

  const trimmed = key.trim();
  const normalized = trimmed.toLowerCase();
  const stripped = normalized.replace(/[-_\s]/g, '');

  // 1. Direct match in standard options
  const matched = PHOSPHOR_ICON_OPTIONS.find(
    (opt) =>
      opt.key.toLowerCase() === normalized ||
      opt.key.toLowerCase().replace(/[-_\s]/g, '') === stripped
  );
  if (matched) return matched.icon;

  // 2. CBAM Verification specific stored keys & aliases
  if (stripped === 'factory' || stripped === 'producer') return Factory;
  if (stripped === 'emissionsdata' || stripped === 'emissions' || stripped === 'data') return FileText;
  if (stripped === 'independentverification' || stripped === 'verification') return ShieldCheck;
  if (stripped === 'declaration' || stripped === 'eucbamdeclaration') return GlobeHemisphereWest;
  if (stripped === 'datareview' || stripped === 'review') return MagnifyingGlass;
  if (stripped === 'sitevisits' || stripped === 'visits') return Buildings;
  if (stripped === 'verificationreports' || stripped === 'reports') return Certificate;
  if (stripped === 'preverificationvisits' || stripped === 'preverification' || stripped === 'checklist') return ClipboardText;
  if (stripped === 'verifierstatus' || stripped === 'status' || stripped === 'seal') return Certificate;

  // 3. Training & Academy specific stored keys & aliases
  if (stripped === 'globehemispherewest' || stripped === 'globewest' || stripped === 'esg') return GlobeHemisphereWest;
  if (stripped === 'leaf' || stripped === 'plant' || stripped === 'eco') return Leaf;
  if (stripped === 'hardhat' || stripped === 'safety' || stripped === 'helmet') return HardHat;
  if (stripped === 'lifebuoy' || stripped === 'continuity' || stripped === 'rescue') return Lifebuoy;
  if (stripped === 'lock' || stripped === 'lockkey' || stripped === 'security' || stripped === 'cybersecurity') return Lock;
  if (stripped === 'lightning' || stripped === 'bolt' || stripped === 'energy' || stripped === 'power') return Lightning;
  if (stripped === 'scales' || stripped === 'law' || stripped === 'justice' || stripped === 'balance') return Scales;
  if (stripped === 'sealcheck' || stripped === 'badge' || stripped === 'quality') return SealCheck;
  if (stripped === 'flask' || stripped === 'lab' || stripped === 'science' || stripped === 'testing') return Flask;
  if (stripped === 'forkknife' || stripped === 'food' || stripped === 'restaurant' || stripped === 'haccp') return ForkKnife;
  if (stripped === 'shieldcheck' || stripped === 'fssc') return ShieldCheck;
  if (stripped === 'presentation' || stripped === 'classroom' || stripped === 'instructor') return Presentation;
  if (stripped === 'devices' || stripped === 'elearning' || stripped === 'blended' || stripped === 'online') return Devices;
  if (stripped === 'slidershorizontal' || stripped === 'sliders' || stripped === 'inhouse' || stripped === 'custom' || stripped === 'bespoke') return SlidersHorizontal;
  if (stripped === 'graduationcap' || stripped === 'course') return GraduationCap;
  if (stripped === 'book' || stripped === 'bookopen') return BookOpen;

  // 4. Product Certification CE Categories specific stored keys & aliases
  if (stripped === 'broadcast' || stripped === 'telecom' || stripped === 'telecommunications' || stripped === 'antenna' || stripped === 'radio') return Broadcast;
  if (stripped === 'shieldwarning' || stripped === 'atex' || stripped === 'atexequipment' || stripped === 'warning') return ShieldWarning;
  if (stripped === 'waveform' || stripped === 'emc' || stripped === 'electromagnetic' || stripped === 'electromagneticcompatibility' || stripped === 'pulse' || stripped === 'activity') return Waveform;
  if (stripped === 'teddybear' || stripped === 'toys' || stripped === 'toy' || stripped === 'gamecontroller') return GameController;
  if (stripped === 'package') return Package;

  // 5. Inspection specific stored keys & aliases
  if (stripped === 'blueprint' || stripped === 'design') return FileText;
  if (stripped === 'clockcountdown' || stripped === 'countdown' || stripped === 'expediting') return ClockCountdown;
  if (stripped === 'pressurevessels' || stripped === 'pressurevessel' || stripped === 'vessel') return Cylinder;
  if (stripped === 'heatexchanger' || stripped === 'heatexchangers' || stripped === 'columns') return Equalizer;
  if (stripped === 'tank' || stripped === 'tanks' || stripped === 'storagetanks') return Vault;
  if (stripped === 'pump' || stripped === 'pumps' || stripped === 'compressor' || stripped === 'compressors') return Engine;
  if (stripped === 'turbines' || stripped === 'turbine' || stripped === 'hvac') return Fan;
  if (stripped === 'instrument' || stripped === 'instrumentation' || stripped === 'automation') return Cpu;
  if (stripped === 'valves' || stripped === 'valve' || stripped === 'actuator' || stripped === 'actuators') return Faders;
  if (stripped === 'pipes' || stripped === 'piping' || stripped === 'pipelines') return Pipe;
  if (stripped === 'pipingmaterials' || stripped === 'flanges' || stripped === 'fittings' || stripped === 'fasteners') return Nut;
  if (stripped === 'forming' || stripped === 'rawmaterials') return Scroll;
  if (stripped === 'welding' || stripped === 'weld' || stripped === 'torch' || stripped === 'sparkle') return PenNib;
  if (stripped === 'ndt') return MagnifyingGlass;
  if (stripped === 'threading' || stripped === 'thread' || stripped === 'stack') return Stack;
  if (stripped === 'coatings' || stripped === 'coating' || stripped === 'paint') return PaintRoller;
  if (stripped === 'loading' || stripped === 'shipping' || stripped === 'tackles' || stripped === 'subsea') return Anchor;
  if (stripped === 'witnessing' || stripped === 'commissioning' || stripped === 'userfocus') return UserFocus;
  if (stripped === 'loadtesting' || stripped === 'rigging' || stripped === 'load' || stripped === 'barbell') return Barbell;
  if (stripped === 'marine' || stripped === 'ship' || stripped === 'onshoreoffshore' || stripped === 'offshore' || stripped === 'boat') return Boat;

  // 6. About & Industry specific stored keys & aliases
  if (stripped === 'oilgas' || stripped === 'oil' || stripped === 'gas') return ShieldPlus;
  if (stripped === 'power' || stripped === 'energy') return ChatTeardropText;
  if (stripped === 'tech' || stripped === 'technology' || stripped === 'monitor' || stripped === 'desktop' || stripped === 'mining') return Desktop;
  if (stripped === 'construction' || stripped === 'building' || stripped === 'buildings') return Buildings;
  if (stripped === 'chemical' || stripped === 'pharma' || stripped === 'pill') return Pill;
  if (stripped === 'food' || stripped === 'agriculture' || stripped === 'mappin') return MapPin;
  if (stripped === 'engineering') return Gear;
  if (stripped === 'chat' || stripped === 'chatcircletext') return ChatCircleText;
  if (stripped === 'chatcircle') return ChatCircle;
  if (stripped === 'chatdots') return ChatCircleDots;

  // 7. General semantic fallbacks
  if (normalized.includes('crane')) return Crane;
  if (normalized.includes('wrench')) return Wrench;
  if (normalized.includes('factory') || normalized.includes('mill')) return Factory;
  if (normalized.includes('cylinder') || normalized.includes('vessel')) return Cylinder;
  if (normalized.includes('flame') || normalized.includes('boiler')) return Flame;
  if (normalized.includes('engine') || normalized.includes('pump') || normalized.includes('turbine')) return Engine;
  if (normalized.includes('fan') || normalized.includes('hvac')) return Fan;
  if (normalized.includes('cpu') || normalized.includes('chip') || normalized.includes('instrument')) return Cpu;
  if (normalized.includes('pipe')) return Pipe;
  if (normalized.includes('gauge') || normalized.includes('meter')) return Gauge;
  if (normalized.includes('anchor')) return Anchor;
  if (normalized.includes('hat') || normalized.includes('helmet')) return HardHat;
  if (normalized.includes('barbell') || normalized.includes('load')) return Barbell;
  if (normalized.includes('boat') || normalized.includes('ship')) return Boat;
  if (normalized.includes('scroll')) return Scroll;
  if (normalized.includes('weld') || normalized.includes('torch')) return PenNib;
  if (normalized.includes('paint') || normalized.includes('coat')) return PaintRoller;
  if (normalized.includes('timer') || normalized.includes('clock')) return ClockCountdown;
  if (normalized.includes('eye')) return Eye;
  if (normalized.includes('target') || normalized.includes('mission')) return Target;
  if (normalized.includes('shield') || normalized.includes('protect')) return ShieldCheck;
  if (normalized.includes('cert') || normalized.includes('accredit')) return Certificate;
  if (normalized.includes('build') || normalized.includes('office')) return Buildings;
  if (normalized.includes('globe') || normalized.includes('world')) return Globe;
  if (normalized.includes('arrow') || normalized.includes('repeat') || normalized.includes('cycle')) return ArrowsClockwise;
  if (normalized.includes('chat') || normalized.includes('speak') || normalized.includes('talk')) return ChatCircleText;
  if (normalized.includes('scale') || normalized.includes('impartial') || normalized.includes('law')) return Scales;
  if (normalized.includes('grad') || normalized.includes('train') || normalized.includes('educat')) return GraduationCap;

  return ShieldCheck;
};

export interface CMSIconSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options?: IconOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const CMSIconSelect: React.FC<CMSIconSelectProps> = ({
  id,
  label = 'Select Icon',
  value = 'shield',
  onChange,
  options = PHOSPHOR_ICON_OPTIONS,
  error,
  helperText,
  required = false,
  className = '',
}) => {
  const selectId = id || `icon-select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  // Resolve the active icon component using the public website resolution logic
  const ActiveIcon = getPhosphorIconByKey(value);

  // Match the stored value against available options using exact, case-insensitive, stripped, or component equality
  const resolvedOption = React.useMemo(() => {
    if (!value) return options[0];

    // 1. Direct exact key match
    const exact = options.find((opt) => opt.key === value);
    if (exact) return exact;

    const valNorm = value.toLowerCase().trim();
    const valStripped = valNorm.replace(/[-_\s]/g, '');

    // 2. Case-insensitive match
    const caseMatch = options.find((opt) => opt.key.toLowerCase() === valNorm);
    if (caseMatch) return caseMatch;

    // 3. Stripped key match (ignoring hyphens, underscores, spaces)
    const strippedMatch = options.find(
      (opt) => opt.key.toLowerCase().replace(/[-_\s]/g, '') === valStripped
    );
    if (strippedMatch) return strippedMatch;

    // 4. Component equality match
    const compMatch = options.find((opt) => opt.icon === ActiveIcon);
    if (compMatch) return compMatch;

    return null;
  }, [value, options, ActiveIcon]);

  // Selected value to bind to the HTML <select>
  const selectedKey = resolvedOption ? resolvedOption.key : value;

  // Build the option list, ensuring any existing unlisted value is represented
  const renderedOptions = React.useMemo(() => {
    if (!resolvedOption && value) {
      // Add existing custom/legacy value so <select> displays it accurately
      return [
        {
          key: value,
          label: `${value} (Current Stored Icon)`,
          icon: ActiveIcon,
        },
        ...options,
      ];
    }
    return options;
  }, [options, resolvedOption, value, ActiveIcon]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-[#B42318]">*</span>}
        </label>
      </div>

      {helperText && (
        <p className="text-[11px] text-[#64748B]">{helperText}</p>
      )}

      <div className="flex items-center gap-3">
        {/* Visual Icon Live Preview Badge - always shows resolved public icon */}
        <div
          className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#082046] shadow-2xs shrink-0"
          title={`Selected: ${value} -> ${resolvedOption ? resolvedOption.label : value}`}
        >
          <ActiveIcon size={20} weight="regular" />
        </div>

        {/* Dropdown Menu */}
        <div className="flex-1 min-w-0">
          <select
            id={selectId}
            value={selectedKey}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
              error
                ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
            }`}
          >
            {renderedOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label} ({opt.key})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#B42318] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

