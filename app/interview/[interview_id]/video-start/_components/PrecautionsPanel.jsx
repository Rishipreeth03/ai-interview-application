import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Clock, Mic, MicOff, X, Video } from "lucide-react";

const PrecautionsPanel = () => {
    return (
        <div className="w-full mt-2">
            <Alert variant="default" className="border-2 border-indigo-200 bg-indigo-50/80">
                <AlertCircle className="h-4 w-4 text-indigo-600 mr-2" />
                <AlertTitle className="text-indigo-700 font-semibold text-sm">Video Interview Reminders</AlertTitle>

                <ScrollArea className="h-[140px] w-full pr-4 mt-2">
                    <AlertDescription className="text-sm text-gray-700">
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <Video className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span><strong>Camera on:</strong> Make sure your camera is working and you're well-lit and centered in frame.</span>
                            </li>
                            <li className="flex items-start">
                                <MicOff className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span><strong>Avoid silence:</strong> Don't remain silent for more than 30 seconds or the interview may end automatically.</span>
                            </li>
                            <li className="flex items-start">
                                <Mic className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span><strong>Speak clearly:</strong> Maintain eye contact with the camera and speak at a normal volume and pace.</span>
                            </li>
                            <li className="flex items-start">
                                <Clock className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span><strong>End properly:</strong> Click "End Interview" when finished to ensure your video and responses are saved.</span>
                            </li>
                            <li className="flex items-start">
                                <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span><strong>Don't refresh:</strong> Refreshing or closing this page may end your interview session and lose your recording.</span>
                            </li>
                        </ul>
                    </AlertDescription>
                </ScrollArea>
            </Alert>
        </div>
    );
};

export default PrecautionsPanel;
