"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/OpenAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";


export default function AddNewInterview() {
    const [interviewType, setInterviewType] = useState(""); // Initially empty, user selects one
    const [openDialog, setOpenDialog] = useState(false);

    // Technical Interview States
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobRes, setJobRes] = useState("");
    const [jobReq, setJobReq] = useState("");
    const [perfSkills, setPerfSkills] = useState("");
    const [careerLevel, setCareerLevel] = useState("");
    const [jobExperience, setJobExperience] = useState("");

    // Behavioral Interview States
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [achievements, setAchievements] = useState("");
    const [projects, setProjects] = useState("");

    const [jsonResponse, setJsonResponse] = useState(null)
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const resetForm = () => {
        setInterviewType("");
        setJobPosition("");
        setJobDesc("");
        setJobRes("");
        setJobReq("");
        setPerfSkills("");
        setCareerLevel("");
        setJobExperience("");
        setSkills("");
        setEducation("");
        setAchievements("");
        setProjects("");
        setJsonResponse(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let prompt = "";

        if (interviewType === "technical") {
        prompt = 
        `Job Details:
        - Job Position: ${jobPosition}
        - Job Description: ${jobDesc}
        - Job Responsibilities: ${jobRes}
        - Job Requirements: ${jobReq}
        - Preferred Skills: ${perfSkills}
        - Experience Needed: ${jobExperience}
        - Career Level: ${careerLevel}

        ---
        ### Rules for Generating Questions:

        
        
        1. Job Position(2-4 questions):
        - Start with introductory questions about the candidate's familiarity with the role.
        - Include experience-based questions to assess prior knowledge.
        

        2. Job Description(2-4 questions):
        - Generate situational and advanced questions related to the career level.
        - Focus on real-world problem-solving within the job function.
        

        3. Job Responsibilities(2-4 questions):
        - Create scenario-based and decision-making questions.
        - Cover each key responsibility uniquely.
        - Ensure that every question is role-specific and distinct.

        4. Job Requirements(2-4 questions):
        - Generate technical and skill-based questions that validate competencies.
        - Each required skill should have a dedicated question.
        

        5. Preferred Skills(2-4 questions) (If Provided):
        - Create in-depth questions focusing on these skills.
        

        6. Experience Needed(2-4 questions) (If Preferred Skills Are Absent):
        - Include behavioral interview questions that assess past performance.
        

        7. Career Level(2-4 questions):
        - If entry-level, focus on *learning potential and fundamental skills.
        - If mid-level, emphasize *problem-solving, teamwork, and ownership.
        - If senior-level, assess *leadership, mentorship, and strategic thinking.
        - Ensure the questions match the level of responsibility expected.

        ---
        ### Output Rules:

        - Ensure the total number of questions is between 20 and 25.
        - Ensure a mix of question types (e.g., behavioral, technical, situational, strategic).
        - Do not over-rely on any single type unless explicitly required by the job role.

        ---
        
        ### JSON Output Format:
        \\\`json
        [
          { 
            "question": "text",
            "answer": "",
          },
        ]
        \\\`
        `
        } else if (interviewType === "behavioral") {
        prompt = 
        `
        Candidate Information:
            Skills: ${skills},  
            Education: ${education},  
            Achievements: ${achievements},  
            Projects: ${projects},

        ---

        ### Rules for Question Generation:

        #### 1. Background & Icebreaker Questions (2 questions)  
        - Help the candidate ease into the conversation while gathering valuable insight.  
        - Include:  
        - "Tell me about yourself."  
        - "What are your strengths and weaknesses?"

        #### 2. Motivation & Career Goals (2 questions)  
        - Explore the candidate’s personal drive, ambitions, and cultural alignment.  
        - Include:  
        - "Why do you want to work for our company?"  
        - "What motivates you to perform well?"

        #### 3. Skills-Based Questions (1–2 questions)  
        - Assess communication skills,presentation abilities,problem-solving,collaboration,adaptability and *other soft skills* relevant to the role.  
        - Include one question testing how multiple skills interact in realistic, domain-relevant situations.  
        - If soft skills are present (e.g., leadership, communication), design questions that test practical application.

        #### 4. Project-Based Questions (2 questions)  
        - Evaluate *role, **challenges faced, **decision-making, **collaboration, and **overall behavioral approach*.  
        - Example:  
        - "If given unlimited resources, how would you enhance this project?"  
        - "Describe a project that didn’t go as planned and what you learned."

        #### 5. Achievements-Based Questions (2 questions)  
        - Explore the impact, effort, and significance of key accomplishments.  
        - Include one reflective question about how past success shapes future actions.

        #### 6. Education-Based Questions (2 questions)  
        - Analyze how formal education influences problem-solving or strategic thinking.  
        - Include one challenge-based question applying theoretical knowledge to practical problems.

        #### 7. Behavioral Questions (2 questions)  
        - Use the STAR method (Situation, Task, Action, Result) to probe past behavior.  
        - Example:  
        - One question about conflict resolution.  
        - One testing leadership or teamwork under pressure.

        #### 8. Situational Questions (2 questions)  
        - Pose realistic hypotheticals based on domain and experience level.  
        - Avoid overlap with earlier categories.  
        - Example:  
        - One ethical dilemma focused on professional integrity, fairness, or stakeholder conflict.

        #### 9. Stress-Based Questions (2 questions)  
        - Gauge decision-making under tight timelines, uncertainty, or resource conflict.  
        - Example:  
        - One question requiring a choice between two equally critical priorities.

        #### 10. Cultural Fit Questions (2 questions)  
        - Assess alignment with team dynamics, adaptability, and values.  
        - Example:  
        - One question on adapting to new work environments.  
        - One on maintaining positive team influence.

        ---

        ### JSON Output Format:
            \\\`json
            [
              { 
                "question": "text",
                "answer": "",
              },
            ]
            \\\`
        `;
        }

    try {
        const aiResponse = await chatSession(
            prompt,
            interviewType,
            jobPosition,
            careerLevel,
            jobExperience
          );

        if (!aiResponse) throw new Error("Failed to get AI response.");

        const mockJsonResp = aiResponse
            .replace("```json", "")
            .replace("```", "")
            .trim();

        console.log("AI Response:", mockJsonResp);
        setJsonResponse(mockJsonResp);
        
        const resp = await db
            .insert(MockInterview)
            .values({
            mockId: uuidv4(),
            jsonMockResp: mockJsonResp,
            jobPosition,
            jobDesc,
            jobRes,
            jobReq,
            perfSkills,
            careerLevel,
            jobExperience,
            skills,
            education,
            achievements,
            projects,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
            interviewType
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp.length > 0) {
        resetForm();
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate interview questions");
        } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New AI Interview</h2>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setOpenDialog(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {interviewType
                ? `${
                    interviewType.charAt(0).toUpperCase() +
                    interviewType.slice(1)
                  } Interview`
                : "Select Interview Type"}
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                {/* Select Interview Type */}
                {!interviewType && (
                  <div className="my-3">
                    <label>Interview Type</label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="">Select Interview Type</option>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                    </select>
                  </div>
                )}

                {/* Form for Technical Interview */}
                {interviewType === "technical" && (
                  <>
                    <div className='mt-4 my-3'>
                        <label>Job Role/Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required
                            onChange={(event) => setJobPosition(event.target.value)} />
                    </div>
                    <div className='my-3'>
                        <label>Job Description</label>
                        <Textarea placeholder="Ex. Join us as a [Job Title] to [core responsibility]." required
                            onChange={(event) => setJobDesc(event.target.value)} />
                    </div>
                    <div className='my-3'>
                        <label>Job Responsibilities</label>
                        <Textarea placeholder="Ex. Join us as a [Job Title] to [core responsibility]." required
                            onChange={(event) => setJobRes(event.target.value)} />
                    </div>
                    <div className='my-3'>
                        <label>Job Requirements</label>
                        <Textarea 
                            placeholder={`Ex.🔹 Skills: {Key technical & soft skills} `}
                            required
                            onChange={(event) => setJobReq(event.target.value)}
                        />
                    </div>
                    <div className='my-3'>
                        <label>Preferred Skills (Not Mandatory)</label>
                        <Input placeholder="Ex. Experienced (Non-Manager)" required
                            onChange={(event) => setPerfSkills(event.target.value)} />
                    </div>
                    <div className='my-3'>
                        <label>Career Level</label>
                        <Input placeholder="Ex. Experienced (Non-Manager)" required
                            onChange={(event) => setCareerLevel(event.target.value)} />
                    </div>
                    <div className='my-3'>
                        <label>Experience Needed</label>
                        <Input placeholder="Ex. Years of Experience Needed" required
                            onChange={(event) => setJobExperience(event.target.value)} />
                    </div>
                  </>
                )}

                {/* Form for Behavioral Interview */}
                {interviewType === "behavioral" && (
                  <>
                            <div className="mt-4 my-3">
                                <label>Skills</label>
                                <Textarea
                                placeholder="e.g., React, Node.js, Leadership, Problem-solving"
                                required
                                onChange={(e) => setSkills(e.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Education</label>
                                <Textarea
                                placeholder="e.g., BSc in Computer Science, MBA..."
                                required
                                onChange={(e) => setEducation(e.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Achievements</label>
                                <Textarea
                                placeholder="e.g., Hackathon winner, Published research..."
                                required
                                onChange={(e) => setAchievements(e.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Projects</label>
                                <Textarea
                                placeholder="e.g., E-commerce website, AI chatbot..."
                                required
                                onChange={(e) => setProjects(e.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Experience Needed</label>
                                <Input
                                placeholder="Ex. 5"
                                max="100"
                                type="number"
                                required
                                onChange={(event) => setJobExperience(event.target.value)}
                                />
                            </div>
                  </>
                )}

                {/* --- Buttons --- */}
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      resetForm();
                      setOpenDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating...
                      </>
                    ) : (
                      "Generate Questions"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}