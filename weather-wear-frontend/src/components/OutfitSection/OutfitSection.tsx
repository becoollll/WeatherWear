import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { supabase } from "../../supabaseClient";
import "../OutfitSection/OutfitSection.css";
import topPlaceholder from "../OutfitSection/Vector-6.png";
import bottomPlaceholder from "../OutfitSection/Frame-4.png";
import accessoryPlaceholder from "../OutfitSection/Frame-3.png";
import refreshIcon from "../OutfitSection/Refresh.png";
import type { WeatherData } from "../../pages/HomePage";

interface OutfitSectionProps {
    weatherData: WeatherData | null;
    isLoading: boolean;
}

interface ClothingItem {
    id: number;
    clothing_type: string;
    clothing_category?: string;
    high: number;
    low: number;
    weather_con: string;
    image_url?: string;
    color?: string;
}

function normalizeWeatherCondition(cond: string): string {
    const c = cond.toUpperCase();
    if (["rain", "drizzle", "thunderstorm"].some(k => c.includes(k))) return "rain";
    if (["snow"].some(k => c.includes(k))) return "snow";
    if (["cloud", "clouds", "overcast"].some(k => c.includes(k))) return "clouds";
    if (["clear", "sun"].some(k => c.includes(k))) return "clear";
    return "all";
}


export default function OutfitSection({ weatherData, isLoading }: OutfitSectionProps) {
    const [outfit, setOutfit] = useState({
        top: null as ClothingItem | null,
        bottom: null as ClothingItem | null,
        accessory: null as ClothingItem | null,
    });

    const [svgMap, setSvgMap] = useState<Record<number, string>>({});

    // Which wardrobe are we using?
    const [usePersonal, setUsePersonal] = useState(false);

    // Current user id for personal wardrobe filtering
    const [userId, setUserId] = useState<string | null>(null);

    const outfitCardRef = useRef<HTMLDivElement>(null);

    // Load current Supabase user once
    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUserId(session?.user?.id ?? null);
            } catch (error) {
                console.error("Error fetching Supabase session in OutfitSection:", error);
                setUserId(null);
            }
        };
        void loadUser();
    }, []);

    useEffect(() => {
        if (weatherData && !isLoading) {
            void fetchOutfit();
        }
        // re-run when wardrobe source or user changes
    }, [weatherData, isLoading, usePersonal, userId]);

    useEffect(() => {
        const items = [outfit.top, outfit.bottom, outfit.accessory].filter(
            (i): i is ClothingItem => i !== null
        );

        items.forEach(async (item) => {

            if (!item.image_url || !item.image_url.endsWith(".svg")) return;

            if (svgMap[item.id]) return;

            try {
                const res = await fetch(item.image_url);
                let svg = await res.text();

                if (item.color) {
                    svg = svg.replace(/fill="[^"]*"/g, `fill="${item.color}"`);
                }

                setSvgMap(prev => ({ ...prev, [item.id]: svg }));
            } catch (error) {
                console.error("Error loading/recoloring SVG for outfit item:", error);
            }
        });
    }, [outfit, svgMap]);


    async function fetchOutfit() {
        if (!weatherData) return;

        const temp = Math.round(weatherData.current.main.feels_like);
        const condition = normalizeWeatherCondition(weatherData.current.weather[0].main);

        // Decide which table to use
        const tableName = usePersonal ? "personal-wardrobe" : "general-wardrobe";

        // If user wants personal but we have no userId, fallback to general
        if (usePersonal && !userId) {
            console.warn("usePersonal is true but userId is null; falling back to general wardrobe.");
        }

        // Base query builder
        const buildQuery = () => {
            let query = supabase.from(tableName).select("*");
            if (usePersonal && userId) {
                query = query.eq("user_id", userId);
            }
            return query;
        };

        const buildFilteredQuery = () => {
            let query = supabase
                .from(tableName)
                .select("*")
                .lte("low", temp)
                .gte("high", temp);
            if (usePersonal && userId) {
                query = query.eq("user_id", userId);
            }
            return query;
        };

        const { data: allData, error: allError } = await buildQuery();
        if (allError) {
            console.error("Error fetching all wardrobe items:", allError);
        }

        const { data: filteredData, error: filteredError } = await buildFilteredQuery();
        if (filteredError) {
            console.error("Error fetching filtered wardrobe items:", filteredError);
        }

        const dataToUse =
            (filteredData && filteredData.length > 0)
                ? filteredData
                : (allData ?? []);

        const weatherFiltered = dataToUse.filter(
            (item: ClothingItem) =>
                item.weather_con === "all" ||
                condition.includes(item.weather_con.toLowerCase()) ||
                item.weather_con.toLowerCase().includes(condition)
        );

        const topTypes = ["Sweatshirt", "T-shirt", "Polo", "Tanktop", "Buttonup", "Hoodie"];
        const bottomTypes = ["Jeans", "Sweatpants", "Shorts"];
        const accessoryTypes = ["Rainjacket", "Jacket", "Wintercoat", "Overalls", "Glasses", "Hat"];

        const picks = {
            top: weatherFiltered.filter(i => topTypes.includes(i.clothing_type)),
            bottom: weatherFiltered.filter(i => bottomTypes.includes(i.clothing_type)),
            other: weatherFiltered.filter(i => accessoryTypes.includes(i.clothing_type)),
        };

        console.log("Using table:", tableName);
        console.log("Weather filtered items:", weatherFiltered);
        console.log("Accessory picks:", picks.other);
        console.log("Selected accessory:", picks.other.length ? picks.other[0] : "none");

        const random = (arr: ClothingItem[]) =>
            arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

        setOutfit({
            top: random(picks.top),
            bottom: random(picks.bottom),
            accessory: random(picks.other),
        });
    }

    const handleRefresh = () => {
        void fetchOutfit();
    };

    const svgToPng = async (svgUrl: string): Promise<string> => {
        const svgText = await fetch(svgUrl).then(res => res.text());
        const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        return new Promise(res => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const c = document.createElement("canvas");
                c.width = img.width;
                c.height = img.height;
                const ctx = c.getContext("2d")!;
                ctx.drawImage(img, 0, 0);
                res(c.toDataURL("image/png"));
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    };

    const waitForImages = (container: HTMLDivElement) => {
        const imgs = container.querySelectorAll("img");
        return Promise.all(
            Array.from(imgs).map(
                img =>
                    new Promise<void>(resolve => {
                        if ((img as HTMLImageElement).complete) resolve();
                        (img as HTMLImageElement).onload = () => resolve();
                        (img as HTMLImageElement).onerror = () => resolve();
                    })
            )
        );
    };

    const createOutfitCanvas = async (): Promise<HTMLCanvasElement | null> => {
        if (!outfitCardRef.current) return null;

        await waitForImages(outfitCardRef.current);

        return html2canvas(outfitCardRef.current, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            allowTaint: true,
            onclone: async clonedDoc => {
                const imgs = clonedDoc.querySelectorAll("img");
                for (const img of Array.from(imgs)) {
                    const src = (img as HTMLImageElement).src;
                    if (src.endsWith(".svg")) {
                        const png = await svgToPng(src);
                        if (png) {
                            (img as HTMLImageElement).src = png;
                        } else {
                            (img as HTMLImageElement).style.display = "none";
                        }
                    }
                }
            }
        });
    };



    const fallbackShare = () => {
        const shareUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("WeatherWear recommends this outfit for you!");
        const twitterLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`;
        window.open(twitterLink, "_blank", "width=600,height=400");
    };

    const handleShareOutfit = async () => {
        const canvas = await createOutfitCanvas();
        if (!canvas) return;

        if (navigator.share && navigator.canShare) {
            try {
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], "outfit.png", { type: "image/png" });

                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: "Today's outfit recommendations.",
                            text: "WeatherWear recommends this outfit for you!",
                        });
                        return;
                    }
                }, "image/png");
            } catch (error) {
                console.error("Web Share API error:", error);
                fallbackShare();
                return;
            }
        }

        fallbackShare();
    };

    const handleDownloadImage = async () => {
        const canvas = await createOutfitCanvas();
        if (!canvas) return;

        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = data;
        link.download = "outfit.png";
        link.click();
    };

    if (isLoading) {
        return <p style={{ textAlign: "center" }}>Loading outfit recommendation...</p>;
    }

    return (
        <div className="outfit-section">
            <h2 className="outfit-title">Today's Outfit Recommendation</h2>
            {/*Wardrobe Toggle*/}
            <div className="wardrobe-toggle">
                <button
                    type="button"
                    className={`wardrobe-toggle-option ${!usePersonal ? "active" : ""}`}
                    onClick={() => setUsePersonal(false)}
                >
                    General Wardrobe
                </button>
                <button
                    type="button"
                    className={`wardrobe-toggle-option ${usePersonal ? "active" : ""}`}
                    onClick={() => setUsePersonal(true)}
                    disabled={!userId}
                    title={!userId ? "Log in to use your personal wardrobe" : ""}
                >
                    My Wardrobe
                </button>
            </div>

            <div ref={outfitCardRef} className="outfit-screenshot-card">
                <div className="outfit-grid">
                    <div className="outfit-item">
                        <h3>Top</h3>
                        <p>{outfit.top?.clothing_type || "No match"}</p>

                        {outfit.top?.image_url?.endsWith(".svg") && svgMap[outfit.top.id] ? (
                            <div
                                className="outfit-image svg-image"
                                dangerouslySetInnerHTML={{ __html: svgMap[outfit.top.id] }}
                            />
                        ) : (
                            <img
                                src={outfit.top?.image_url || topPlaceholder}
                                className="outfit-image"
                            />
                        )}
                    </div>

                    <div className="outfit-item">
                        <h3>Bottom</h3>
                        <p>{outfit.bottom?.clothing_type || "No match"}</p>

                        {outfit.bottom?.image_url?.endsWith(".svg") && svgMap[outfit.bottom.id] ? (
                            <div
                                className="outfit-image svg-image"
                                dangerouslySetInnerHTML={{ __html: svgMap[outfit.bottom.id] }}
                            />
                        ) : (
                            <img
                                src={outfit.bottom?.image_url || bottomPlaceholder}
                                className="outfit-image"
                            />
                        )}
                    </div>

                    <div className="outfit-item">
                        <h3>Accessories</h3>
                        <p>{outfit.accessory?.clothing_type || "No match"}</p>

                        {outfit.accessory?.image_url?.endsWith(".svg") && svgMap[outfit.accessory.id] ? (
                            <div
                                className="outfit-image svg-image"
                                dangerouslySetInnerHTML={{ __html: svgMap[outfit.accessory.id] }}
                            />
                        ) : (
                            <img
                                src={outfit.accessory?.image_url || accessoryPlaceholder}
                                className="outfit-image"
                            />
                        )}
                    </div>
                </div>
            </div>

            <button className="refresh-button" onClick={handleRefresh}>
                <img src={refreshIcon} className="refresh-icon" />
            </button>

            <button className="download-button" onClick={handleDownloadImage}>
                Download Outfit Image
            </button>
            <button className="download-button" onClick={handleShareOutfit}>
                Share Outfit
            </button>

            <p>Don't like it? Refresh!</p>
        </div>
    );
}
