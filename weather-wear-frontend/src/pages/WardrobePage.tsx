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
    color?: string;
}

export default function WardrobePage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [units, setUnits] = useState<"metric" | "imperial">("imperial");
    const [locationName, setLocationName] = useState<string>("Alexandria, VA");
    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState<string | null>(null);


    const [svgMap, setSvgMap] = useState<Record<number, string>>({});

    const handleUnitChange = (u: "metric" | "imperial") => setUnits(u);
    const handleSearch = (q: string) => {
        const next = q.trim();
        if (next) setLocationName(next);
    };

    // Fetch wardrobe
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
    }, []);

    // ⭐ FETCH & RECOLOR SVGs AFTER LOADING ITEMS
    useEffect(() => {
        items.forEach(async (item) => {
            if (!item.image_url?.endsWith(".svg")) return;

            try {
                const res = await fetch(item.image_url);
                let svg = await res.text();

                if (item.color) {
                    // Replace all fill attributes with user color
                    svg = svg.replace(/fill="[^"]*"/g, `fill="${item.color}"`);
                }

                setSvgMap(prev => ({ ...prev, [item.id]: svg }));
            } catch (error) {
                console.error("Error loading SVG:", error);
            }
        });
    }, [items]);

    // ⭐ FIXED FAVORITE TOGGLE
    // const toggleFavorite = async (id: number) => {
    //     const item = items.find(i => i.id === id);
    //     if (!item) return;
    //
    //     const newFavorited = !item.favorited;
    //
    //     const { error } = await supabase
    //         .from("personal-wardrobe")
    //         .update({ favorited: newFavorited })
    //         .eq("id", id);
    //
    //     if (error) {
    //         console.error("Supabase update failed:", error.message);
    //         return;
    //     }
    //
    //     setItems(prev =>
    //         prev.map(i =>
    //             i.id === id ? { ...i, favorited: newFavorited } : i
    //         )
    //     );
    // };

    // ⭐ REMOVE ITEM
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
        () => [
            { label: "TOP", type: "top" },
            { label: "BOTTOM", type: "bottom" },
            { label: "OTHERS", type: "other" },
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

                            const minSlots = 4;
                            const slots = [...catItems];

                            while (slots.length < minSlots || slots.length % 4 !== 0) {
                                slots.push({ id: -1000 - slots.length, empty: true } as any);
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
                                                    {slot.image_url?.endsWith(".svg") ? (
                                                        <div
                                                            className="wardrobe-image"
                                                            dangerouslySetInnerHTML={{
                                                                __html: svgMap[slot.id] || "",
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={slot.image_url || "/placeholder.png"}
                                                            alt={slot.clothing_type}
                                                            className="wardrobe-image"
                                                        />
                                                    )}

                                                    <div className="wardrobe-name">
                                                        {slot.clothing_type}
                                                    </div>

                                                    <div className="wardrobe-actions">
                                                        <button
                                                            className="btn edit"
                                                            onClick={() =>
                                                                navigate(`/edit/${slot.id}`)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn remove"
                                                            onClick={() => removeItem(slot.id)}
                                                        >
                                                            Remove
                                                        </button>

                                                        {/*<button*/}
                                                        {/*    className={`btn fav ${*/}
                                                        {/*        slot.favorited ? "on" : ""*/}
                                                        {/*    }`}*/}
                                                        {/*    onClick={() => toggleFavorite(slot.id)}*/}
                                                        {/*>*/}
                                                        {/*    ★*/}
                                                        {/*</button>*/}
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
