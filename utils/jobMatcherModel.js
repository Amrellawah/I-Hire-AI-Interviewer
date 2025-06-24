import jobMatcherModel from './ModelLoader.js';

class JobMatcherService {
  constructor() {
    this.model = jobMatcherModel;
    this.modelAvailable = false;
  }

  /**
   * Initialize the model and check availability
   */
  async initializeModel() {
    try {
      await this.model.loadModel();
      this.modelAvailable = this.model.isLoaded;
      return this.modelAvailable;
    } catch (error) {
      // This is expected behavior in server environment
      console.log('Using fallback recommendation system (model not available in server environment)');
      this.modelAvailable = false;
      return false;
    }
  }

  /**
   * Extract candidate information from user profile and CV
   */
  extractCandidateInfo(userProfile, cvText = '') {
    const candidateInfo = {
      skills: userProfile.skills || [],
      experience: userProfile.experience || [],
      currentPosition: userProfile.currentPosition || '',
      education: userProfile.education || [],
      location: userProfile.location || '',
      cvText: cvText
    };

    // Create a comprehensive text representation of the candidate
    const candidateText = this.createCandidateText(candidateInfo);
    return candidateText;
  }

  /**
   * Create a comprehensive text representation of the candidate
   */
  createCandidateText(candidateInfo) {
    const parts = [];

    // Add current position
    if (candidateInfo.currentPosition) {
      parts.push(`current position: ${candidateInfo.currentPosition}`);
    }

    // Add skills
    if (candidateInfo.skills && candidateInfo.skills.length > 0) {
      parts.push(`skills: ${candidateInfo.skills.join(', ')}`);
    }

    // Add experience
    if (candidateInfo.experience && candidateInfo.experience.length > 0) {
      const experienceText = candidateInfo.experience
        .map(exp => `${exp.title} at ${exp.company} for ${exp.duration}`)
        .join(', ');
      parts.push(`experience: ${experienceText}`);
    }

    // Add education
    if (candidateInfo.education && candidateInfo.education.length > 0) {
      const educationText = candidateInfo.education
        .map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`)
        .join(', ');
      parts.push(`education: ${educationText}`);
    }

    // Add location
    if (candidateInfo.location) {
      parts.push(`location: ${candidateInfo.location}`);
    }

    // Add CV text if available
    if (candidateInfo.cvText) {
      // Truncate CV text to avoid overwhelming the model
      const truncatedCV = candidateInfo.cvText.substring(0, 1000);
      parts.push(`cv content: ${truncatedCV}`);
    }

    return parts.join(' ');
  }

  /**
   * Create job text representation for matching
   */
  createJobText(job) {
    const parts = [];

    // Add job title
    if (job.jobTitle) {
      parts.push(`job title: ${job.jobTitle}`);
    }

    // Add job description
    if (job.jobDescription) {
      parts.push(`description: ${job.jobDescription}`);
    }

    // Add required skills
    if (job.skills) {
      parts.push(`required skills: ${job.skills}`);
    }

    // Add job categories
    if (job.jobCategories && job.jobCategories.length > 0) {
      parts.push(`categories: ${job.jobCategories.join(', ')}`);
    }

    // Add experience requirements
    if (job.minExperience) {
      parts.push(`minimum experience: ${job.minExperience} years`);
    }

    // Add location
    if (job.city) {
      parts.push(`location: ${job.city}`);
    }

    // Add company information
    if (job.company) {
      parts.push(`company: ${job.company}`);
    }

    return parts.join(' ');
  }

  /**
   * Fallback recommendation system using basic matching
   */
  generateFallbackRecommendations(userProfile, jobs, limit = 10) {
    try {
      const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
      const userExperience = userProfile.experience || []; // This is an array of experiences
      const userCurrentPosition = (userProfile.currentPosition || '').toLowerCase();
      const userLocation = (userProfile.location || '').toLowerCase();
      
      const scoredJobs = jobs.map(job => {
        let score = 0;
        let reasons = [];
        let maxScore = 0;

        // Skills match (weight: 40)
        if (job.skills && userSkills.length > 0) {
          maxScore += 40;
          const jobSkills = job.skills.toLowerCase().split(',').map(s => s.trim());
          const skillMatches = userSkills.filter(skill =>
            jobSkills.some(jobSkill =>
              jobSkill.includes(skill) || skill.includes(jobSkill)
            )
          );
          if (skillMatches.length > 0) {
            const skillScore = Math.min(skillMatches.length * 10, 40);
            score += skillScore;
            reasons.push(`Skills match: ${skillMatches.join(', ')}`);
          }
        }

        // Experience match (weight: 20)
        if (job.minExperience && userExperience.length > 0) {
          maxScore += 20;
          // This is a simplification: comparing number of roles to years of experience.
          // A more accurate approach would be to parse durations from the experience objects.
          if (userExperience.length >= job.minExperience) {
            score += 20;
            reasons.push('Experience level suitable');
          }
        }

        // Category match (weight: 15)
        if (job.jobCategories && userCurrentPosition) {
          maxScore += 15;
          const categoryMatch = job.jobCategories.some(category =>
            category.toLowerCase().includes(userCurrentPosition) ||
            userCurrentPosition.includes(category.toLowerCase())
          );
          if (categoryMatch) {
            score += 15;
            reasons.push('Job category matches your background');
          }
        }

        // Location match (weight: 10)
        if (job.city && userLocation) {
          maxScore += 10;
          if (job.city.toLowerCase().includes(userLocation) ||
              userLocation.includes(job.city.toLowerCase())) {
            score += 10;
            reasons.push('Location preference match');
          }
        }

        // Job description match (weight: 15)
        if (job.jobDescription && userSkills.length > 0) {
          maxScore += 15;
          const desc = job.jobDescription.toLowerCase();
          let descMatches = [];
          userSkills.forEach(skill => {
            if (desc.includes(skill)) descMatches.push(skill);
          });
          
          if (descMatches.length > 0) {
            const descScore = Math.min(descMatches.length * 3, 15);
            score += descScore;
            reasons.push(`Job description keywords match: ${[...new Set(descMatches)].join(', ')}`);
          }
        }
        
        // Normalize to 0–100
        const matchScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        return {
          jobId: job.id,
          jobTitle: job.jobTitle,
          company: job.company || job.city,
          location: job.city,
          matchScore: matchScore,
          reason: reasons.join('; '),
          job: job
        };
      });

      return scoredJobs
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

    } catch (error) {
      console.error('Error in fallback recommendation scoring:', error);
      return [];
    }
  }

  /**
   * Generate job recommendations using the fine-tuned model
   */
  async generateRecommendations(userProfile, jobs, limit = 10, cvText = '') {
    try {
      // Try to initialize the model if not already available
      if (!this.modelAvailable) {
        await this.initializeModel();
      }

      // If model is available, use it
      if (this.modelAvailable) {
        // Extract candidate information with CV text if provided
        const candidateText = this.extractCandidateInfo(userProfile, cvText);

        // Prepare job candidates for matching
        const jobCandidates = jobs.map(job => ({
          id: job.id,
          text: this.createJobText(job),
          job: job
        }));

        // Use the fine-tuned model to find best matches
        const matches = await this.model.findBestMatches(
          candidateText,
          jobCandidates,
          limit
        );

        // Format the results
        const recommendations = matches.map(match => ({
          jobId: match.id,
          jobTitle: match.job.jobTitle,
          company: match.job.company || match.job.city,
          location: match.job.city,
          matchScore: match.matchScore,
          reason: this.generateMatchReason(match, userProfile, cvText),
          job: match.job
        }));

        return recommendations;
      } else {
        // Fallback to basic matching if model is not available
        console.log('Using fallback recommendation system');
        return this.generateFallbackRecommendations(userProfile, jobs, limit);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to basic matching on error
      console.log('Falling back to basic recommendation system due to error');
      return this.generateFallbackRecommendations(userProfile, jobs, limit);
    }
  }

  /**
   * Generate a human-readable reason for the match
   */
  generateMatchReason(match, userProfile, cvText = '') {
    const reasons = [];
    const similarity = match.similarity;

    // Add similarity-based reason
    if (similarity >= 0.8) {
      reasons.push('Excellent semantic match with your profile');
    } else if (similarity >= 0.6) {
      reasons.push('Strong semantic match with your background');
    } else if (similarity >= 0.4) {
      reasons.push('Good semantic alignment with your skills');
    } else {
      reasons.push('Moderate semantic match');
    }

    // Add CV-enhanced matching note if CV was used
    if (cvText) {
      reasons.push('Enhanced matching using your CV content');
    }

    // Add specific skill matches if available
    if (userProfile.skills && match.job.skills) {
      const userSkills = userProfile.skills.map(s => s.toLowerCase());
      const jobSkills = match.job.skills.toLowerCase().split(',').map(s => s.trim());
      
      const skillMatches = userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );

      if (skillMatches.length > 0) {
        reasons.push(`Skills match: ${skillMatches.slice(0, 3).join(', ')}`);
      }
    }

    // Add experience level match
    if (userProfile.experience && match.job.minExperience) {
      const userExperienceYears = userProfile.experience.length;
      if (userExperienceYears >= match.job.minExperience) {
        reasons.push('Experience level suitable');
      }
    }

    return reasons.join('; ');
  }

  /**
   * Process CV text and extract key information
   */
  async processCVText(cvText) {
    try {
      // Clean and normalize CV text
      const cleanedText = cvText
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      return cleanedText;
    } catch (error) {
      console.error('Error processing CV text:', error);
      return cvText;
    }
  }

  /**
   * Get model status
   */
  async getModelStatus() {
    try {
      if (!this.modelAvailable) {
        await this.initializeModel();
      }
      
      return {
        loaded: this.modelAvailable,
        status: this.modelAvailable ? 'ready' : 'fallback',
        message: this.modelAvailable ? 'Fine-tuned model loaded successfully' : 'Using fallback recommendation system'
      };
    } catch (error) {
      return {
        loaded: false,
        status: 'error',
        error: error.message,
        message: 'Using fallback recommendation system'
      };
    }
  }
}

// Create a singleton instance
const jobMatcherService = new JobMatcherService();

export default jobMatcherService; 