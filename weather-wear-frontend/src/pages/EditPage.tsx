import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/NavBar/NavBar";
import "./EditPage.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditPage() {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [weather, setWeather] = useState("");
    const [temperature, setTemperature] = useState("");
    const [color, setColor] = useState("#a8b0ff");

    const [categoriesList, setCategoriesList] = useState<string[]>([]);
    const [typesList, setTypesList] = useState<string[]>([]);
    const [weatherList, setWeatherList] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<string>("");


    useEffect(() => {
        const fetchDropdowns = async () => {
            const { data: wardrobeData, error } = await supabase
                .from("general-wardrobe")
                .select("type, clothing_type, weather_con");

            if (error) {
                console.error("Error fetching wardrobe:", error);
                return;
            }

            // distinct category (Top, bottom, other)
            const cats = [...new Set(wardrobeData.map((r) => r.type))];
            setCategoriesList(cats);

            // distinct weather condition
            const weathers = [...new Set(wardrobeData.map((r) => r.weather_con))];
            setWeatherList(weathers);
        };

        fetchDropdowns();
    }, []);

    useEffect(() => {
        const fetchTypes = async () => {
            if (!category) {
                setTypesList([]);
                return;
            }
            const { data, error } = await supabase
                .from("general-wardrobe")
                .select("clothing_type")
                .eq("type", category);

            if (error) {
                console.error("Error fetching clothing types:", error);
                return;
            }

            const distinctTypes = [...new Set(data.map((r) => r.clothing_type))];
            setTypesList(distinctTypes);
        };

        fetchTypes();
    }, [category]);

    useEffect(() => {
        const fetchImage = async () => {
            if (!type) {
                setImageUrl("");
                return;
            }

            const { data, error } = await supabase
                .from("general-wardrobe")
                .select("image_url")
                .eq("clothing_type", type)
                .limit(1)
                .single();

            if (error) {
                console.error("Error fetching image:", error);
                return;
            }

            if (data?.image_url) {
                setImageUrl(data.image_url);
            } else {
                setImageUrl("");
            }
        };

        fetchImage();
    }, [type]);

    const handleSave = () => {
        console.log({ category, type, temperature, color, weather });
    };

    return (
        <div className="homepage-container">{/* reuse HomePage shell */}
            <Sidebar/>
            <div className="editpage-container">
                <div className="editpage-main">
                    <div className="form-section">
                        <h2 className="editpage-title">Edit Clothing</h2>

                        <select
                            className="dropdown"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setType(""); // reset when category changes
                            }}
                        >
                            <option value="">Clothing Category</option>
                            {categoriesList.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <select
                            className="dropdown"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={!category}
                        >
                            <option value="">
                                {category ? "Clothing Type" : "Select category first"}
                            </option>
                            {typesList.map((t) => (
                                <option key={t} value={t}>
                                    {t}
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
                                <button className="btn-save" onClick={handleSave}>
                                    Only Save This
                                </button>
                                <button className="btn-addmore" onClick={handleSave}>
                                    Add More
                                </button>
                            </div>
                            <button className="btn-cancel">Cancel</button>
                        </div>
                    </div>

                    <div className="preview-section">
                        <div className="preview-wrapper">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={type}
                                    className="preview-image"
                                />
                            ) : (
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 100 100"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                </svg>
                            )}

                            <svg className="color-dot-svg" width="60" height="60">
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="15"
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}