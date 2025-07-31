import { Model, ModelState } from "./abstractModel.js";

/**
 * Represents the state of a simple counter.
 */
export class CounterState extends ModelState {
  value: number;

  constructor(value: number = 0) {
    super();
    this.value = value;
  }

}

/**
 * Simple counter model that increments `value` by a fixed step each round.
 */
export class CounterModel extends Model<CounterState> {
  constructor(initialState: CounterState, private readonly step: number) {
    super(initialState);
  }

  update(state: CounterState): CounterState {
    
    const next = structuredClone(state);//state.clone();
    next.value += this.step;
    return next;
  }
}
