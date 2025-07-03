"use client"
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, ArrowRight, Copy, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense } from 'react';

// Separate component that uses useSearchParams
function InterviewSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockId = searchParams.get('mockId');
  const jobPosition = searchParams.get('jobPosition');
  const interviewType = searchParams.get('interviewType');

  const interviewUrl = mockId ? `${process.env.NEXT_PUBLIC_HOST_URLL}/interview/${mockId}` : '';

  const copyLink = () => {
    if (interviewUrl) {
      navigator.clipboard.writeText(interviewUrl);
      toast.success('Interview link copied to clipboard!', {
        position: 'top-center'
      });
    }
  };

  const onSend = () => {
    if (interviewUrl) {
      window.location.href = `mailto:?subject=AICruiter Interview Link&body=Please find your interview link below:%0D%0A%0D%0A${interviewUrl}%0D%0A%0D%0ABest regards,%0D%0AThe Hiring Team`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Created Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Your {interviewType || 'mock'} interview for <span className="font-semibold">{jobPosition || 'the position'}</span> has been created and is ready to use.
          </p>
        </div>

        {/* Interview Link Card */}
        {interviewUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Interview Link</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Share this link with candidates to start the interview process:
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={interviewUrl}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button onClick={copyLink} className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <Button onClick={onSend} variant="outline" className="w-full flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send via Email
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push('/dashboard/scheduled-interview')}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Scheduled Jobs
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You can manage all your interviews from the Scheduled Jobs page.</p>
          <p className="mt-1">Candidates can start the interview immediately using the link above.</p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function InterviewSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-200 rounded-full w-20 h-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function InterviewSuccessPage() {
  return (
    <Suspense fallback={<InterviewSuccessLoading />}>
      <InterviewSuccessContent />
    </Suspense>
  );
} 