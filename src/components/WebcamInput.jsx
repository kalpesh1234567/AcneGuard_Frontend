import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';

const WebcamInput = ({ onCapture, skinType, setSkinType }) => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        // In a real app, send `imageSrc` to an AI service here.
        // For now, we simulate detection or let user self-select for better accuracy in this demo.
        onCapture(imageSrc);
    }, [webcamRef, onCapture]);

    const retake = () => {
        setImage(null);
        onCapture(null);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">1. Visual Analysis</h3>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-lg">
                {!image ? (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={image} alt="Captured" className="w-full h-full object-cover" />
                )}

                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    {!image ? (
                        <button
                            onClick={capture}
                            className="bg-white text-slate-900 px-6 py-2 rounded-full font-medium shadow-md hover:bg-slate-100 flex items-center gap-2"
                        >
                            <Camera className="w-4 h-4" /> Capture Analysis
                        </button>
                    ) : (
                        <button
                            onClick={retake}
                            className="bg-slate-800/80 text-white px-6 py-2 rounded-full font-medium backdrop-blur-sm hover:bg-slate-800 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Retake
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Confirmed Skin Condition (AI Simulation)
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {['Cystic', 'Hormonal', 'Comedonal'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSkinType(type)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${skinType === type
                                    ? 'bg-teal-500 text-white shadow-md ring-2 ring-teal-500 ring-offset-2'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebcamInput;
