"use client"
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CVUploadComponent() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };
  
  // Handle file selection
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file) => {
    // Check file type (PDF, DOCX, etc.)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setErrorMessage('Please upload a PDF or DOCX file only.');
      return;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadStatus('error');
      setErrorMessage('File size should be less than 10MB.');
      return;
    }
    
    setFile(file);
    setUploadStatus(null);
    setErrorMessage('');
  };
  
  // Handle file upload and parsing
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus(null);
    setErrorMessage('');
    setParsedData(null);
    setFeedback('');
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('cv', file);
      
      // Upload to API
      const response = await fetch('/api/cv-parse', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Send extracted text to CV analysis API
      const analysisResponse = await fetch('/api/cv-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: data.text }),
      });
      
      const analysisData = await analysisResponse.json();
      
      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || 'Analysis failed');
      }
      
      setParsedData(analysisData);
      setUploadStatus('success');
      
      // Send extracted text to feedback API
      if (data.text) {
        setIsFeedbackLoading(true);
        const feedbackRes = await fetch('/api/cv-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvText: data.text }),
        });
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData.feedback);
        setIsFeedbackLoading(false);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'There was an error processing your CV. Please try again.');
      setIsFeedbackLoading(false);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging 
            ? 'border-[#be3144] bg-[#be3144]/5' 
            : 'border-[#e4d3d5] hover:border-[#be3144]/50 hover:bg-[#f1e9ea]'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#f1e9ea] rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-[#be3144]" />
          </div>
          
          <h3 className="text-xl font-medium text-[#191011] mb-2">
            Upload your CV
          </h3>
          
          <p className="text-[#8e575f] mb-6 max-w-md">
            Drag and drop your CV file here, or click to browse
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.docx"
            className="hidden"
          />
          
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="border-[#be3144] text-[#be3144] hover:bg-[#be3144]/10"
          >
            Browse Files
          </Button>
          
          {file && (
            <div className="mt-6 flex items-center gap-2 text-[#191011]">
              <FileText className="w-5 h-5 text-[#be3144]" />
              <span className="font-medium">{file.name}</span>
              <span className="text-sm text-[#8e575f]">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>
      
      {file && (
        <div className="mt-6">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Upload and Parse CV'
            )}
          </Button>
        </div>
      )}
      
      {uploadStatus && (
        <div className={`mt-6 p-4 rounded-lg ${
          uploadStatus === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {uploadStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={uploadStatus === 'success' ? 'text-green-700' : 'text-red-700'}>
              {uploadStatus === 'success' 
                ? 'CV uploaded and parsed successfully!' 
                : errorMessage || 'There was an error processing your CV. Please try again.'}
            </span>
          </div>
        </div>
      )}
      
      {parsedData && (
        <div className="mt-8 bg-white border border-[#e4d3d5] rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#191011] mb-4">
            Extracted Information
          </h3>
          
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-md font-semibold text-[#be3144] mb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedData.name && (
                  <div>
                    <p className="text-sm text-[#8e575f] mb-1">Name</p>
                    <p className="text-[#191011]">{parsedData.name}</p>
                  </div>
                )}
                {parsedData.email && (
                  <div>
                    <p className="text-sm text-[#8e575f] mb-1">Email</p>
                    <p className="text-[#191011]">{parsedData.email}</p>
                  </div>
                )}
                {parsedData.phone && (
                  <div>
                    <p className="text-sm text-[#8e575f] mb-1">Phone</p>
                    <p className="text-[#191011]">{parsedData.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Education</h4>
                <div className="space-y-3">
                  {parsedData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-[#e4d3d5] pl-4">
                      <p className="font-medium text-[#191011]">{edu.degree}</p>
                      <p className="text-[#8e575f]">{edu.institution}</p>
                      <p className="text-sm text-[#8e575f]">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.experience && parsedData.experience.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Work Experience</h4>
                <div className="space-y-4">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-[#e4d3d5] pl-4">
                      <p className="font-medium text-[#191011]">{exp.position}</p>
                      <p className="text-[#8e575f]">{exp.company}</p>
                      <p className="text-sm text-[#8e575f]">{exp.duration}</p>
                      {exp.responsibilities && (
                        <ul className="mt-2 list-disc list-inside text-[#191011]">
                          {Array.isArray(exp.responsibilities) 
                            ? exp.responsibilities.map((resp, idx) => (
                                <li key={idx} className="text-sm">{resp}</li>
                              ))
                            : <li className="text-sm">{exp.responsibilities}</li>
                          }
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#f1e9ea] text-[#be3144] rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {parsedData.languages && parsedData.languages.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#f1e9ea] text-[#be3144] rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {parsedData.certifications && parsedData.certifications.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Certifications</h4>
                <div className="space-y-2">
                  {parsedData.certifications.map((cert, index) => (
                    <p key={index} className="text-[#191011]">{cert}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#be3144] mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#be3144]" /> CV Feedback
            </h3>
            {isFeedbackLoading ? (
              <div className="flex items-center gap-2 text-[#8e575f]">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating feedback...
              </div>
            ) : feedback ? (
              <div className="bg-[#f1e9ea] p-4 rounded-lg text-[#191011] whitespace-pre-line">{feedback}</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}