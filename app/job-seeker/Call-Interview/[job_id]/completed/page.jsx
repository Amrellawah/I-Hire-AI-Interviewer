"use client"
import React from 'react';
import { Home, ArrowRight, Check, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const InterviewComplete = () => {

    const router = useRouter();

    const handleHomeClick = () => {
        router.push('/'); // Navigate to homepage
    };

    const handleOpportunitiesClick = () => {
        router.push('/job-seeker'); // Navigate to opportunities page
    };

    return (
        <div className="bg-white text-gray-900 font-sans antialiased flex flex-col min-h-screen mt-9">
            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center space-y-8 py-12 px-4 sm:px-6 lg:px-8">
                {/* Success Section */}
                <div className="text-center space-y-6 max-w-2xl">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] animate-bounce">
                        <Check className="h-10 w-10 text-white" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">
                        Interview Complete!
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl text-gray-600">
                        Thank you for participating in the AI-driven interview with Alcruiter
                    </p>
                </div>

                {/* Illustration */}
                <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-50">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-700">Your Interview Responses</h3>
                                <p className="text-gray-500 mt-2">Successfully submitted and recorded</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-2xl space-y-6 border border-gray-200 transform transition-all hover:scale-[1.01]">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center rounded-full bg-[#f1e9ea] w-14 h-14 p-3 mb-4">
                            <Clock className="h-8 w-8 text-[#be3144]" />
                        </div>

                        <h2 className="text-2xl font-semibold text-center text-gray-900">What's Next?</h2>
                        <p className="text-gray-600 text-center mt-2">
                            The recruiter will review your interview responses and will contact you soon regarding the next steps.
                        </p>
                        
                        <div className="mt-4 flex items-center text-sm text-[#be3144]">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Response within 2-3 business days</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Next Steps Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#be3144]">
                                        <span className="text-xs font-bold text-white">1</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Review Process</p>
                                    <p className="text-sm text-gray-600">Our team evaluates your responses</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#be3144]">
                                        <span className="text-xs font-bold text-white">2</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Decision Made</p>
                                    <p className="text-sm text-gray-600">We'll determine next steps</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#be3144]">
                                        <span className="text-xs font-bold text-white">3</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Notification</p>
                                    <p className="text-sm text-gray-600">You'll receive an email with results</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
                    <Button onClick={handleHomeClick} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg py-3 px-6 flex items-center justify-center space-x-2 transition duration-300 ease-in-out shadow-md border border-gray-300">
                        <Home className="h-5 w-5" />
                        <span>Return to Homepage</span>
                    </Button>
                    <Button onClick={handleOpportunitiesClick} className="flex-1 bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white rounded-lg py-3 px-6 flex items-center justify-center space-x-2 transition duration-300 ease-in-out shadow-md">
                        <span>View Other Opportunities</span>
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white text-gray-500 text-center py-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-sm">&copy; {new Date().getFullYear()} I-Hire. All rights reserved.</p>
                    <div className="mt-2 flex justify-center space-x-6">
                        <a href="#" className="text-gray-500 hover:text-[#be3144]">
                            <span className="sr-only">Privacy Policy</span>
                            <span className="text-sm">Privacy Policy</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#be3144]">
                            <span className="sr-only">Terms of Service</span>
                            <span className="text-sm">Terms</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#be3144]">
                            <span className="sr-only">Contact</span>
                            <span className="text-sm">Contact</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InterviewComplete;