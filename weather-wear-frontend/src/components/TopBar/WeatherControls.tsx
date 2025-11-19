import { useState } from "react";
import search from "./magnifying-glass.png";
import locationIcon from "./Vector-5.png";
import "./TopBar.css";

interface WeatherControlsProps {
  locationName: string | null;
  error: string | null;
  isLoading: boolean;
  currentUnit: "metric" | "imperial";
  onUnitChange: (unit: "metric" | "imperial") => void;
  onSearch: (location: string) => void;
}

export default function WeatherControls({
  locationName,
  error,
  isLoading,
  currentUnit,
  onUnitChange,
  onSearch,
}: WeatherControlsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleToggle = () => {
    const newUnit = currentUnit === "metric" ? "imperial" : "metric";
    onUnitChange(newUnit);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    onSearch(inputValue);
    setInputValue("");
  };

  return (
    <>
      <nav className="topbar-nav">
        <form className="location-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g., Alexandria, VA or 22305"
            className="location-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="location-button">
            <img src={search} alt="Search" className="search-icon" />
          </button>
        </form>

        <div className="current-location">
          <img src={locationIcon} alt="Location" className="location-icon" />
          <span className="location-name">
            {isLoading ? "Loading..." : error || locationName}
          </span>
        </div>
      </nav>

      <div className="unit-toggle" onClick={handleToggle}>
        <span className={currentUnit === "imperial" ? "active" : ""}>°F</span>
        <span className="toggle-divider">/</span>
        <span className={currentUnit === "metric" ? "active" : ""}>°C</span>
      </div>
    </>
  );
}