// "use client"
// import { Button } from '@/components/ui/button';
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema'
// import { eq } from 'drizzle-orm';
// import { Lightbulb, WebcamIcon } from 'lucide-react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'
// import Webcam from 'react-webcam';

// function Interview({params}) {

//     const [interviewData,setInterviewData]=useState();
//     const [webCamEnabled,setWebCamEnabled]=useState(false);
//     useEffect(()=>{
//         console.log(params.interviewId)
//         GetInterviewDetials();
//     },[])

//     /**
//      * Used to Get Interview Details by MockId/Interview Id
//      */

//     const GetInterviewDetials = async()=>{
//         const result=await db.select().from(MockInterview)
//         .where(eq(MockInterview.mockId,params.interviewId))
        
//         setInterviewData(result[0]);
//     }

//   return (
//     <div className='my-10'>
//         <h2 className='font-bold text-2xl'>Let's Get Started</h2>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        
//         <div className='flex flex-col my-5 gap-5 '>
//             <div className='flex flex-col p-5 rounded-lg border gap-5'>
//                 <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{interviewData?.jobPosition} </h2>
//                 <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{interviewData?.jobDesc}</h2>
//                 <h2 className='text-lg'><strong>Years of Experience:</strong>{interviewData?.jobExperience}</h2>
//             </div>
//             <div className='p-5 border rounded-lg bg-primary'>
//                 <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
//                 <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
//             </div>
//         </div>

//         <div>
//             {webCamEnabled? <Webcam
//             onUserMedia={()=>setWebCamEnabled(true)}
//             onUserMediaError={()=>setWebCamEnabled(false)} 
//             mirrored={true} 
//                 style={{
//                     height:300,
//                     width:300
//                 }}
//             />
//             :
//             <>
//             <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
//             <Button variant="ghost" className="w-full" onClick={()=>setWebCamEnabled(true)}>Enable WebCam and Microphone</Button>
//             </>
//             }
//         </div>
//         </div>
//         <div className='flex justify-end items-end'>
//             <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
//             <Button>Start Interview</Button>
//             </Link>
//         </div>
//     </div>
//   )
// }

// export default Interview


"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';

function Interview({params}) {
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('prompt');

    useEffect(() => {
        GetInterviewDetails();
        checkMediaPermissions();
    }, [params.interviewId]);

    /**
     * Check camera and microphone permissions
     */
    const checkMediaPermissions = async () => {
        try {
            const cameraPermission = await navigator.permissions.query({ name: 'camera' });
            const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
            
            setPermissionStatus(
                cameraPermission.state === 'granted' && microphonePermission.state === 'granted' 
                ? 'granted' 
                : 'denied'
            );
        } catch (err) {
            console.error("Permission API not supported", err);
        }
    };

    /**
     * Used to Get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            
            if (result.length === 0) {
                throw new Error('Interview not found');
            }
            
            setInterviewData(result[0]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnableWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            stream.getTracks().forEach(track => track.stop());
            setWebCamEnabled(true);
            setPermissionStatus('granted');
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setPermissionStatus('denied');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-10 p-5 border rounded-lg bg-destructive/10 text-destructive">
                <h2 className="font-bold text-xl">Error</h2>
                <p>{error}</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="my-10 max-w-6xl mx-auto px-4">
            <h2 className="font-bold text-2xl mb-8">Let's Get Started</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Interview Details Section */}
                <div className="space-y-6">
                    <div className="p-6 rounded-lg border bg-card shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Job Role</p>
                                <p className="text-lg font-medium">{interviewData?.jobPosition}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Job Description</p>
                                <p className="text-lg font-medium">{interviewData?.jobDesc}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Experience Required</p>
                                <p className="text-lg font-medium">{interviewData?.jobExperience} years</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-lg border bg-yellow-50 shadow-sm">
                        <div className="flex items-center gap-2 text-yellow-600">
                            <Lightbulb className="h-5 w-5" />
                            <h3 className="font-semibold">Information</h3>
                        </div>
                        <p className="mt-3 text-yellow-700">
                            {process.env.NEXT_PUBLIC_INFORMATION || 
                             "Make sure you're in a quiet environment with good lighting for the best interview experience."}
                        </p>
                    </div>
                </div>

                {/* Webcam Section */}
                <div className="flex flex-col items-center">
                    {webCamEnabled ? (
                        <div className="relative w-full">
                            <Webcam
                                audio={true}
                                videoConstraints={{ facingMode: 'user' }}
                                onUserMedia={() => setWebCamEnabled(true)}
                                onUserMediaError={() => setWebCamEnabled(false)}
                                mirrored={true}
                                className="w-full h-auto rounded-lg border shadow-md"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                Live Preview
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                            <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <WebcamIcon className="h-16 w-16 text-gray-400" />
                            </div>
                            <Button 
                                onClick={handleEnableWebcam}
                                className="w-full mt-4"
                                disabled={permissionStatus === 'denied'}
                            >
                                {permissionStatus === 'denied' 
                                    ? 'Permission Denied - Update in Browser Settings'
                                    : 'Enable Webcam & Microphone'}
                            </Button>
                            {permissionStatus === 'denied' && (
                                <p className="text-sm text-destructive mt-2">
                                    Please enable camera and microphone permissions in your browser settings.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Start Interview Button */}
            <div className="flex justify-end mt-8">
                <Link href={`/dashboard/interview/${params.interviewId}/start`} passHref>
                    <Button 
                        size="lg" 
                        disabled={!webCamEnabled}
                        className="px-8 py-6 text-lg"
                    >
                        Start Interview Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;