import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  AlertCircle,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Default label templates
const DEFAULT_LABEL_TEMPLATES = {
  technical: [
    "Technical Accuracy",
    "Problem-Solving Approach", 
    "Depth of Knowledge",
    "Practical Application",
    "Relevance to Question",
    "Answer Structure",
    "Clarity of Expression",
    "Communication Skills",
    "Confidence Level",
    "Answer Completeness"
  ],
  behavioral: [
    "Communication Skills",
    "Leadership",
    "Team Dynamics", 
    "Cultural Fit",
    "Adaptability",
    "Stress Management",
    "Problem-Solving Approach",
    "Practical Application",
    "Relevance to Question",
    "Answer Structure"
  ],
  leadership: [
    "Leadership",
    "Team Dynamics",
    "Innovation",
    "Impact",
    "Professional Maturity",
    "Communication Skills",
    "Problem-Solving Approach",
    "Adaptability",
    "Strategic Thinking",
    "Influence"
  ],
  general: [
    "Relevance to Question",
    "Communication Skills",
    "Answer Structure",
    "Clarity of Expression",
    "Confidence Level",
    "Answer Completeness",
    "Professional Maturity",
    "Learning Ability",
    "Cultural Fit",
    "Adaptability"
  ]
};

// Available labels for selection
const AVAILABLE_LABELS = [
  "Relevance to Question",
  "Technical Accuracy",
  "Clarity of Expression",
  "Answer Structure",
  "Depth of Knowledge",
  "Practical Application",
  "Problem-Solving Approach",
  "Communication Skills",
  "Confidence Level",
  "Answer Completeness",
  "Leadership",
  "Team Dynamics",
  "Innovation",
  "Impact",
  "Adaptability",
  "Cultural Fit",
  "Stress Management",
  "Learning Ability",
  "Professional Maturity",
  "Strategic Thinking",
  "Influence",
  "Problem Complexity",
  "Communication Style",
  "Collaboration",
  "Creativity",
  "Critical Thinking",
  "Decision Making",
  "Emotional Intelligence",
  "Initiative",
  "Organization Skills"
];

const LABEL_CATEGORIES = {
  "Relevance to Question": "CORE",
  "Technical Accuracy": "TECHNICAL",
  "Clarity of Expression": "CORE",
  "Answer Structure": "CORE",
  "Depth of Knowledge": "TECHNICAL",
  "Practical Application": "TECHNICAL",
  "Problem-Solving Approach": "TECHNICAL",
  "Communication Skills": "BEHAVIORAL",
  "Confidence Level": "BEHAVIORAL",
  "Answer Completeness": "CORE",
  "Leadership": "LEADERSHIP",
  "Team Dynamics": "BEHAVIORAL",
  "Innovation": "LEADERSHIP",
  "Impact": "LEADERSHIP",
  "Adaptability": "BEHAVIORAL",
  "Cultural Fit": "BEHAVIORAL",
  "Stress Management": "BEHAVIORAL",
  "Learning Ability": "GENERAL",
  "Professional Maturity": "LEADERSHIP",
  "Strategic Thinking": "LEADERSHIP",
  "Influence": "LEADERSHIP",
  "Problem Complexity": "TECHNICAL",
  "Communication Style": "BEHAVIORAL",
  "Collaboration": "BEHAVIORAL",
  "Creativity": "LEADERSHIP",
  "Critical Thinking": "TECHNICAL",
  "Decision Making": "LEADERSHIP",
  "Emotional Intelligence": "BEHAVIORAL",
  "Initiative": "BEHAVIORAL",
  "Organization Skills": "GENERAL"
};

const DEFAULT_WEIGHTS = {
  "Relevance to Question": 1.5,
  "Technical Accuracy": 1.5,
  "Clarity of Expression": 1.2,
  "Answer Structure": 1.2,
  "Depth of Knowledge": 1.3,
  "Practical Application": 1.4,
  "Problem-Solving Approach": 1.3,
  "Communication Skills": 1.1,
  "Confidence Level": 1.0,
  "Answer Completeness": 1.2,
  "Leadership": 1.6,
  "Team Dynamics": 1.4,
  "Innovation": 1.5,
  "Impact": 1.4,
  "Adaptability": 1.3,
  "Cultural Fit": 1.3,
  "Stress Management": 1.2,
  "Learning Ability": 1.1,
  "Professional Maturity": 1.3,
  "Strategic Thinking": 1.4,
  "Influence": 1.3,
  "Problem Complexity": 1.2,
  "Communication Style": 1.2,
  "Collaboration": 1.3,
  "Creativity": 1.4,
  "Critical Thinking": 1.3,
  "Decision Making": 1.4,
  "Emotional Intelligence": 1.2,
  "Initiative": 1.2,
  "Organization Skills": 1.1
};

export default function LabelManagementDialog({ onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');
  const [templates, setTemplates] = useState(DEFAULT_LABEL_TEMPLATES);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [customTemplates, setCustomTemplates] = useState({});

  const getCategoryColor = (category) => {
    const colors = {
      'CORE': 'bg-blue-100 text-blue-800 border-blue-200',
      'TECHNICAL': 'bg-green-100 text-green-800 border-green-200',
      'BEHAVIORAL': 'bg-purple-100 text-purple-800 border-purple-200',
      'LEADERSHIP': 'bg-orange-100 text-orange-800 border-orange-200',
      'GENERAL': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['GENERAL'];
  };

  const addLabelToTemplate = (interviewType, label) => {
    if (!templates[interviewType].includes(label)) {
      setTemplates(prev => ({
        ...prev,
        [interviewType]: [...prev[interviewType], label]
      }));
    }
  };

  const removeLabelFromTemplate = (interviewType, label) => {
    setTemplates(prev => ({
      ...prev,
      [interviewType]: prev[interviewType].filter(l => l !== label)
    }));
  };

  const updateWeight = (label, weight) => {
    setWeights(prev => ({
      ...prev,
      [label]: parseFloat(weight) || 1
    }));
  };

  const saveConfiguration = () => {
    const config = {
      templates,
      weights,
      customTemplates,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for now (could be saved to database)
    localStorage.setItem('videoInterviewLabelConfig', JSON.stringify(config));
    
    if (onSave) {
      onSave(config);
    }
    
    toast.success('Label configuration saved successfully!');
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    setTemplates(DEFAULT_LABEL_TEMPLATES);
    setWeights(DEFAULT_WEIGHTS);
    setCustomTemplates({});
    toast.info('Reset to default configuration');
  };

  const exportConfiguration = () => {
    const config = {
      templates,
      weights,
      customTemplates,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-interview-labels-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Configuration exported successfully!');
  };

  const importConfiguration = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          setTemplates(config.templates || DEFAULT_LABEL_TEMPLATES);
          setWeights(config.weights || DEFAULT_WEIGHTS);
          setCustomTemplates(config.customTemplates || {});
          toast.success('Configuration imported successfully!');
        } catch (error) {
          toast.error('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  const unusedLabels = AVAILABLE_LABELS.filter(label => 
    !Object.values(templates).flat().includes(label)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <Settings className="h-4 w-4 mr-1" />
          Manage Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Video Interview Label Management
          </DialogTitle>
          <DialogDescription>
            Customize evaluation labels, weights, and templates for different interview types
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveConfiguration} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-1" />
              Save Configuration
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              <AlertCircle className="h-4 w-4 mr-1" />
              Reset to Defaults
            </Button>
            <Button onClick={exportConfiguration} variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-1" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfiguration}
                  className="hidden"
                />
              </label>
            </Button>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            {Object.keys(templates).map(interviewType => (
              <TabsContent key={interviewType} value={interviewType} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Labels */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Current Labels ({templates[interviewType].length})
                      </CardTitle>
                      <CardDescription>
                        Labels currently used for {interviewType} interviews
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {templates[interviewType].map((label, index) => (
                        <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(LABEL_CATEGORIES[label])}>
                              {LABEL_CATEGORIES[label]}
                            </Badge>
                            <span className="font-medium">{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0.1"
                              max="3"
                              step="0.1"
                              value={weights[label] || 1}
                              onChange={(e) => updateWeight(label, e.target.value)}
                              className="w-16 h-8 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLabelFromTemplate(interviewType, label)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Available Labels */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Available Labels ({unusedLabels.length})
                      </CardTitle>
                      <CardDescription>
                        Add these labels to the {interviewType} template
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                      {unusedLabels.map(label => (
                        <div key={label} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(LABEL_CATEGORIES[label])}>
                              {LABEL_CATEGORIES[label]}
                            </Badge>
                            <span className="text-sm">{label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addLabelToTemplate(interviewType, label)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Template Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Template Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(
                        Object.entries(LABEL_CATEGORIES).reduce((acc, [label, category]) => {
                          if (templates[interviewType].includes(label)) {
                            acc[category] = (acc[category] || 0) + 1;
                          }
                          return acc;
                        }, {})
                      ).map(([category, count]) => (
                        <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">{count}</div>
                          <div className="text-sm text-gray-600">{category}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Weight Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Label Weights Overview
              </CardTitle>
              <CardDescription>
                Adjust the importance of each label in the evaluation scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                {Object.keys(weights).map(label => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(LABEL_CATEGORIES[label])}>
                        {LABEL_CATEGORIES[label]}
                      </Badge>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <Input
                      type="number"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={weights[label] || 1}
                      onChange={(e) => updateWeight(label, e.target.value)}
                      className="w-16 h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 