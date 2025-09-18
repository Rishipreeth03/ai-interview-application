function VideoScreeningToggle({ value, onChange }) {
    return (
        <div className="mt-6 flex items-center gap-3">
            <label className="font-medium text-gray-700">Enable Video Screening:</label>
            <input
                type="checkbox"
                checked={value}
                onChange={e => onChange(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
            />
        </div>
    )
}

export default VideoScreeningToggle
