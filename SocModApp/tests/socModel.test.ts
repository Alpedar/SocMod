import { describe, it, expect } from 'vitest';
import { CounterModel, CounterState } from '../src/counterModel.js';
import { SocModel, SocModelState } from '../src/game/socModel.js';
import { readFileSync } from 'fs';
import * as path from 'path';
import { log } from 'console';


describe('SocModel.simulateWithHistory', () => {
  console.log("directory:", __dirname);
  console.log("current working directory:", process.cwd());
  const filePath = path.resolve(__dirname, '../public/socModelConfig.json')
  const content = readFileSync(filePath, 'utf-8')
  const config = JSON.parse(content);
  it('should produce correct number of rounds', async () => {
    const model = new SocModel(new SocModelState([
      { name: 'economy', value: 0, lastChange: null },
      { name: 'happiness', value: 0, lastChange: null }
    ],3), config, () => 0.5); //misto volani random vracim 0.5, lepsi by bylo pouzit nejaky seedovany prng

    const result = await model.simulateWithHistory(state => state.round < 5);
    expect(result.length).toBe(6); // includes round 0
    console.log("Simulation history:", result.map(s => `Round ${s.round}: confidence: ${s.confidence} ${s.attributes.map(a => `${a.name}: ${a.value.toFixed(2)}`).join(', ')}`));
  });
  expect(content).toHaveLength(1457);
});

// describe('CounterModel.simulateWithHistory', () => {
//   it('should produce correct number of rounds', async () => {
//     const model = new CounterModel(new CounterState(0), 1);
//     const result = await model.simulateWithHistory(state => state.round < 5);
//     expect(result.length).toBe(6); // includes round 0
//   });

//   it('should increment value correctly', async () => {
//     const model = new CounterModel(new CounterState(0), 0.5);
//     const result = await model.simulateWithHistory(state => state.round < 3);

//     expect(result[0].value).toBeCloseTo(0);            // round 0
//     expect(result[1].value).toBeCloseTo(0 + 0.5);       // round 1
//     expect(result[2].value).toBeCloseTo(0 + 0.5 * 2);   // round 2
//     expect(result[3].value).toBeCloseTo(0 + 0.5 * 3);   // round 3
//   });

//   it.each([
//     [0, 0, 1],
//     [1, 2, 3],
//     [5, 0, 1],
//     [5, 3, 4],
//   ])(
//     'initialValue=%i, rounds=%i → expected length=%i',
//     async (initialValue, rounds, expectedLength) => {
//       const model = new CounterModel(new CounterState(initialValue), 1);
//       const result = await model.simulateWithHistory(state => state.round < rounds);
//       expect(result.length).toBe(expectedLength);
//     }
//   );
// });
