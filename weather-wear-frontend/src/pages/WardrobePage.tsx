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

const getCurrentUserUUID = async (): Promise<string | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id || null;
    } catch (error) {
        console.error("Error fetching Supabase session:", error);
        return null;
    }
};


export default function WardrobePage() {
    const navigate = useNavigate();
    const [svgMap, setSvgMap] = useState<Record<number, string>>({});

    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [, setIsLoading] = useState(false);

    // Fetch Wardrobe
    useEffect(() => {
        const fetchWardrobe = async () => {
            setIsLoading(true);

            const userId = await getCurrentUserUUID();
            if (!userId) {
                console.error("❌ No logged-in user. Cannot fetch wardrobe.");
                setItems([]);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("personal-wardrobe")
                .select("*")
                .eq("user_id", userId); // 👈 filter by current user

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

    // const toggleFavorite = async (id: number, currentFavorited: boolean | undefined) => {
    //     const newFavorited = !currentFavorited;
    //     console.log("Toggling id:", id, "from", currentFavorited, "to", newFavorited);
    //
    //     const { error } = await supabase
    //         .from("personal-wardrobe")
    //         .update({ favorited: newFavorited })
    //         .eq("id", id)
    //         .select();
    //
    //     if (error) {
    //         console.error("Supabase update failed:", error.message);
    //     } else {
    //         // Optimistically update the local state
    //         setItems(prev =>
    //             prev.map(i => i.id === id ? { ...i, favorited: newFavorited } : i)
    //         );
    //     }
    // };

    const removeItem = async (id: number) => {
        const { error } = await supabase
            .from("personal-wardrobe")
            .delete()
            .eq("id", id);

        if (!error) {
            setItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    }

    const handleAddItem = () => {
        navigate(`/edit`);
    }

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
                <TopBar/>

                <div className="main-sections">
                    <div className="wardrobe-page">
                        {categories.map(cat => {
                            const catItems = items.filter(i => i.type.toLowerCase() === cat.type); // ensure case matching

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
                                                <div
                                                    key={slot.id}
                                                    className="wardrobe-card empty"
                                                    onClick={handleAddItem}
                                                >
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

                                                    <div className="wardrobe-name">{slot.clothing_type}</div>

                                                    <div className="wardrobe-actions">
                                                        <button
                                                            className="btn edit"
                                                            onClick={() => handleEdit(slot.id)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn remove"
                                                            onClick={() => removeItem(slot.id)}
                                                        >
                                                            Remove
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