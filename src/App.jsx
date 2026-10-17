import { useState, useEffect } from "react";
import StateInfo from "./Components/StateInfo";
import "./App.css";

const SMALL_MAX = 2000000;
const MEDIUM_MAX = 8000000;

const getPopulation = (state) =>
  parseInt(state.population.replaceAll(",", ""));

const getSize = (state) => {
  const pop = getPopulation(state);
  if (pop < SMALL_MAX) return "small";
  if (pop < MEDIUM_MAX) return "medium";
  return "large";
};

function App() {
  const [states, setStates] = useState([]);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("https://api.sampleapis.com/thestates/the-states");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const filteredStates = states.filter((state) => {
    const matchesSearch = state.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize = sizeFilter === "all" || getSize(state) === sizeFilter;
    return matchesSearch && matchesSize;
  });

  const totalShown = filteredStates.length;

  const totalPopulation = filteredStates.reduce(
    (sum, state) => sum + getPopulation(state), 0
  );

  const averagePopulation =
    totalShown > 0 ? Math.round(totalPopulation / totalShown) : 0;

  const largestState = totalShown > 0
    ? filteredStates.reduce((biggest, state) =>
        getPopulation(state) > getPopulation(biggest) ? state : biggest
      )
    : null;

  const smallestState = totalShown > 0
    ? filteredStates.reduce((smallest, state) =>
        getPopulation(state) < getPopulation(smallest) ? state : smallest
      )
    : null;

  return (
    <div className="whole-page">
      <h1>US States Dashboard</h1>

      <div className="stats">
        <p>States shown: {totalShown}</p>
        <p>Average population: {averagePopulation.toLocaleString()}</p>
        <p>Largest state: {largestState ? largestState.name : "N/A"}</p>
        <p>Smallest state: {smallestState ? smallestState.name : "N/A"}</p>
      </div>

      <div className="controls">
        <input 
          type="text"
          placeholder="Search by state name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by state name"
        />

        <select 
          value={sizeFilter} 
          onChange={(e) => setSizeFilter(e.target.value)}
          aria-label="Filter states by population size"
        >
          <option value="all">All sizes</option>
          <option value="small">Small (under {SMALL_MAX / 1000000}M)</option>
          <option value="medium">Medium ({SMALL_MAX / 1000000}M to {MEDIUM_MAX / 1000000}M)</option>
          <option value="large">Large (over {MEDIUM_MAX / 1000000}M)</option>
        </select>
      </div>

      {states.length > 0 && totalShown === 0 && (
        <p className="no-match">No states match your search.</p>
      )}

      {filteredStates.map((state) => (
        <StateInfo
          key={state.id}
          flag={state.flag}
          name={state.name}
          capital={state.capital}
          population={getPopulation(state).toLocaleString()}
        />
      ))}
    </div>
  );
}

export default App;