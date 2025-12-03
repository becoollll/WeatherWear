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

    const outfitCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (weatherData && !isLoading) {
            void fetchOutfit();
        }
    }, [weatherData, isLoading]);

    async function fetchOutfit() {
        if (!weatherData) return;

        const temp = Math.round(weatherData.current.main.feels_like);
        const condition = normalizeWeatherCondition(weatherData.current.weather[0].main);

        const { data: allData } = await supabase.from("general-wardrobe").select("*");

        const { data: filteredData } = await supabase
            .from("general-wardrobe")
            .select("*")
            .lte("low", temp)
            .gte("high", temp);

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
        const accessoryTypes = ["Rainjacket", "Jacket", "Wintercoat", "Overalls", "Jumpsuit"];

        const picks = {
            top: weatherFiltered.filter(i => topTypes.includes(i.clothing_type)),
            bottom: weatherFiltered.filter(i => bottomTypes.includes(i.clothing_type)),
            other: weatherFiltered.filter(i => accessoryTypes.includes(i.clothing_type)),
        };
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
                        if (img.complete) resolve();
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
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
                            (img as HTMLImageElement).style.display = 'none';
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

        // 開啟新視窗分享
        window.open(twitterLink, '_blank', 'width=600,height=400');
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
                }, 'image/png');
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

            <div ref={outfitCardRef} className="outfit-screenshot-card">
                <div className="outfit-grid">
                    <div className="outfit-item">
                        <h3>Top</h3>
                        <p>{outfit.top?.clothing_type || "No match"}</p>
                        <img
                            src={outfit.top?.image_url || topPlaceholder}
                            className="outfit-image"
                        />
                    </div>

                    <div className="outfit-item">
                        <h3>Bottom</h3>
                        <p>{outfit.bottom?.clothing_type || "No match"}</p>
                        <img
                            src={outfit.bottom?.image_url || bottomPlaceholder}
                            className="outfit-image"
                        />
                    </div>

                    <div className="outfit-item">
                        <h3>Accessories</h3>
                        <p>{outfit.accessory?.clothing_type || "No match"}</p>
                        <img
                            src={outfit.accessory?.image_url || accessoryPlaceholder}
                            className="outfit-image"
                        />
                    </div>
                </div>
            </div>

            <button className="refresh-button" onClick={handleRefresh}>
                <img src={refreshIcon} className="refresh-icon"/>
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