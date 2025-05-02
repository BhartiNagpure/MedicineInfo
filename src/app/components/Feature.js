'use client'
import { useState } from 'react';


const Feature = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const features = [
        {
            title: "Quick Medicine Scanning",
            description: "Instantly scan medicine packages using your device's camera to get detailed information.",
            icon: "📱"
        },
        {
            title: "Comprehensive Drug Information",
            description: "Access detailed information about medications, including usage, side effects, and precautions.",
            icon: "💊"
        },
        {
            title: "Drug Interaction Checker",
            description: "Check potential interactions between different medications to ensure safe consumption.",
            icon: "⚡"
        },
        {
            title: "Prescription Management",
            description: "Keep track of your prescriptions and set reminders for medication schedules.",
            icon: "📝"
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-gray-50" id='features'>
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Key Features
                </h2>
                
                <div className="space-y-4">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md">
                            <button
                                className="w-full p-4 flex items-center justify-between text-left"
                                onClick={() => toggleAccordion(index)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{feature.icon}</span>
                                    <h3 className="text-xl font-semibold text-gray-700">
                                        {feature.title}
                                    </h3>
                                </div>
                                <svg
                                    className={`w-6 h-6 transform transition-transform ${
                                        activeIndex === index ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            
                            {activeIndex === index && (
                                <div className="p-4 pt-0 border-t">
                                    <p className="text-gray-600 text-md">
                                        {feature.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feature;