import './Loader.css'

function Loader() {
    return (
        <div style={{ width: "100", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
                <div className="spinner-rings">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                </div>
                <div className="loading-text mt-2">Loading...</div>
            </div>
        </div>
    )
}

export default Loader