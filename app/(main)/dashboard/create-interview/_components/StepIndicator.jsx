function StepIndicator({ steps, step }) {
    return (
        <div className="flex justify-center gap-4 mb-4">
            {steps.map((s, idx) => (
                <div key={s.label} className={`flex flex-col items-center`}>
                    <span className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white
                        ${step === idx + 1 ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'}
                        transition-all duration-300`}>
                        {idx + 1}
                    </span>
                    <span className={`mt-2 text-xs ${step === idx + 1 ? 'font-semibold text-blue-700' : 'text-gray-500'}`}>
                        {s.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default StepIndicator
