import { useMemo, useState } from "react";
import Sidebar from "../components/NavBar/NavBar.tsx";
import TopBar from "../components/TopBar/TopBar.tsx";
import "./WardrobePage.css";
import { useNavigate } from "react-router-dom";

interface WardrobeItem {
  id: number;
  name: string;
  type: "top" | "bottom" | "other";
  favorite?: boolean;
  icon: string; // hard coded icon (emoji)
}

// hard coded data, using emoji right now
const initialItems: WardrobeItem[] = [
  { id: 1, name: "Red Tee", type: "top", icon: "👕" },
  { id: 2, name: "Light Jacket", type: "top", icon: "🧥" },
  { id: 3, name: "Green Sweater", type: "top", icon: "🧶" },
  { id: 4, name: "White Pants", type: "bottom", icon: "👖" },
  { id: 5, name: "Black Shorts", type: "bottom", icon: "🩳" },
  { id: 6, name: "Sunglasses", type: "other", icon: "🕶️" },
  { id: 7, name: "Sunglasses", type: "other", icon: "🕶️" },
  { id: 8, name: "Sunglasses", type: "other", icon: "🕶️" },
  { id: 9, name: "Sunglasses", type: "other", icon: "🕶️" },
  { id: 10, name: "Sunglasses", type: "other", icon: "🕶️" }
];

export default function WardrobePage() {
  // Wardrobe: pure frontend state
  const navigate = useNavigate();
  const [items, setItems] = useState<WardrobeItem[]>(initialItems);
  const [units, setUnits] = useState<"metric" | "imperial">("imperial");

  // TEMP location state for Wardrobe page only.
  // NOTE: This is intentionally local; will be extracted to a shared hook in a future PR.
  const [locationName, setLocationName] = useState<string>("Alexandria, VA");
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // TopBar handlers
  const handleUnitChange = (u: "metric" | "imperial") => setUnits(u);
  const handleSearch = (q: string) => {
    // For now, just update the displayed text. No API call here.
    const next = q.trim();
    if (next) setLocationName(next);
  };

  // Wardrobe actions
  const toggleFavorite = (id: number) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
  const removeItem = (id: number) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const categories = useMemo(
    () =>
      [
        { label: "TOP", type: "top" as const },
        { label: "BOTTOM", type: "bottom" as const },
        { label: "OTHERS", type: "other" as const },
      ] as const,
    []
  );

  return (
    <div className="homepage-container">{/* reuse HomePage shell */}
      <Sidebar />
      <div className="main-content">
        <TopBar
          locationName={locationName}
          error={error}
          isLoading={isLoading}
          currentUnit={units}
          onUnitChange={handleUnitChange}
          onSearch={handleSearch}
        />

        <div className="main-sections">
          <div className="wardrobe-page">
            {categories.map(cat => {
              const catItems = items.filter(i => i.type === cat.type);

              // always render 4 slots; "+" placeholders for empty slots
              const slots: (WardrobeItem | { id: number; icon: string })[] = [...catItems];
              while (slots.length % 4 !== 0) {
                slots.push({ id: -1000 - slots.length, icon: "+" });
              }

              return (
                <section key={cat.type} className="wardrobe-section">
                  <div className="wardrobe-section-header">{cat.label}</div>
                  <div className="wardrobe-grid">
                    {slots.map(slot =>
                      slot.id > 0 ? (
                        <div key={slot.id} className="wardrobe-card">
                          <div className="wardrobe-icon">{slot.icon}</div>
                          <div className="wardrobe-name">{(slot as WardrobeItem).name}</div>
                          <div className="wardrobe-actions">
                            <button className="btn edit" onClick={() => navigate(`/edit/${slot.id}`)}>Edit</button>
                            <button className="btn remove" onClick={() => removeItem(slot.id)}>Remove</button>
                            <button
                              className={`btn fav ${(slot as WardrobeItem).favorite ? "on" : ""}`}
                              onClick={() => toggleFavorite(slot.id)}
                              title="Favorite"
                            >
                              ★
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={slot.id} className="wardrobe-card empty">
                          <div className="wardrobe-plus">+</div>
                        </div>
                      )
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}