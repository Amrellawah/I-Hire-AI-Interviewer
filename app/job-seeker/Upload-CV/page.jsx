"use client"
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lightbulb, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CVUploadComponent from './_components/CVUploadComponent';

export default function CVUploadPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);
  
  if (!isLoaded || !user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#f1e9ea] px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent">I-Hire</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden md:flex items-center gap-2 border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea] transition-colors"
              onClick={() => router.push('/employer')}
            >
              <span>For Employers</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            {isLoaded && user && (
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] hover:border-[#be3144] transition-colors shadow-sm">
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/job-seeker" 
            className="inline-flex items-center text-[#8e575f] hover:text-[#be3144] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Seeker Dashboard
          </Link>
        </div>
        
        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#191011] mb-4">
            Upload Your CV
          </h1>
          <p className="text-[#8e575f] max-w-2xl mx-auto">
            Upload your CV to automatically extract your information and improve your job matching. 
            We support PDF and DOCX formats.
          </p>
        </div>
        
        {/* CV Upload Component */}
        <CVUploadComponent />
        
        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-xl border border-[#e4d3d5] p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#191011] mb-4">
            Why Upload Your CV?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-[#be3144] mb-2">Better Job Matching</h3>
              <p className="text-[#8e575f]">
                Our AI analyzes your CV to match you with the most relevant job opportunities based on your skills and experience.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#be3144] mb-2">Personalized Interviews</h3>
              <p className="text-[#8e575f]">
                Get interview practice tailored to your background and the specific jobs you're applying for.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#be3144] mb-2">Time Saving</h3>
              <p className="text-[#8e575f]">
                No need to manually enter your information. Our CV parser extracts all relevant details automatically.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}