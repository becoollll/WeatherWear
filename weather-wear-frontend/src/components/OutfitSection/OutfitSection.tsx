import '../OutfitSection/OutfitSection.css';
import topPlaceholder from '../OutfitSection/Vector-6.png';
import bottomPlaceholder from '../OutfitSection/Frame-4.png';
import accessoryPlaceholder from '../OutfitSection/Frame-3.png';
import refreshIcon from '../OutfitSection/Refresh.png'; // ← your refresh image

export default function OutfitSection() {
    return (
        <div className="outfit-section">
            <h2 className="outfit-title">Today's Outfit Recommendation</h2>

            <div className="outfit-grid">
                <div className="outfit-item">
                    <img
                        src={topPlaceholder}
                        alt="Top recommendation"
                        className="outfit-image"
                    />
                    <div className="outfit-info">
                        <h3>Top</h3>
                        {/*<p>🧥 Light Jacket / 👕 Long Sleeve Shirt</p>*/}
                    </div>
                </div>

                <div className="outfit-item">
                    <img
                        src={bottomPlaceholder}
                        alt="Bottom recommendation"
                        className="outfit-image"
                    />
                    <div className="outfit-info">
                        <h3>Bottom</h3>
                        {/*<p>👖 Jeans / 🩳 Shorts</p>*/}
                    </div>
                </div>

                <div className="outfit-item">
                    <img
                        src={accessoryPlaceholder}
                        alt="Accessories recommendation"
                        className="outfit-image"
                    />
                    <div className="outfit-info">
                        <h3>Accessories</h3>
                        {/*<p>🕶️ Sunglasses / 🎒 Backpack / 🧢 Cap</p>*/}
                    </div>
                </div>
            </div>

            <button className="refresh-button">
                <img
                    src={refreshIcon}
                    alt="Refresh outfit"
                    className="refresh-icon"
                />
            </button>
            <p>Don't like it? Refresh?</p>
        </div>
    );
}
