// import { CounterModel, CounterState } from './counterModel.js';
import { SocModel, SocModelState, SimulationConfig, AttributeState } from './game/socModel.js';

// document.getElementById("paramFormCounter")?.addEventListener("submit", async function (e) {
//   e.preventDefault();


//   const initValue = parseFloat((document.getElementById("initValueCounter") as HTMLInputElement).value);
//   const step = parseFloat((document.getElementById("stepCounter") as HTMLInputElement).value);
//   const rounds = parseInt((document.getElementById("roundsCounter") as HTMLInputElement).value, 10);
//   const tbody = document.getElementById("resultTableCounter")?.querySelector("tbody");

//   if (!tbody || isNaN(initValue) || isNaN(step) || isNaN(rounds)) return;

//   tbody.innerHTML = "";

//   const initialState = new CounterState(initValue);
//   const model = new CounterModel(initialState, step);

//   await model.simulateWithHistory(
//     (state) => state.round < rounds,
//     async (state) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `<td>${state.round}</td><td>${state.value.toFixed(2)}</td>`;
//       tbody.appendChild(row);

//       // Small delay to allow rendering
//       await new Promise(resolve => setTimeout(resolve, 10));
//     }
//   );
// });

async function loadConfig(): Promise<SimulationConfig> {
  const response = await fetch('socModelConfig.json');
  if (!response.ok) {
    throw new Error(`Failed to load config: ${response.statusText}`);
  }
  return response.json();
}

function createAtttrInput(attr: string, val: number): string {
  return `<td><input type="number" min="-3" max="3" step="0.01" id="${attr}Init" value="${val}"></td>`;
}

function initInitialSoc(config: SimulationConfig, socModelState: SocModelState) {
  const thead = document.getElementById("initTableSoc")?.querySelector("thead");
  const tbody = document.getElementById("initTableSoc")?.querySelector("tbody");
  if (!thead || !tbody) return;

  {
    const row = document.createElement("tr");
    row.innerHTML = `<th>${config.confidenceLablel}</th>`;
    socModelState.attributes.forEach(attr => {
      row.innerHTML += `<th>${attr.name}</th>`;
    });
    thead.replaceChildren();
    thead.appendChild(row);
  }
  {
    const row = document.createElement("tr");
    row.innerHTML = createAtttrInput("confidence", socModelState.confidence);
    socModelState.attributes.forEach(attr => {
      console.log("attr:", attr);
      row.innerHTML += createAtttrInput(attr.name, attr.value);
    });
    tbody.replaceChildren();
    tbody.appendChild(row);
  }
}
function initResultsSoc(config: SimulationConfig, socModelState: SocModelState) {
  const thead = document.getElementById("resultTableSoc")?.querySelector("thead");
  const tbody = document.getElementById("resultTableSoc")?.querySelector("tbody");
  if (!thead || !tbody) return;

  {
    const row = document.createElement("tr");
    row.innerHTML = `<th>Round</th><th>${config.confidenceLablel}</th>`;
    socModelState.attributes.forEach(attr => {
      row.innerHTML += `<th>${attr.name}</th>`;
    });
    thead.replaceChildren();
    thead.appendChild(row);
  }
  {
    tbody.replaceChildren();
  }
}

function findAttrInitValue(attrName: string): number {
  return parseFloat((document.getElementById(`${attrName}Init`) as HTMLInputElement).value)
}
async function runSocModel(e: SubmitEvent): Promise<void> {
  e.preventDefault();

  if (!config) {
    console.error("Config not loaded");
    return;
  }
  const rounds = parseInt((document.getElementById("roundsSoc") as HTMLInputElement).value, 10);

  const socModelState: SocModelState = new SocModelState(config.attributes.map((attr) => {
    return { name: attr, value: findAttrInitValue(attr), lastChange: null }
  }), findAttrInitValue("confidence"));

  const tbody = document.getElementById("resultTableSoc")?.querySelector("tbody");
  if (!tbody || isNaN(rounds)) {
    console.error("Invalid input values");
    return;
  };
  tbody.replaceChildren();

  const model = new SocModel(socModelState, config);

  await model.simulateWithHistory(
    (state) => state.round < rounds,
    async (state) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${state.round}</td><td>${state.confidence}</td>`;
      state.attributes.forEach(attr => {
        row.innerHTML += `<td>${attr.value.toFixed(2)}</td>`;
      });
      tbody.appendChild(row);

      // Small delay to allow rendering
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  );

  return;
}

let config: SimulationConfig | null = null;
try {
  config = await loadConfig();
  console.log('Loaded config:', config);
} catch (err) {
  console.error('Error loading config:', err);
}
if (config) {
  document.getElementById("roundsSoc")?.setAttribute("value", "50");
  const socModelState: SocModelState = new SocModelState(config.attributes.map((attr, index) => {
    //return { name: attr, value: index%3+1, lastChange: null } // pokusne, aby bylo videte ze se projevi
    return { name: attr, value: 3, lastChange: null }
  }), 3);

  initInitialSoc(config, socModelState);
  initResultsSoc(config, socModelState);
}

document.getElementById("paramFormSoc")?.addEventListener("submit", async function (e) { runSocModel(e); });


