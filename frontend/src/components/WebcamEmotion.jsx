import React from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

const WebcamEmotion = ({ webcamRef, showWebcam, currentEmotion }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl aspect-video bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl">
            {showWebcam ? (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="object-cover w-full h-full scale-x-[-1]"
                />
            ) : (
                <div className="flex flex-col items-center gap-2 p-8 text-slate-500">
                    <Camera size={48} className="opacity-20" />
                    <span className="text-sm font-medium">Webcam Disabled</span>
                </div>
            )}
        </div>
    );
};

export default WebcamEmotion;