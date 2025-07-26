export abstract class ModelState {
  round: number = 0;

  // /**
  //  * Creates a deep copy of the current state instance.
  //  * Uses JSON serialization — works best with flat, plain objects.
  //  * 
  //  * @returns A new instance of the same concrete type as the current object.
  //  */
  // clone(): this {
  //   //lepsi verze, mela by byt dostupna v modernich prohlizecich a Node 17+
  //   return structuredClone(this);
  //   //starsi ne tak dobry zpusob, mnohdy staci
  //   //return JSON.parse(JSON.stringify(this));
  // }
}


export abstract class Model<S extends ModelState> {
  constructor(public readonly initialState: S) {}

  // Must be implemented by subclasses
  abstract update(state: S): S;

  async simulate(
    shouldContinue: (state: S) => boolean,
    onStep?: (state: S) => Promise<void> | void,
    signal?: AbortSignal
  ): Promise<S> {
    if (signal?.aborted) throw new AbortError("Simulation aborted");

    let state = structuredClone(this.initialState);//this.initialState.clone();
    state.round = 0;

    await onStep?.(state);

    while (shouldContinue(state)) {
      if (signal?.aborted) throw new AbortError("Simulation aborted");

      const next = this.update(state);
      next.round = state.round + 1;
      state = next;

      await onStep?.(state);
    }

    return state;
  }

  /**
   * Runs a simulation and collects all steps in order.
   * Also supports optional live observation via `onStep`.
   * 
   * @param shouldContinue - Loop exit condition
   * @param onStep - Optional per-step side effect (e.g. UI update, logging)
   * @param signal - Optional AbortSignal to allow external cancellation
   * @returns Promise that resolves to an array of all states visited during simulation
   */
  async simulateWithHistory(
    shouldContinue: (state: S) => boolean,
    onStep?: (state: S) => Promise<void> | void,
    signal?: AbortSignal
  ): Promise<S[]> {
    const history: S[] = [];

    const callback = async (state: S) => {
      if (signal?.aborted) throw new AbortError("Simulation aborted");
      history.push(state);
      await onStep?.(state);
    };

    await this.simulate(shouldContinue, callback, signal);

    return history;
  }
}

/**
 * Optional custom AbortError to differentiate from other failures.
 */
export class AbortError extends Error {
  constructor(message = "Aborted") {
    super(message);
    this.name = "AbortError";
  }
}
