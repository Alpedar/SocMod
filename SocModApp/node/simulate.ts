import { CounterModel, CounterState } from '../src/counterModel';

async function main() {
  const initialValue = 2;
  const step = 1;
  const rounds = 5;

  const model = new CounterModel(new CounterState(initialValue), step);

  const history = await model.simulateWithHistory(
    state => state.round < rounds,
    state => {
      console.log(`Round ${state.round}: ${state.value.toFixed(2)}`);
    }
  );

  console.log("Simulation finished. Final value:", history.at(-1)?.value);
}

main().catch(err => {
  console.error("Simulation failed:", err);
});
