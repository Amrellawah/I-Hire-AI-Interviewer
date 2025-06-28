import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  Star,
  Filter,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';

export default function LabelAnalytics({ candidateList }) {
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [sortBy, setSortBy] = useState('average');

  // Extract all unique labels from candidate data
  const allLabels = useMemo(() => {
    const labels = new Set();
    candidateList?.forEach(candidate => {
      candidate.answers?.forEach(answer => {
        if (answer.detailedScores) {
          Object.keys(answer.detailedScores).forEach(label => {
            labels.add(label);
          });
        }
      });
    });
    return Array.from(labels).sort();
  }, [candidateList]);

  // Calculate label statistics
  const labelStats = useMemo(() => {
    const stats = {};
    
    allLabels.forEach(label => {
      const scores = [];
      const weights = [];
      const categories = new Set();
      
      candidateList?.forEach(candidate => {
        candidate.answers?.forEach(answer => {
          if (answer.detailedScores?.[label]) {
            const score = answer.detailedScores[label];
            scores.push(score.score);
            weights.push(score.weight);
            if (score.category) {
              categories.add(score.category);
            }
          }
        });
      });
      
      if (scores.length > 0) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const weightedAverage = scores.reduce((sum, score, index) => sum + (score * weights[index]), 0) / 
                               weights.reduce((sum, weight) => sum + weight, 0);
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        const standardDeviation = Math.sqrt(
          scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length
        );
        
        stats[label] = {
          count: scores.length,
          average: average.toFixed(2),
          weightedAverage: weightedAverage.toFixed(2),
          min: min.toFixed(2),
          max: max.toFixed(2),
          standardDeviation: standardDeviation.toFixed(2),
          category: Array.from(categories)[0] || 'GENERAL',
          scores,
          weights
        };
      }
    });
    
    return stats;
  }, [candidateList, allLabels]);

  // Filter and sort labels
  const filteredLabels = useMemo(() => {
    let labels = Object.entries(labelStats);
    
    if (selectedLabel !== 'all') {
      labels = labels.filter(([label, stats]) => stats.category === selectedLabel);
    }
    
    labels.sort((a, b) => {
      const statA = a[1];
      const statB = b[1];
      
      if (sortBy === 'average') {
        return parseFloat(statB.average) - parseFloat(statA.average);
      } else if (sortBy === 'count') {
        return statB.count - statA.count;
      } else if (sortBy === 'name') {
        return a[0].localeCompare(b[0]);
      } else if (sortBy === 'category') {
        return statA.category.localeCompare(statB.category);
      }
      return 0;
    });
    
    return labels;
  }, [labelStats, selectedLabel, sortBy]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalEvaluations = Object.values(labelStats).reduce((sum, stat) => sum + stat.count, 0);
    const averageScore = Object.values(labelStats).reduce((sum, stat) => sum + parseFloat(stat.average), 0) / Object.keys(labelStats).length;
    const categoryCounts = Object.values(labelStats).reduce((acc, stat) => {
      acc[stat.category] = (acc[stat.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalLabels: Object.keys(labelStats).length,
      totalEvaluations,
      averageScore: averageScore.toFixed(2),
      categoryCounts
    };
  }, [labelStats]);

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

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackgroundColor = (score) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!candidateList || candidateList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Label Analytics
          </CardTitle>
          <CardDescription>
            No candidate data available for analysis
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Label Analytics</h2>
          <p className="text-gray-600">Performance insights across all evaluation labels</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="CORE">Core</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
              <SelectItem value="LEADERSHIP">Leadership</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="average">By Average Score</SelectItem>
              <SelectItem value="count">By Usage Count</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labels</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalLabels}</div>
            <p className="text-xs text-muted-foreground">
              Unique evaluation criteria
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Individual label assessments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.averageScore)}`}>
              {overallStats.averageScore}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Across all labels
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(overallStats.categoryCounts).length}</div>
            <p className="text-xs text-muted-foreground">
              Label categories used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Category Distribution
          </CardTitle>
          <CardDescription>
            Distribution of labels across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(overallStats.categoryCounts).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge className={`mb-2 ${getCategoryColor(category)}`}>
                  {category}
                </Badge>
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600">labels</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Label Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Label Performance Details
          </CardTitle>
          <CardDescription>
            Detailed statistics for each evaluation label
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLabels.map(([label, stats]) => (
              <div key={label} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{label}</h3>
                      <Badge className={getCategoryColor(stats.category)}>
                        {stats.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Average:</span>
                        <span className={`ml-1 font-semibold ${getScoreColor(stats.average)}`}>
                          {stats.average}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Count:</span>
                        <span className="ml-1 font-semibold">{stats.count}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Range:</span>
                        <span className="ml-1 font-semibold">
                          {stats.min} - {stats.max}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Std Dev:</span>
                        <span className="ml-1 font-semibold">{stats.standardDeviation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(stats.average)}`}>
                        {stats.average}/10
                      </div>
                      <div className="text-xs text-gray-600">
                        {stats.count} evaluations
                      </div>
                    </div>
                    
                    <div className="w-32">
                      <Progress 
                        value={parseFloat(stats.average) * 10} 
                        className="h-2"
                        indicatorClassName={
                          parseFloat(stats.average) >= 7 ? 'bg-green-500' : 
                          parseFloat(stats.average) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            Key findings and recommendations based on label performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Top Performing Labels */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Top Performing Labels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredLabels
                  .filter(([label, stats]) => parseFloat(stats.average) >= 7)
                  .slice(0, 3)
                  .map(([label, stats]) => (
                    <div key={label} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-800">{label}</span>
                        <span className="text-green-600 font-bold">{stats.average}/10</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Labels Needing Attention */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Labels Needing Attention</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredLabels
                  .filter(([label, stats]) => parseFloat(stats.average) < 5)
                  .slice(0, 3)
                  .map(([label, stats]) => (
                    <div key={label} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-red-800">{label}</span>
                        <span className="text-red-600 font-bold">{stats.average}/10</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Most Used Labels */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Most Frequently Used Labels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredLabels
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 3)
                  .map(([label, stats]) => (
                    <div key={label} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-800">{label}</span>
                        <span className="text-blue-600 font-bold">{stats.count} uses</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 