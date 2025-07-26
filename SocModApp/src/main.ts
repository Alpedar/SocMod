import { CounterModel, CounterState } from './counterModel';

document.getElementById("paramForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const initValue = parseFloat((document.getElementById("initValue") as HTMLInputElement).value);
  const step = parseFloat((document.getElementById("step") as HTMLInputElement).value);
  const rounds = parseInt((document.getElementById("rounds") as HTMLInputElement).value, 10);
  const tbody = document.getElementById("resultTable")?.querySelector("tbody");

  if (!tbody || isNaN(initValue) || isNaN(step) || isNaN(rounds)) return;

  tbody.innerHTML = "";

  const initialState = new CounterState(initValue);
  const model = new CounterModel(initialState, step);

  await model.simulateWithHistory(
    (state) => state.round < rounds,
    async (state) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${state.round}</td><td>${state.value.toFixed(2)}</td>`;
      tbody.appendChild(row);

      // Small delay to allow rendering
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  );
});
