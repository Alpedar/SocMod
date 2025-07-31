import { Model, ModelState } from '../abstractModel.js';

// Define a type for event names
export type EventType = string;

export type SpecialEventEnum = "NONE" | "CHANGE" | "REVERT";

// Example: Event configuration structure
export interface EventConfig {
  name: EventType;
  special: SpecialEventEnum;
  confidenceChange: number;
  attributeChange: number;
  probabilities: Record<number, number>; // confidence level -> probability
}

export type SignProbabilityTable = Record<number, number>; // e.g. { -3: 0.1, ..., 3: 0.9 }

export interface SimulationConfig {
  events: EventConfig[];
  attributes: AttributeName[];
  confidenceLablel: string; // Label for confidence attribute in UI
  signProbabilities: SignProbabilityTable; // shared for all attributes
}

// Define a type for attribute names
export type AttributeName = string;

// Example: Attribute state
export interface AttributeState {
  name: AttributeName; // e.g., "economy", "stability"
  value: number; // Current value of the attribute
  lastChange: number | null; // Last change applied to this attribute
}

export class SocModelState extends ModelState {
  attributes: AttributeState[] = [];
  confidence: number = 0;

  constructor(attributes: AttributeState[], confidence: number) {
    super();
    this.attributes = attributes;
    this.confidence = confidence;
  }
}

export class SocModel extends Model<SocModelState> {
  constructor(
    public readonly initialState: SocModelState,
    private config: SimulationConfig,
    private randomFn: () => number = Math.random // Default to Math.random if no function is provided
  ) {
    super(initialState);
    this.validateConfig(config); // Validate configuration on construction
  }

  update(state: SocModelState): SocModelState {
    // Clone the current state to avoid mutating it directly
    const nextState = structuredClone(state);

    // We want all attribute changes to be applied with the same confidence
    const confidence = nextState.confidence;

    // Loop all attributes and apply changes
    nextState.attributes.forEach(attr => {
      const event = this.selectRandomEvent(confidence, attr);
      this.applyEvent(nextState, event, attr.name);
    });
    return nextState;
  }

  private selectRandomEvent(confidence: number, attr: AttributeState): EventConfig {
    const roundedConfidence = Math.round(confidence);

    const isEventValid = (event: EventConfig): boolean => {
      const prob = event.probabilities[roundedConfidence] || 0;
      if (prob <= 0) return false;
      if (event.special === "REVERT" && attr.lastChange === null) return false;
      return true;
    };

    const validEvents = this.config.events.filter(isEventValid);

    const totalWeight = validEvents.reduce(
      (sum, event) => sum + (event.probabilities[roundedConfidence] || 0),
      0
    );
    if (totalWeight === 0) throw new Error("No valid events available for selection");

    const random = this.randomFn() * totalWeight;
    let cumulative = 0;
    for (const event of validEvents) {
      cumulative += event.probabilities[roundedConfidence] || 0;
      if (random <= cumulative) {
        return event;
      }
    }

    throw new Error("Failed to select an event");
  }

  private getChangeSign(attr: AttributeState): number {
    const roundedValue = Math.round(attr.value);
    const probNegative = this.config.signProbabilities[roundedValue] ?? 0.5;
    return this.randomFn() < probNegative ? -1 : 1;
  }

  // Helper function to clamp a value between min and max
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  applyEvent(state: SocModelState, event: EventConfig, attributeName: AttributeName): SocModelState {
    const attribute = state.attributes.find(attr => attr.name === attributeName);
    if (!attribute) throw new Error(`Attribute ${attributeName} not found`);

    switch (event.special) {
      case "REVERT":
        if (attribute.lastChange !== null) {
          attribute.value = this.clamp(attribute.value - attribute.lastChange, -3, 3);
          attribute.lastChange = null;
        }
        break;
      case "CHANGE": {
        let change = event.attributeChange * this.getChangeSign(attribute);
        attribute.value = this.clamp(attribute.value + change, -3, 3);
        attribute.lastChange = change;
        break;
      }
      case "NONE":
      default:
        // No attribute change, but still apply confidence change
        break;
    }

    state.confidence = this.clamp(state.confidence + event.confidenceChange, -3, 3);
    return state;
  }

  validateConfig(config: SimulationConfig): void {
    // Check for duplicate event names
    const eventNames = config.events.map(event => event.name);
    const uniqueEventNames = new Set(eventNames);
    if (eventNames.length !== uniqueEventNames.size) {
      throw new Error("Duplicate event names found in configuration");
    }

    // Check for duplicate attribute names
    const attrNames = config.attributes;
    const uniqueAttrNames = new Set(attrNames);
    if (attrNames.length !== uniqueAttrNames.size) {
      throw new Error("Duplicate attribute names found in configuration");
    }

    // Check signProbabilities keys
    for (const key of Object.keys(config.signProbabilities)) {
      const numKey = Number(key);
      if (!Number.isInteger(numKey) || numKey < -3 || numKey > 3) {
        throw new Error(`Invalid signProbabilities key: ${key}. Must be integer between -3 and 3.`);
      }
      const prob = config.signProbabilities[numKey];
      if (typeof prob !== "number" || prob < 0 || prob > 1) {
        throw new Error(`Invalid signProbabilities value for ${key}: must be a number between 0 and 1.`);
      }
    }

    // Check event probabilities keys
    for (const event of config.events) {
      for (const key of Object.keys(event.probabilities)) {
        const numKey = Number(key);
        if (!Number.isInteger(numKey) || numKey < -3 || numKey > 3) {
          throw new Error(`Invalid probability key for event '${event.name}': ${key}. Must be integer between -3 and 3.`);
        }
        const prob = event.probabilities[numKey];
        if (typeof prob !== "number" || prob < 0) {
          throw new Error(`Invalid probability value for event '${event.name}' at ${key}: must be a non-negative number.`);
        }
      }
    }
  }
}

