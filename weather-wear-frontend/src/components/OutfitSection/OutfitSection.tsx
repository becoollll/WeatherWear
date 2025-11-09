import { useEffect, useState } from "react";
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
}

/**
 * Normalize weather condition to consistent categories
 */
function normalizeWeatherCondition(cond: string): string {
    const c = cond.toLowerCase();
    if (["rain", "rainy", "drizzle", "thunderstorm"].some(k => c.includes(k))) return "rain";
    if (["snow", "snowy"].some(k => c.includes(k))) return "snow";
    if (["cloud", "clouds"].some(k => c.includes(k))) return "clouds";
    if (["clear", "sun"].some(k => c.includes(k))) return "clear";
    return "all";
}

export default function OutfitSection({ weatherData, isLoading }: OutfitSectionProps) {
    const [outfit, setOutfit] = useState<{
        top: ClothingItem | null;
        bottom: ClothingItem | null;
        accessory: ClothingItem | null;
    }>({
        top: null,
        bottom: null,
        accessory: null,
    });

    useEffect(() => {
        if (weatherData && !isLoading) {
            void fetchOutfit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherData, isLoading]);

    async function fetchOutfit() {
        if (!weatherData) return;

        const temp = Math.round(weatherData.current.main.feels_like);
        const condition = normalizeWeatherCondition(weatherData.current.weather[0].main);

        console.log("🌤️ Normalized weather:", condition, "Temp:", temp);

        const { data: allData, error: allError } = await supabase
            .from("general-wardrobe")
            .select("*");

        console.log(" ALL DATA:", allData);
        console.log(" ALL ERROR:", allError);

        if (allError) {
            console.error(" Supabase error:", allError);
            return;
        }


        const { data: filteredData, error: filteredError } = await supabase
            .from("general-wardrobe")
            .select("*")
            .lte("low", temp)
            .gte("high", temp);

        console.log("🔍 FILTERED DATA:", filteredData);
        console.log("🔍 Query was: low <= " + temp + " AND high >= " + temp);

        if (filteredError) {
            console.error(" Filter error:", filteredError);
        }


        const dataToUse = (filteredData && filteredData.length > 0) ? filteredData : allData;

        if (!dataToUse || dataToUse.length === 0) {
            console.warn("⚠ No clothing data found in database.");
            setOutfit({ top: null, bottom: null, accessory: null });
            return;
        }

        console.log(filteredData && filteredData.length > 0
            ? "✅ Using filtered data"
            : "⚠️ Using ALL data as fallback");


        const weatherFiltered = dataToUse.filter(
            (item: ClothingItem) =>
                item.weather_con === "all" ||
                condition.includes(item.weather_con.toLowerCase()) ||
                item.weather_con.toLowerCase().includes(condition)
        );

        if (weatherFiltered.length === 0) {
            console.warn("⚠️ No matching clothing items for condition:", condition);
            setOutfit({ top: null, bottom: null, accessory: null });
            return;
        }


        const topTypes = ["sweatshirt", "t-shirt", "polo", "tanktop", "buttonup", "hoodie"];
        const bottomTypes = ["jeans", "sweatpants", "shorts"];
        const accessoryTypes = ["rainjacket", "jacket", "wintercoat", "overalls", "jumpsuit"];

        const tops = weatherFiltered.filter((i) => topTypes.includes(i.clothing_type));
        const bottoms = weatherFiltered.filter((i) => bottomTypes.includes(i.clothing_type));
        const accessories = weatherFiltered.filter((i) => accessoryTypes.includes(i.clothing_type));

        console.log(" Categorized:", {
            tops: tops.length,
            bottoms: bottoms.length,
            accessories: accessories.length
        });


        const randomPick = (arr: ClothingItem[]) =>
            arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

        setOutfit({
            top: randomPick(tops),
            bottom: randomPick(bottoms),
            accessory: randomPick(accessories),
        });
    }

    const handleRefresh = () => {
        void fetchOutfit();
    };

    if (isLoading) {
        return <p style={{ textAlign: "center" }}>Loading outfit recommendation...</p>;
    }

    return (
        <div className="outfit-section">
            <h2 className="outfit-title">Today's Outfit Recommendation</h2>

            <div className="outfit-grid">
                {/* Top */}
                <div className="outfit-item">

                    <div className="outfit-info">
                        <h3>Top</h3>
                        {outfit.top ? (
                            <>
                                <p>{outfit.top.clothing_type}</p>

                            </>
                        ) : (
                            <p>No match</p>
                        )}
                    </div>
                    <img
                        src={outfit.top?.image_url || topPlaceholder}
                        alt={outfit.top?.clothing_type || "Top recommendation"}
                        className="outfit-image"
                    />
                </div>

                {/* Bottom */}
                <div className="outfit-item">
                    <div className="outfit-info">
                        <h3>Bottom</h3>
                        {outfit.bottom ? (
                            <>
                                <p>{outfit.bottom.clothing_type}</p>

                            </>
                        ) : (
                            <p>No match</p>
                        )}
                    </div>
                    <img
                        src={outfit.bottom?.image_url || bottomPlaceholder}
                        alt={outfit.bottom?.clothing_type || "Bottom recommendation"}
                        className="outfit-image"
                    />
                </div>

                {/* Accessories */}
                <div className="outfit-item">
                    <div className="outfit-info">
                        <h3>Accessories</h3>
                        {outfit.accessory ? (
                            <>
                                <p>{outfit.accessory.clothing_type}</p>
                            </>
                        ) : (
                            <p>No match</p>
                        )}
                    </div>
                    <img
                        src={outfit.accessory?.image_url || accessoryPlaceholder}
                        alt={outfit.accessory?.clothing_type || "Accessory recommendation"}
                        className="outfit-image"
                    />
                </div>
            </div>

            <button className="refresh-button" onClick={handleRefresh}>
                <img src={refreshIcon} alt="Refresh outfit" className="refresh-icon"/>
            </button>
            <p>Don't like it? Refresh!</p>
        </div>
    );
}