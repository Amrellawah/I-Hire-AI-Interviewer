"use client";
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Users, 
  Monitor, 
  TrendingUp, 
  AlertCircle, 
  Activity, 
  Clock, 
  BarChart3, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  User,
  Smartphone,
  Laptop,
  Tablet,
  Move,
  Gauge,
  PieChart,
  LineChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SessionCheatingDetectionReport = ({ sessionData, mockId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!sessionData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-400" />
            Session Cheating Detection Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No session data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
  
  const {
    sessionId,
    userEmail,
    sessionStartTime,
    sessionEndTime,
    sessionDuration,
    sessionCheatingRiskScore,
    sessionCheatingAlertsCount,
    sessionCheatingSeverityLevel,
    sessionCheatingViolations = {},
    sessionCheatingDevices = {},
    sessionCheatingMovementPatterns = {},
    sessionDetectionHistory = [],
    sessionAlerts = [],
    sessionEnhancedMetrics = {},
    sessionAnalytics = {}
  } = data;

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100 border-green-200';
    if (risk < 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getRiskLevel = (risk) => {
    if (risk < 30) return 'Low';
    if (risk < 70) return 'Medium';
    return 'High';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getViolationIcon = (violationType) => {
    switch (violationType) {
      case 'faceDetection': return <Eye className="h-4 w-4" />;
      case 'multipleFaces': return <Users className="h-4 w-4" />;
      case 'phoneDetection': return <Smartphone className="h-4 w-4" />;
      case 'screenDetection': return <Monitor className="h-4 w-4" />;
      case 'movementAnalysis': return <Move className="h-4 w-4" />;
      case 'tabSwitching': return <Activity className="h-4 w-4" />;
      case 'typingDetection': return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const isSessionCompleted = !!sessionEndTime;
  const totalViolations = Object.values(sessionCheatingViolations).reduce((sum, count) => sum + count, 0);
  const averageRiskScore = sessionAnalytics?.averageRisk || sessionCheatingRiskScore || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Session Cheating Detection Report
            </CardTitle>
            <CardDescription>
              Comprehensive analysis for session: {sessionId}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getRiskColor(averageRiskScore)}>
              {getRiskLevel(averageRiskScore)} Risk
            </Badge>
            <Badge className={getSeverityColor(sessionCheatingSeverityLevel)}>
              {getSeverityIcon(sessionCheatingSeverityLevel)}
              {sessionCheatingSeverityLevel.toUpperCase()} Severity
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Session Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Candidate</span>
                  </div>
                  <p className="text-lg font-semibold">{userEmail || 'Anonymous'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDuration(sessionDuration)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Risk Score</span>
                  </div>
                  <p className="text-lg font-semibold">{averageRiskScore}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Alerts</span>
                  </div>
                  <p className="text-lg font-semibold">{sessionCheatingAlertsCount}</p>
                </CardContent>
              </Card>
            </div>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Risk Score</span>
                    <span>{averageRiskScore}%</span>
                  </div>
                  <Progress value={averageRiskScore} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalViolations}</div>
                    <div className="text-sm text-green-600">Total Violations</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{sessionDetectionHistory.length}</div>
                    <div className="text-sm text-blue-600">Detection Points</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Object.keys(sessionCheatingViolations).length}</div>
                    <div className="text-sm text-purple-600">Violation Types</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-medium">{formatDateTime(sessionStartTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Time</p>
                    <p className="font-medium">{isSessionCompleted ? formatDateTime(sessionEndTime) : 'Active'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Session ID</p>
                    <p className="font-medium font-mono text-sm">{sessionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={isSessionCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {isSessionCompleted ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Violations Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Violations Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(sessionCheatingViolations).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(sessionCheatingViolations)
                      .sort(([,a], [,b]) => b - a)
                      .map(([violationType, count]) => (
                        <div key={violationType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getViolationIcon(violationType)}
                            <span className="font-medium capitalize">
                              {violationType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                          </div>
                          <Badge variant="secondary">{count} occurrences</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No violations detected</p>
                )}
              </CardContent>
            </Card>

            {/* Devices Detected */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Devices Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(sessionCheatingDevices).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(sessionCheatingDevices)
                      .sort(([,a], [,b]) => b - a)
                      .map(([deviceType, count]) => (
                        <div key={deviceType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(deviceType)}
                            <span className="font-medium capitalize">{deviceType}</span>
                          </div>
                          <Badge variant="secondary">{count} detections</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No additional devices detected</p>
                )}
              </CardContent>
            </Card>

            {/* Movement Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Movement Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(sessionCheatingMovementPatterns).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(sessionCheatingMovementPatterns)
                      .sort(([,a], [,b]) => b - a)
                      .map(([pattern, count]) => (
                        <div key={pattern} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4" />
                            <span className="font-medium capitalize">
                              {pattern.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <Badge variant="secondary">{count} occurrences</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No unusual movement patterns detected</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            {/* Detection Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Detection Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionDetectionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {sessionDetectionHistory.slice(-10).reverse().map((entry, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge className={getRiskColor(entry.riskScore || 0)}>
                              {entry.riskScore || 0}% Risk
                            </Badge>
                          </div>
                          {entry.enhancedMetrics && (
                            <div className="text-xs text-gray-600 space-y-1">
                              {entry.enhancedMetrics.faceQuality && (
                                <div>Face Quality: {Math.round(entry.enhancedMetrics.faceQuality)}%</div>
                              )}
                              {entry.enhancedMetrics.movementPattern && (
                                <div>Movement: {entry.enhancedMetrics.movementPattern}</div>
                              )}
                              {entry.enhancedMetrics.deviceType && (
                                <div>Device: {entry.enhancedMetrics.deviceType}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No detection history available</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {sessionAlerts.slice(-5).reverse().map((alert, index) => (
                      <Alert key={index} className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{alert.message}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {alert.severity && (
                            <Badge className="mt-1" variant="outline">
                              {alert.severity} severity
                            </Badge>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No alerts generated</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Session Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Session Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Average Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {sessionAnalytics?.averageRisk || averageRiskScore}%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">Peak Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {sessionAnalytics?.peakRisk || averageRiskScore}%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">Detection Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {sessionAnalytics?.detectionAccuracy || 90}%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Session Duration</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatDuration(sessionAnalytics?.sessionDuration || sessionDuration)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Enhanced Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionEnhancedMetrics.faceQuality !== undefined && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Face Quality</div>
                      <div className="text-lg font-semibold">{Math.round(sessionEnhancedMetrics.faceQuality)}%</div>
                    </div>
                  )}
                  {sessionEnhancedMetrics.movementPattern && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Movement Pattern</div>
                      <div className="text-lg font-semibold capitalize">
                        {sessionEnhancedMetrics.movementPattern.replace(/_/g, ' ')}
                      </div>
                    </div>
                  )}
                  {sessionEnhancedMetrics.noiseLevel !== undefined && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Noise Level</div>
                      <div className="text-lg font-semibold">{Math.round(sessionEnhancedMetrics.noiseLevel)}%</div>
                    </div>
                  )}
                  {sessionEnhancedMetrics.deviceType && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Primary Device</div>
                      <div className="text-lg font-semibold capitalize">{sessionEnhancedMetrics.deviceType}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SessionCheatingDetectionReport; 