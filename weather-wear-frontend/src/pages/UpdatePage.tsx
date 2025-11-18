import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/NavBar/NavBar";
import "./EditPage.css";
import { useParams, useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


interface StoredItem {
    "clothing-type": string;
    clothing_category: string;
    url: string;
}

interface PersonalWardrobeItem {
    id: number;
    clothing_type: string;
    type: string;
    high: number;
    low: number;
    color: string;
    weather_con: string;
    image_url: string;
    favorited: boolean;
}


export default function UpdatePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const itemId = id ? parseInt(id, 10) : null;


    const [clothingCategory, setClothingCategory] = useState("");
    const [type, setType] = useState("");
    const [weather, setWeather] = useState("");
    const [temperature, setTemperature] = useState<"high" | "low" | "">("");
    const [color, setColor] = useState("#a8b0ff");
    const [favorited, setFavorited] = useState(false);

    const [storedItemsList, setStoredItemsList] = useState<StoredItem[]>([]);
    const [categoriesList, setCategoriesList] = useState<string[]>([]);
    const [typesList, setTypesList] = useState<string[]>([]);
    const [weatherList, setWeatherList] = useState<string[]>([]);

    const [imageUrl, setImageUrl] = useState<string>("");
    const [svgContent, setSvgContent] = useState("");
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [itemLoadError, setItemLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (itemId === null || isNaN(itemId)) {
                setItemLoadError("Invalid item ID provided.");
                setIsDataLoading(false);
                return;
            }

            setIsDataLoading(true);

            const { data: storedData, error: storedError } = await supabase
                .from("stored-clothes")
                .select('"clothing-type", clothing_category, url');

            if (storedError) {
                console.error("Error fetching stored clothes:", storedError);
                setItemLoadError("Failed to load required wardrobe data.");
                setIsDataLoading(false);
                return;
            }

            setStoredItemsList(storedData || []);
            const uniqueCategories = [...new Set(storedData.map((item) => item.clothing_category))]
                .filter(cat => cat && cat.trim() !== "");
            setCategoriesList(uniqueCategories);
            const { data: wardrobeData, error: wardrobeError } = await supabase
                .from("general-wardrobe")
                .select("weather_con");

            if (wardrobeError) {
                console.error("Error fetching weather conditions:", wardrobeError);
            } else {
                const weathers = [...new Set(wardrobeData.map((r) => r.weather_con))];
                setWeatherList(weathers);
            }

            const { data: itemData, error: itemError } = await supabase
                .from("personal-wardrobe")
                .select("*")
                .eq("id", itemId)
                .single();

            if (itemError || !itemData) {
                console.error("Error fetching personal wardrobe item:", itemError?.message);
                setItemLoadError(`Item ID ${itemId} not found or failed to load.`);
                setIsDataLoading(false);
                return;
            }

            const item = itemData as PersonalWardrobeItem;

            setClothingCategory(item.type.toLowerCase());

            setType(item.clothing_type);

            setWeather(item.weather_con);
            setColor(item.color);
            setFavorited(item.favorited);

            if (item.high === 1) {
                setTemperature("high");
            } else if (item.low === 1) {
                setTemperature("low");
            } else {
                setTemperature("");
            }

            setIsDataLoading(false);
        };

        fetchInitialData();
    }, [itemId]);

    useEffect(() => {
        if (!clothingCategory) {
            setTypesList([]);
            return;
        }

        const filteredItems = storedItemsList.filter(
            (item) => item.clothing_category === clothingCategory
        );

        const distinctTypes = filteredItems.map((item) => item["clothing-type"])
            .filter(type => type && type.trim() !== "");

        setTypesList(distinctTypes);
    }, [clothingCategory, storedItemsList]);

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


    const handleUpdate = async () => {
        if (itemId === null) {
            alert("Error: Cannot update, item ID is missing.");
            return;
        }

        if (!clothingCategory || !type || !weather || !temperature || !color) {
            alert("Please fill out all required fields (Category, Type, Temperature, Weather, and Color).");
            return;
        }

        const generalWardrobeType = clothingCategory
            ? clothingCategory.charAt(0).toLowerCase() + clothingCategory.slice(1)
            : null;

        if (!generalWardrobeType) {
            alert("Internal error: Could not determine general wardrobe type.");
            return;
        }

        const isHigh = temperature === "high" ? 1 : 0;
        const isLow = temperature === "low" ? 1 : 0;

        const updatedClothingItem = {
            clothing_type: type,
            high: isHigh,
            low: isLow,
            color: color,
            weather_con: weather,
            image_url: imageUrl,
            favorited: favorited,
            type: generalWardrobeType,
        };

        const { error } = await supabase
            .from("personal-wardrobe")
            .update(updatedClothingItem)
            .eq("id", itemId);

        if (error) {
            console.error("Error updating item in personal-wardrobe:", error);
            alert(`Failed to update item: ${error.message}`);
        } else {
            alert("Clothing item updated successfully!");
            navigate("/wardrobe");
        }
    };


    if (isDataLoading) {
        return (
            <div className="homepage-container">
                <Sidebar/>
                <div className="editpage-container">
                    <h2 className="editpage-title">Loading Item Details...</h2>
                </div>
            </div>
        );
    }

    if (itemLoadError) {
        return (
            <div className="homepage-container">
                <Sidebar/>
                <div className="editpage-container">
                    <h2 className="editpage-title text-red-500">Error Loading Item</h2>
                    <p className="text-gray-600">{itemLoadError}</p>
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
                        <h2 className="editpage-title">Edit Existing Item ({type})</h2>

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
                                <button className="btn-save" onClick={handleUpdate}>
                                    Save Changes
                                </button>
                            </div>
                            <button className="btn-cancel" onClick={() => navigate("/wardrobe")}>
                                Cancel
                            </button>
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