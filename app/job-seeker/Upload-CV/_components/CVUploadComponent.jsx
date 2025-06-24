"use client"
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, MessageCircle, X, Download, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';

export default function CVUploadComponent() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  // Get user from Clerk authentication
  const { user, isLoaded } = useUser();
  
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

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    setErrorMessage('');
    setParsedData(null);
    setEditableData(null);
    setFeedback('');
    setUploadProgress(0);
    setIsEditing(false);
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
    
    // Check if user is authenticated
    if (!isLoaded) {
      setUploadStatus('error');
      setErrorMessage('Please wait while we load your account information.');
      return;
    }
    
    if (!user) {
      setUploadStatus('error');
      setErrorMessage('Please sign in to upload your CV.');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus(null);
    setErrorMessage('');
    setParsedData(null);
    setEditableData(null);
    setFeedback('');
    setUploadProgress(0);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('cv', file);
      
      // Upload to API
      const response = await fetch('/api/cv-parse', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(30); // Update progress after initial upload
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setUploadProgress(50); // Update progress before analysis
      
      // Use Clerk user ID for CV analysis
      const userId = user.id;
      const userEmail = user.primaryEmailAddress?.emailAddress;
      
      // Send extracted text to CV analysis API with user ID
      const analysisResponse = await fetch('/api/cv-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cvText: data.text,
          userId: userId,
          originalFileName: file.name,
          extractedText: data.text
        }),
      });
      
      const analysisData = await analysisResponse.json();
      
      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || 'Analysis failed');
      }
      
      setUploadProgress(80); // Update progress after analysis
      
      setParsedData(analysisData);
      setEditableData(JSON.parse(JSON.stringify(analysisData))); // Deep copy for editing
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
      
      setUploadProgress(100); // Complete progress
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'There was an error processing your CV. Please try again.');
      setIsFeedbackLoading(false);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadCV = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveProfile = async () => {
    if (!parsedData || !user) {
      setErrorMessage('Please ensure you have parsed data and are signed in.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress || parsedData.email,
          name: parsedData.name || user.fullName,
          phone: parsedData.phone,
          skills: parsedData.skills || [],
          languages: parsedData.languages || [],
          certifications: parsedData.certifications || [],
          education: parsedData.education || null,
          experience: parsedData.experience || null,
          isProfileComplete: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setUploadStatus('success');
      setErrorMessage('');
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit functionality
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setParsedData(JSON.parse(JSON.stringify(editableData)));
      setIsEditing(false);
    } else {
      // Start editing
      setEditableData(JSON.parse(JSON.stringify(parsedData)));
      setIsEditing(true);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleArrayChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const addEducation = () => {
    setEditableData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', institution: '', year: '' }]
    }));
  };

  const removeEducation = (index) => {
    setEditableData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setEditableData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { position: '', company: '', duration: '', responsibilities: [] }]
    }));
  };

  const removeExperience = (index) => {
    setEditableData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleResponsibilityChange = (expIndex, respIndex, value) => {
    setEditableData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          responsibilities: exp.responsibilities.map((resp, j) => 
            j === respIndex ? value : resp
          )
        } : exp
      )
    }));
  };

  const addResponsibility = (expIndex) => {
    setEditableData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          responsibilities: [...(exp.responsibilities || []), '']
        } : exp
      )
    }));
  };

  const removeResponsibility = (expIndex, respIndex) => {
    setEditableData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex)
        } : exp
      )
    }));
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Authentication Status */}
      {!isLoaded && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading your account...</span>
          </div>
        </div>
      )}
      
      {isLoaded && !user && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span>Please sign in to upload your CV and save your profile.</span>
          </div>
        </div>
      )}
      
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
            Drag and drop your CV file here, or click to browse. Supported formats: PDF, DOCX
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
            disabled={!isLoaded || !user}
          >
            Browse Files
          </Button>
          
          {file && (
            <div className="mt-6 flex items-center gap-2 text-[#191011] bg-[#f1e9ea] p-3 rounded-lg">
              <FileText className="w-5 h-5 text-[#be3144]" />
              <span className="font-medium">{file.name}</span>
              <span className="text-sm text-[#8e575f]">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                onClick={handleRemoveFile}
                className="ml-2 p-1 hover:bg-[#be3144]/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#be3144]" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {file && (
        <div className="mt-6 space-y-4">
          <Button
            onClick={handleUpload}
            disabled={isUploading || !isLoaded || !user}
            className="w-full bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : !isLoaded ? (
              'Loading...'
            ) : !user ? (
              'Please Sign In'
            ) : (
              'Upload and Parse CV'
            )}
          </Button>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-[#8e575f] text-center">
                {uploadProgress < 30 ? 'Uploading file...' :
                 uploadProgress < 50 ? 'Extracting text...' :
                 uploadProgress < 80 ? 'Analyzing content...' :
                 'Generating feedback...'}
              </p>
            </div>
          )}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#191011]">
              Extracted Information
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="border-[#be3144] text-[#be3144] hover:bg-[#be3144]/10"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Information'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCV}
                className="border-[#be3144] text-[#be3144] hover:bg-[#be3144]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save to Profile'}
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-md font-semibold text-[#be3144] mb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8e575f] mb-1">Name</p>
                  {isEditing ? (
                    <Input
                      value={editableData.name || ''}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="border-[#e4d3d5] focus:border-[#be3144]"
                    />
                  ) : (
                    <p className="text-[#191011]">{parsedData.name || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#8e575f] mb-1">Email</p>
                  {isEditing ? (
                    <Input
                      value={editableData.email || ''}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="border-[#e4d3d5] focus:border-[#be3144]"
                    />
                  ) : (
                    <p className="text-[#191011]">{parsedData.email || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#8e575f] mb-1">Phone</p>
                  {isEditing ? (
                    <Input
                      value={editableData.phone || ''}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="border-[#e4d3d5] focus:border-[#be3144]"
                    />
                  ) : (
                    <p className="text-[#191011]">{parsedData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Education */}
            {(parsedData.education && parsedData.education.length > 0) || isEditing ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold text-[#be3144]">Education</h4>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEducation}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Education
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {(isEditing ? editableData.education : parsedData.education)?.map((edu, index) => (
                    <div key={index} className="border-l-2 border-[#e4d3d5] pl-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              value={edu.degree || ''}
                              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              placeholder="Degree (e.g., BSc Computer Science)"
                              className="border-[#e4d3d5] focus:border-[#be3144]"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="ml-2 border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={edu.institution || ''}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="Institution (e.g., Stanford University)"
                            className="border-[#e4d3d5] focus:border-[#be3144]"
                          />
                          <Input
                            value={edu.year || ''}
                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                            placeholder="Year (e.g., 2020 or 2017-2021)"
                            className="border-[#e4d3d5] focus:border-[#be3144]"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-[#191011]">{edu.degree}</p>
                          <p className="text-[#8e575f]">{edu.institution}</p>
                          <p className="text-sm text-[#8e575f]">{edu.year}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Experience */}
            {(parsedData.experience && parsedData.experience.length > 0) || isEditing ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold text-[#be3144]">Work Experience</h4>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addExperience}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Experience
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {(isEditing ? editableData.experience : parsedData.experience)?.map((exp, index) => (
                    <div key={index} className="border-l-2 border-[#e4d3d5] pl-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              value={exp.position || ''}
                              onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                              placeholder="Position (e.g., Software Engineer)"
                              className="border-[#e4d3d5] focus:border-[#be3144]"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              className="ml-2 border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={exp.company || ''}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Company (e.g., Microsoft)"
                            className="border-[#e4d3d5] focus:border-[#be3144]"
                          />
                          <Input
                            value={exp.duration || ''}
                            onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                            placeholder="Duration (e.g., Jan 2019 - Mar 2023)"
                            className="border-[#e4d3d5] focus:border-[#be3144]"
                          />
                          <div>
                            <p className="text-sm text-[#8e575f] mb-1">Responsibilities</p>
                            <div className="space-y-2">
                              {exp.responsibilities?.map((resp, respIndex) => (
                                <div key={respIndex} className="flex items-center gap-2">
                                  <Input
                                    value={resp}
                                    onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                                    placeholder="Responsibility"
                                    className="border-[#e4d3d5] focus:border-[#be3144]"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeResponsibility(index, respIndex)}
                                    className="border-red-600 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addResponsibility(index)}
                                className="border-green-600 text-green-600 hover:bg-green-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Responsibility
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Skills */}
            {(parsedData.skills && parsedData.skills.length > 0) || isEditing ? (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Skills</h4>
                {isEditing ? (
                  <Textarea
                    value={(editableData.skills || []).join(', ')}
                    onChange={(e) => handleArrayChange('skills', e.target.value)}
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    className="border-[#e4d3d5] focus:border-[#be3144] min-h-[80px]"
                  />
                ) : (
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
                )}
              </div>
            ) : null}

            {/* Languages */}
            {(parsedData.languages && parsedData.languages.length > 0) || isEditing ? (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Languages</h4>
                {isEditing ? (
                  <Textarea
                    value={(editableData.languages || []).join(', ')}
                    onChange={(e) => handleArrayChange('languages', e.target.value)}
                    placeholder="Enter languages separated by commas (e.g., English, Spanish, French)"
                    className="border-[#e4d3d5] focus:border-[#be3144] min-h-[80px]"
                  />
                ) : (
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
                )}
              </div>
            ) : null}

            {/* Certifications */}
            {(parsedData.certifications && parsedData.certifications.length > 0) || isEditing ? (
              <div>
                <h4 className="text-md font-semibold text-[#be3144] mb-2">Certifications</h4>
                {isEditing ? (
                  <Textarea
                    value={(editableData.certifications || []).join(', ')}
                    onChange={(e) => handleArrayChange('certifications', e.target.value)}
                    placeholder="Enter certifications separated by commas (e.g., AWS Certified Developer, PMP)"
                    className="border-[#e4d3d5] focus:border-[#be3144] min-h-[80px]"
                  />
                ) : (
                  <div className="space-y-2">
                    {parsedData.certifications.map((cert, index) => (
                      <p key={index} className="text-[#191011]">{cert}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Feedback Section */}
          <div className="mt-8 pt-6 border-t border-[#e4d3d5]">
            <h3 className="text-lg font-bold text-[#be3144] mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#be3144]" /> CV Feedback
            </h3>
            {isFeedbackLoading ? (
              <div className="flex items-center gap-2 text-[#8e575f]">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating feedback...
              </div>
            ) : feedback ? (
              <div className="bg-[#f1e9ea] p-4 rounded-lg text-[#191011] whitespace-pre-line">
                {feedback}
              </div>
            ) : null}
          </div>

          {/* Save Status */}
          {parsedData.saved && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">CV data has been saved to your profile for job recommendations</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}