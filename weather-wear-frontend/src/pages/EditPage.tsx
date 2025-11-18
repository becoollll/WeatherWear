import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/NavBar/NavBar";
import "./EditPage.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the structure for stored-clothes items
interface StoredItem {
    "clothing-type": string; // e.g., 'hoodie' (specific item)
    clothing_category: string; // e.g., 'top' (general category)
    url: string;
}

/**
 * Asynchronously retrieves the current user's UUID from the Supabase session.
 * @returns The user's UUID (string) or null if no session/user is found.
 */
const getCurrentUserUUID = async (): Promise<string | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id || null;
    } catch (error) {
        console.error("Error fetching Supabase session:", error);
        return null;
    }
};

export default function EditPage() {
    // States for user selection and saving
    const [clothingCategory, setClothingCategory] = useState("");
    const [type, setType] = useState("");
    const [weather, setWeather] = useState("");
    const [temperature, setTemperature] = useState("");
    const [color, setColor] = useState("#a8b0ff");
    const [favorited, setFavorited] = useState(false); // RESTORED FAVORITE STATE

    // Data lists
    const [storedItemsList, setStoredItemsList] = useState<StoredItem[]>([]);
    const [categoriesList, setCategoriesList] = useState<string[]>([]);
    const [typesList, setTypesList] = useState<string[]>([]);
    const [weatherList, setWeatherList] = useState<string[]>([]);

    // Image/Preview states
    const [imageUrl, setImageUrl] = useState<string>("");
    const [svgContent, setSvgContent] = useState("");
    const [userId, setUserId] = useState<string | null>(null); // ADDED USER ID STATE
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Data Fetch: stored-clothes data, weather conditions, and User ID
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const authUUID = await getCurrentUserUUID();

            if (authUUID) {
                // Fetch User ID from profiles table or just use the authUUID directly
                setUserId(authUUID);
            } else {
                console.warn("User not logged in or UUID not found. Personal saving disabled.");
            }

            // Fetch ALL data from stored-clothes
            const { data: storedData, error: storedError } = await supabase
                .from("stored-clothes")
                .select('"clothing-type", clothing_category, url');

            if (storedError) {
                console.error("Error fetching stored clothes:", storedError);
            } else {
                setStoredItemsList(storedData || []);

                // Derive the unique list of categories for the first dropdown
                const uniqueCategories = [...new Set(storedData.map((item) => item.clothing_category))]
                    .filter(cat => cat && cat.trim() !== "");

                setCategoriesList(uniqueCategories);
            }

            // Fetch distinct weather condition list from general-wardrobe
            const { data: wardrobeData, error: wardrobeError } = await supabase
                .from("general-wardrobe")
                .select("weather_con");

            if (wardrobeError) {
                console.error("Error fetching weather conditions:", wardrobeError);
            } else {
                const weathers = [...new Set(wardrobeData.map((r) => r.weather_con))];
                setWeatherList(weathers);
            }

            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    // 2. Cascading Dropdown Logic: Filter specific clothing types based on category selection
    useEffect(() => {
        if (!clothingCategory) {
            setTypesList([]);
            setType("");
            return;
        }

        const filteredItems = storedItemsList.filter(
            (item) => item.clothing_category === clothingCategory
        );

        const distinctTypes = filteredItems.map((item) => item["clothing-type"])
            .filter(type => type && type.trim() !== "");

        setTypesList(distinctTypes);
        setType("");
    }, [clothingCategory, storedItemsList]);


    // 3. Fetch Image based on selected item (type)
    useEffect(() => {
        const fetchImage = async () => {
            if (!type) {
                setImageUrl("");
                setSvgContent("");
                return;
            }

            const selectedItem = storedItemsList.find(item => item["clothing-type"] === type);
            const itemUrl = selectedItem?.url;

            if (itemUrl) {
                setImageUrl(itemUrl);

                if (itemUrl.endsWith(".svg")) {
                    try {
                        const res = await fetch(itemUrl);
                        const text = await res.text();
                        setSvgContent(text);
                    } catch (fetchError) {
                        console.error("Error fetching SVG content:", fetchError);
                        setSvgContent("");
                    }
                } else {
                    setSvgContent("");
                }
            } else {
                setImageUrl("");
                setSvgContent("");
            }
        };

        fetchImage();
    }, [type, storedItemsList]);


    // 4. Save Logic: Insert item into personal-wardrobe
    const handleSave = async (saveType: 'only' | 'add_more') => {
        if (!userId) {
            alert("Error: User not authenticated. Cannot save item.");
            return;
        }

        if (!clothingCategory || !type || !weather || !temperature || !color) {
            alert("Please fill out all required fields (Category, Type, Temperature, Weather, and Color).");
            return;
        }

        // Derive the general type (e.g., 'top' -> 'Top') for the 'type' column in personal-wardrobe
        const generalWardrobeType = clothingCategory
            ? clothingCategory.charAt(0).toUpperCase() + clothingCategory.slice(1)
            : null;

        if (!generalWardrobeType) {
            alert("Internal error: Could not determine general wardrobe type.");
            return;
        }

        // Determine high/low boolean based on temperature selection
        const isHigh = temperature === "high" ? 1 : 0; // Assuming bigint/number expects 1 or 0
        const isLow = temperature === "low" ? 1 : 0;   // Assuming bigint/number expects 1 or 0

        const newClothingItem = {
            clothing_type: type,        // The specific item name (e.g., 'hoodie')
            high: isHigh,
            low: isLow,
            color: color,
            weather_con: weather,       // e.g., 'Sunny'
            image_url: imageUrl,        // URL of the clothing image
            user_id: userId,            // Foreign key
            favorited: favorited,       // Boolean state
            type: generalWardrobeType,  // General type (e.g., 'Top')
        };

        const { error } = await supabase
            .from("personal-wardrobe")
            .insert([newClothingItem]);

        if (error) {
            console.error("Error saving item to personal-wardrobe:", error);
            alert(`Failed to save item: ${error.message}`);
        } else {
            alert("Clothing item saved successfully!");

            if (saveType === 'add_more') {
                // Reset form fields to add another item
                setClothingCategory("");
                setType("");
                setWeather("");
                setTemperature("");
                setColor("#a8b0ff");
                setFavorited(false);
                setImageUrl("");
                setSvgContent("");
            }
        }
    };


    if (isLoading) {
        return (
            <div className="homepage-container">
                <Sidebar/>
                <div className="editpage-container">
                    <h2 className="editpage-title">Loading Wardrobe Data...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <Sidebar/>
            <div className="editpage-container">
                <div className="editpage-main">
                    <div className="form-section">
                        <h2 className="editpage-title">Edit Clothing</h2>

                        {/* DROPDOWN 1: Clothing Category (e.g., 'top', 'other') */}
                        <select
                            className="dropdown"
                            value={clothingCategory}
                            onChange={(e) => {
                                setClothingCategory(e.target.value);
                            }}
                        >
                            <option value="">Clothing Category</option>
                            {categoriesList.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* DROPDOWN 2: Clothing Type (specific item, e.g., 'hoodie') */}
                        <select
                            className="dropdown"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={!clothingCategory}
                        >
                            <option value="">
                                {clothingCategory ? "Clothing Item Type" : "Select category first"}
                            </option>
                            {typesList.map((itemType) => (
                                <option key={itemType} value={itemType}>
                                    {itemType}
                                </option>
                            ))}
                        </select>

                        <div className="temperature-options">
                            <button
                                className={`temp-btn ${temperature === "high" ? "active" : ""}`}
                                onClick={() => setTemperature("high")}
                            >
                                High
                            </button>
                            <button
                                className={`temp-btn ${temperature === "low" ? "active" : ""}`}
                                onClick={() => setTemperature("low")}
                            >
                                Low
                            </button>

                            <label className="color-picker">
                                Select Color 🎨
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* RESTORED FAVORITE CHECKBOX */}
                        <label className="favorited-checkbox">
                            <input
                                type="checkbox"
                                checked={favorited}
                                onChange={(e) => setFavorited(e.target.checked)}
                            />
                            Favorite Item ⭐
                        </label>

                        <select
                            className="dropdown"
                            value={weather}
                            onChange={(e) => setWeather(e.target.value)}
                        >
                            <option value="">Weather Type</option>
                            {weatherList.map((w) => (
                                <option key={w} value={w}>
                                    {w}
                                </option>
                            ))}
                        </select>

                        <div className="button-group">
                            <div className="button-row">
                                {/* UPDATED TO CALL handleSave with 'only' */}
                                <button className="btn-save" onClick={() => handleSave('only')}>
                                    Save To Wardrobe
                                </button>
                                {/*<button className="btn-addmore" onClick={() => handleSave('add_more')}>*/}
                                {/*    Add More*/}
                                {/*</button>*/}
                            </div>
                            <button className="btn-cancel">Cancel</button>
                        </div>
                    </div>

                    <div className="preview-section">
                        <div className="preview-wrapper">
                            {imageUrl ? (
                                <>

                                    {imageUrl.endsWith(".svg") ? (
                                        <div
                                            className="preview-image"
                                            dangerouslySetInnerHTML={{
                                                __html: svgContent.replace(
                                                    /fill="[^"]*"/g,
                                                    `fill="${color}"`
                                                )
                                            }}
                                        />
                                    ) : (
                                        <img src={imageUrl} alt={type} className="preview-image" />
                                    )}

                                </>
                            ) : (
                                <>

                                    <svg
                                        width="200"
                                        height="200"
                                        viewBox="0 0 100 100"
                                        xmlns="http://www.w3.org/2000/svg"
                                    ></svg>

                                    <svg
                                        className="color-dot-svg"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640"
                                        width="400"
                                        height="400"
                                    >
                                        <path
                                            fill={color}
                                            d="M320.2 176C364.4 176 400.2 140.2 400.2 96L453.7 96C470.7 96 487 102.7 499 114.7L617.6 233.4C630.1 245.9 630.1 266.2 617.6 278.7L566.9 329.4C554.4 341.9 534.1 341.9 521.6 329.4L480.2 288L480.2 512C480.2 547.3 451.5 576 416.2 576L224.2 576C188.9 576 160.2 547.3 160.2 512L160.2 288L118.8 329.4C106.3 341.9 86 341.9 73.5 329.4L22.9 278.6C10.4 266.1 10.4 245.8 22.9 233.3L141.5 114.7C153.5 102.7 169.8 96 186.8 96L240.3 96C240.3 140.2 276.1 176 320.3 176z"
                                        />
                                    </svg>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}