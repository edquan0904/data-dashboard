import { useState, useEffect } from "react";
import StateInfo from "./Components/StateInfo";
import "./App.css";

const SMALL_MAX = 2000000;
const MEDIUM_MAX = 8000000;
const SLIDER_MAX = 40000000;
const YEAR_MIN = 1787;
const YEAR_MAX = 1959;

const getPopulation = (state) =>
  parseInt(state.population.replaceAll(",", ""));

const getSize = (state) => {
  const pop = getPopulation(state);
  if (pop < SMALL_MAX) return "small";
  if (pop < MEDIUM_MAX) return "medium";
  return "large";
};

const getYear = (state) =>
  parseInt(state.admitted_to_union.trim().slice(-4));

const getCentury = (state) =>
  Math.floor(getYear(state) / 100) * 100;

function App() {
  const [states, setStates] = useState([]);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [minPop, setMinPop] = useState("");
  const [maxPop, setMaxPop] = useState("");
  const [centuryFilter, setCenturyFilter] = useState("all");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

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
    const pop = getPopulation(state);
    const matchesMin = minPop === "" || pop >= Number(minPop);
    const matchesMax = maxPop === "" || pop <= Number(maxPop);
    const matchesCentury =
      centuryFilter === "all" || getCentury(state) === Number(centuryFilter);
    const matchesMinYear = minYear === "" || getYear(state) >= Number(minYear);
    const matchesMaxYear = maxYear === "" || getYear(state) <= Number(maxYear);
    
    return matchesSearch && matchesSize && matchesMin && matchesMax && matchesCentury && matchesMinYear && matchesMaxYear;
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

  const handleReset = () => {
    setSearch("");
    setMinPop("");
    setMaxPop("");
    setSizeFilter("all");
    setCenturyFilter("all");
    setMinYear("");
    setMaxYear("");
  };

  const isMinPopGreaterThanMax =
    minPop !== "" && maxPop !== "" && Number(minPop) > Number(maxPop);

  const isMinYearGreaterThanMax =
    minYear !== "" && maxYear !== "" && Number(minYear) > Number(maxYear);

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
        <button onClick={handleReset} className="reset-btn">
          Reset Filters
        </button>
      </div>

      <div className="controls">
        <input
          type="number"
          min={0}
          placeholder="Min population"
          value={minPop}
          onChange={(e) => {
            if (!e.target.value.includes("-")) setMinPop(e.target.value);
          }}
          aria-label="Minimum population"
        />

        <input
          type="number"
          min={0}
          placeholder="Max population"
          value={maxPop}
          onChange={(e) => {
            if (!e.target.value.includes("-")) setMaxPop(e.target.value);
          }}
          aria-label="Maximum population"
        />

        <div className="slider-group">
          <label htmlFor="pop-slider">
            Max Pop: {maxPop === "" ? "No limit" : Number(maxPop).toLocaleString()}
          </label>
          <input
            id="pop-slider"
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={500000}
            value={maxPop === "" ? SLIDER_MAX : maxPop}
            onChange={(e) => setMaxPop(Number(e.target.value) === SLIDER_MAX ? "" : e.target.value)}
          />
        </div>

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

      <div className="controls">
        <input
          type="number"
          min={0}
          placeholder="Min year"
          value={minYear}
          onChange={(e) => {
            if (!e.target.value.includes("-")) setMinYear(e.target.value);
          }}
          aria-label="Minimum admission year"
        />

        <input
          type="number"
          min={0}
          placeholder="Max year"
          value={maxYear}
          onChange={(e) => {
            if (!e.target.value.includes("-")) setMaxYear(e.target.value);
          }}
          aria-label="Maximum admission year"
        />

        <div className="slider-group">
          <label htmlFor="year-slider">
            Admitted by: {maxYear === "" ? "Any year" : maxYear}
          </label>
          <input
            id="year-slider"
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={maxYear === "" ? YEAR_MAX : maxYear}
            onChange={(e) => setMaxYear(Number(e.target.value) === YEAR_MAX ? "" : e.target.value)}
          />
        </div>

        <select
          value={centuryFilter}
          onChange={(e) => setCenturyFilter(e.target.value)}
          aria-label="Filter states by century admitted"
        >
          <option value="all">All centuries</option>
          <option value="1700">1700s</option>
          <option value="1800">1800s</option>
          <option value="1900">1900s</option>
        </select>
      </div>
      
      {states.length > 0 && totalShown === 0 && (
        <p className="no-match">
          {isMinPopGreaterThanMax
            ? "Minimum population cannot be greater than maximum population."
            : isMinYearGreaterThanMax
            ? "Minimum year cannot be greater than maximum year."
            : "No states match your search."
            }
        </p>
      )}

      {filteredStates.map((state) => (
        <StateInfo
          key={state.id}
          flag={state.flag}
          name={state.name}
          capital={state.capital}
          year={getYear(state)}
          population={getPopulation(state).toLocaleString()}
        />
      ))}
    </div>
  );
}

export default App;