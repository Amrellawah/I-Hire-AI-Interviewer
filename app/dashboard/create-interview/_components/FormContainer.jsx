import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '@/utils/Constants'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function FormContainer({ onHandleInputChange, GoToNext }) {
    const [interviewType, setInterviewType] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (interviewType) {
            onHandleInputChange('type', interviewType)
        }
    }, [interviewType])

    const AddInterviewType = (type) => {
        const data = interviewType.includes(type);
        if (!data) {
            setInterviewType(prev => [...prev, type])
        } else {
            const result = interviewType.filter(item => item != type);
            setInterviewType(result);
        }
    }

    const handleCategoryChange = (value) => {
        setCategory(value);
        setError("");
        onHandleInputChange('category', value);
    }

    const handleSubmit = () => {
        if (!category) {
            setError("Please select a job category.");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            GoToNext();
            setIsSubmitting(false);
        }, 500);
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto'
        >
            <div className='mb-8'>
                <p className='text-gray-500'>Fill in the details to generate customized interview questions</p>
            </div>
            
            <div className='space-y-8'>
                {/* Job Position */}
                <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>Job Position <span className='text-red-500'>*</span></label>
                    <Input 
                        placeholder="e.g. Full Stack Developer" 
                        className='mt-1 h-12 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors'
                        onChange={(event) => onHandleInputChange('jobPosition', event.target.value)} 
                    />
                    <p className='text-xs text-gray-400 mt-1'>Enter the job title you're hiring for</p>
                </div>

                {/* Job Description */}
                <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>Job Description <span className='text-red-500'>*</span></label>
                    <Textarea 
                        placeholder="Enter job description details including responsibilities, requirements, etc." 
                        className='h-[150px] mt-1 text-base border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors' 
                        onChange={(event) => onHandleInputChange('jobDescription', event.target.value)} 
                    />
                    <p className='text-xs text-gray-400 mt-1'>Detailed descriptions yield better question recommendations</p>
                </div>

                {/* Job Category */}
                <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>Job Category <span className='text-red-500'>*</span></label>
                    <Select onValueChange={handleCategoryChange} value={category}>
                        <SelectTrigger className="w-full h-12 text-base border-gray-300 focus:ring-2 focus:ring-primary/50">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-lg max-h-72 overflow-y-auto">
                            <SelectItem value="Accounting/Finance">Accounting/Finance</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Banking">Banking</SelectItem>
                            <SelectItem value="R&D/Science">R&D/Science</SelectItem>
                            <SelectItem value="Engineering - Construction/Civil/Architecture">Engineering - Construction/Civil/Architecture</SelectItem>
                            <SelectItem value="Business Development">Business Development</SelectItem>
                            <SelectItem value="Creative/Design/Art">Creative/Design/Art</SelectItem>
                            <SelectItem value="Customer Service/Support">Customer Service/Support</SelectItem>
                            <SelectItem value="Writing/Editorial">Writing/Editorial</SelectItem>
                            <SelectItem value="Hospitality/Hotels/Food Services">Hospitality/Hotels/Food Services</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Installation/Maintenance/Repair">Installation/Maintenance/Repair</SelectItem>
                            <SelectItem value="IT/Software Development">IT/Software Development</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Logistics/Supply Chain">Logistics/Supply Chain</SelectItem>
                            <SelectItem value="Operations/Management">Operations/Management</SelectItem>
                            <SelectItem value="Manufacturing/Production">Manufacturing/Production</SelectItem>
                            <SelectItem value="Marketing/PR/Advertising">Marketing/PR/Advertising</SelectItem>
                            <SelectItem value="Medical/Healthcare">Medical/Healthcare</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Project/Program Management">Project/Program Management</SelectItem>
                            <SelectItem value="Quality">Quality</SelectItem>
                            <SelectItem value="Analyst/Research">Analyst/Research</SelectItem>
                            <SelectItem value="Sales/Retail">Sales/Retail</SelectItem>
                            <SelectItem value="Media/Journalism/Publishing">Media/Journalism/Publishing</SelectItem>
                            <SelectItem value="Sports and Leisure">Sports and Leisure</SelectItem>
                            <SelectItem value="Fashion">Fashion</SelectItem>
                            <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                            <SelectItem value="Tourism/Travel">Tourism/Travel</SelectItem>
                            <SelectItem value="Purchasing/Procurement">Purchasing/Procurement</SelectItem>
                            <SelectItem value="Strategy/Consulting">Strategy/Consulting</SelectItem>
                            <SelectItem value="C-Level Executive/GM/Director">C-Level Executive/GM/Director</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-400 mt-1'>Choose the job category for filtering</p>
                    {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
                </div>

                {/* Interview Duration */}
                <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>Interview Duration <span className='text-red-500'>*</span></label>
                    <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                        <SelectTrigger className="w-full h-12 text-base border-gray-300 focus:ring-2 focus:ring-primary/50">
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300 shadow-lg">
                            <SelectItem value="5 Min" className="text-base hover:bg-gray-50">5 Min</SelectItem>
                            <SelectItem value="15 Min" className="text-base hover:bg-gray-50">15 Min</SelectItem>
                            <SelectItem value="30 Min" className="text-base hover:bg-gray-50">30 Min</SelectItem>
                            <SelectItem value="45 Min" className="text-base hover:bg-gray-50">45 Min</SelectItem>
                            <SelectItem value="60 Min" className="text-base hover:bg-gray-50">60 Min</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-400 mt-1'>Select the expected duration of the interview</p>
                </div>

                {/* Interview Type */}
                <div className='space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>Interview Type <span className='text-red-500'>*</span></label>
                    <p className='text-xs text-gray-400 mb-2'>Select one or more interview formats</p>
                    <div className='flex gap-3 flex-wrap mt-2'>
                        {InterviewType.map((type, index) => (
                            <motion.button
                                key={index}
                                type="button"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center transition-all duration-200
                                    gap-2 p-2 px-4 bg-white border 
                                    border-gray-300 rounded-full 
                                    hover:bg-gray-50 hover:border-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-primary/50
                                    ${
                                        interviewType.includes(type.title) 
                                        ? 'bg-red-50 border-red-300 text-red-600 font-medium shadow-sm' 
                                        : 'text-gray-700'
                                    }`}
                                onClick={() => AddInterviewType(type.title)}
                            >
                                <type.icon className='h-4 w-4' />
                                <span className="text-sm">{type.title}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className='pt-6 flex justify-end border-t border-gray-100'>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`h-12 px-8 text-base font-medium bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-md transition-all ${
                                isSubmitting ? 'opacity-80' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                'Generating...'
                            ) : (
                                <>
                                    Generate Questions 
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default FormContainer