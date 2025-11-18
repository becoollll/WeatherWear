import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/NavBar/NavBar.tsx";
import TopBar from "../components/TopBar/TopBar.tsx";
import "./WardrobePage.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface WardrobeItem {
    id: number;
    clothing_type: string;
    type: "top" | "bottom" | "other";
    image_url?: string;
    favorited?: boolean;
}

export default function WardrobePage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [units, setUnits] = useState<"metric" | "imperial">("imperial");

    const [locationName, setLocationName] = useState<string>("Alexandria, VA");
    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState<string | null>(null);

    // TopBar Handlers
    const handleUnitChange = (u: "metric" | "imperial") => setUnits(u);
    const handleSearch = (q: string) => {
        const next = q.trim();
        if (next) setLocationName(next);
    };

    // Fetch wardrobe items from Supabase
    useEffect(() => {
        const fetchWardrobe = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from("personal-wardrobe")
                .select("*");

            if (error) {
                console.error("❌ Error fetching wardrobe:", error);
            } else {
                console.log("👕 Loaded wardrobe:", data);
                setItems(data as WardrobeItem[]);
            }

            setIsLoading(false);
        };

        fetchWardrobe();
        console.log("Fetching wardrobe...");
        console.log("Table: personal-wardrobe");
    }, []);


    // Wardrobe actions
    // Broken? Can toggle on, cannot toggle off
    const toggleFavorite = async (id: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const newFavorited = !item.favorited;
        console.log("Toggling id:", id, "from", item.favorited, "to", newFavorited);

        const { data, error } = await supabase
            .from("personal-wardrobe")
            .update({ favorited: Boolean(newFavorited) })
            .eq("id", id) // or id.toString() if DB id is text
            .select();

        if (error) {
            console.error("Supabase update failed:", error.message);
        } else {
            console.log("Supabase update success:", data);
            setItems(prev =>
                prev.map(i => i.id === id ? { ...i, favorited: newFavorited } : i)
            );
        }
    };
    // Removes from database (needs to add confirmation)
    const removeItem = async (id: number) => {
        const { error } = await supabase
            .from("personal-wardrobe")
            .delete()
            .eq("id", id);

        if (!error) {
            setItems(prev => prev.filter(i => i.id !== id));
        }
    };

    // CATEGORY CONFIG
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
        <div className="homepage-container">
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

                        // ensure at least 4 slots so the user always sees + buttons
                            const minSlots = 4;
                            const slots: (WardrobeItem | { id: number; empty: true })[] =
                                catItems.length > 0 ? [...catItems] : [];

                            while (slots.length < minSlots || slots.length % 4 !== 0) {
                                slots.push({ id: -1000 - slots.length, empty: true });
                            }

                            return (
                                <section key={cat.type} className="wardrobe-section">
                                    <div className="wardrobe-section-header">{cat.label}</div>

                                    <div className="wardrobe-grid">
                                        {slots.map(slot =>
                                            "empty" in slot ? (
                                                <div key={slot.id} className="wardrobe-card empty">
                                                    <div className="wardrobe-plus">+</div>
                                                </div>
                                            ) : (
                                                <div key={slot.id} className="wardrobe-card">
                                                    <img
                                                        src={slot.image_url || "/placeholder.png"}
                                                        alt={slot.clothing_type}
                                                        className="wardrobe-image"
                                                    />

                                                    <div className="wardrobe-name">{slot.clothing_type}</div>

                                                    <div className="wardrobe-actions">
                                                        <button
                                                            className="btn edit"
                                                            onClick={() => navigate(`/edit/${slot.id}`)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn remove"
                                                            onClick={() => removeItem(slot.id)}
                                                        >
                                                            Remove
                                                        </button>

                                                        <button

                                                            className={`btn fav ${slot.favorited ? "on" : ""}`}

                                                            onClick={() => {
                                                                console.log("Current favorited value:", slot.favorited);
                                                                toggleFavorite(slot.id);
                                                                console.log("Updating id:", slot.id);
                                                            }}
                                                        >
                                                            ★
                                                        </button>
                                                    </div>
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
