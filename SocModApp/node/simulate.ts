import { SocModel, SocModelState } from '../src/game/socModel.js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("directory:", __dirname);
  console.log("current working directory:", process.cwd());

  // Load config from public/socModelConfig.json
  const configPath = path.resolve(__dirname, '../public/socModelConfig.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Prepare initial state
  const initialAttributes = config.attributes.map((name: string) => ({
    name,
    value: 0,
    lastChange: null
  }));
  const initialConfidence = 0;
  const initialState = new SocModelState(initialAttributes, initialConfidence);

  const model = new SocModel(initialState, config);

  const rounds = 5;
  const history = await model.simulateWithHistory(
    state => state.round < rounds,
    state => {
      const attrs = state.attributes.map(a => `${a.name}: ${a.value.toFixed(2)}`).join(', ');
      console.log(`Round ${state.round} | Confidence: ${state.confidence} | ${attrs}`);
    }
  );

  console.log("Simulation finished. Final state:", history.at(-1));
}

main().catch(err => {
  console.error("Simulation failed:", err);
});
