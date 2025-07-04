"use client";
import React from 'react';
import { AlertTriangle, Shield, Eye, Users, Monitor, TrendingUp, AlertCircle, Activity, Clock, BarChart3, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CheatingDetectionReport = ({ cheatingData, sessionCheatingData }) => {
  // Helper functions - define these first
  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100';
    if (risk < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'faceDetection':
        return <Eye className="h-3 w-3" />;
      case 'multipleFaces':
        return <Users className="h-3 w-3" />;
      case 'phoneDetection':
      case 'screenDetection':
        return <Monitor className="h-3 w-3" />;
      case 'movementAnalysis':
        return <Activity className="h-3 w-3" />;
      case 'audioAnalysis':
        return <Zap className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'faceDetection':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'multipleFaces':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'phoneDetection':
      case 'screenDetection':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'movementAnalysis':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'audioAnalysis':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Handle session-level cheating detection data
  if (sessionCheatingData) {
    const sessionData = typeof sessionCheatingData === 'string' ? JSON.parse(sessionCheatingData) : sessionCheatingData;
    
    return (
      <div className="space-y-4">
        {/* Session-Level Cheating Detection Summary */}
        <div className="p-4 bg-white border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-sm">Session-Level Cheating Detection</h3>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                Session Data
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(sessionData.sessionCheatingRiskScore || 0)}>
                {getRiskLevel(sessionData.sessionCheatingRiskScore || 0)} Risk
              </Badge>
              <Badge className={getSeverityColor(sessionData.sessionCheatingSeverityLevel || 'low')}>
                {(sessionData.sessionCheatingSeverityLevel || 'low').toUpperCase()} Severity
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Session Risk Score</span>
              <span>{Math.round(sessionData.sessionCheatingRiskScore || 0)}%</span>
            </div>
            <Progress value={sessionData.sessionCheatingRiskScore || 0} className="h-2" />
            
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Total Alerts</span>
              <span>{sessionData.sessionCheatingAlertsCount || 0}</span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-600">
              <span>Session Duration</span>
              <span>{formatDuration(sessionData.sessionDuration || 0)}</span>
            </div>
          </div>
        </div>

        {/* Session Violations */}
        {sessionData.sessionCheatingViolations && (
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Session Violations
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sessionData.sessionCheatingViolations).map(([violationType, count]) => (
                <div key={violationType} className="p-2 bg-red-50 rounded border border-red-200">
                  <div className="text-xs font-medium text-red-700 capitalize">
                    {violationType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="text-sm font-bold text-red-800">
                    {count} violations
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Devices Detected */}
        {sessionData.sessionCheatingDevices && Object.keys(sessionData.sessionCheatingDevices).length > 0 && (
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-purple-600" />
              Devices Detected
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sessionData.sessionCheatingDevices).map(([deviceType, count]) => (
                <div key={deviceType} className="p-2 bg-purple-50 rounded border border-purple-200">
                  <div className="text-xs font-medium text-purple-700 capitalize">
                    {deviceType}
                  </div>
                  <div className="text-sm font-bold text-purple-800">
                    {count} detections
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Movement Patterns */}
        {sessionData.sessionCheatingMovementPatterns && Object.keys(sessionData.sessionCheatingMovementPatterns).length > 0 && (
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Movement Patterns
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sessionData.sessionCheatingMovementPatterns).map(([pattern, count]) => (
                <div key={pattern} className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs font-medium text-blue-700 capitalize">
                    {pattern}
                  </div>
                  <div className="text-sm font-bold text-blue-800">
                    {count} occurrences
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Alerts */}
        {sessionData.sessionAlerts && sessionData.sessionAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Session Alerts ({sessionData.sessionAlerts.length})
            </h4>
            {sessionData.sessionAlerts.slice(-5).map((alert, index) => (
              <Alert key={index} className={`border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <AlertDescription className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium capitalize">
                        {alert.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        {alert.severity && (
                          <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </Badge>
                        )}
                        <span className="text-xs opacity-70">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs opacity-80">{alert.message}</p>
                    {alert.confidence && (
                      <div className="text-xs opacity-60 mt-1">
                        Confidence: {Math.round(alert.confidence * 100)}%
                      </div>
                    )}
                    {alert.riskScore && (
                      <div className="text-xs opacity-60">
                        Risk Score: {Math.round(alert.riskScore)}%
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Session Detection History */}
        {sessionData.sessionDetectionHistory && sessionData.sessionDetectionHistory.length > 0 && (
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Session Detection History
            </h4>
            <div className="space-y-2">
              {sessionData.sessionDetectionHistory.slice(-10).map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Detection {index + 1}</span>
                      <span>{Math.round(entry.riskScore || 0)}%</span>
                    </div>
                    <Progress 
                      value={entry.riskScore || 0} 
                      className="h-1.5" 
                      style={{
                        backgroundColor: (entry.riskScore || 0) < 30 ? '#dcfce7' : 
                                       (entry.riskScore || 0) < 70 ? '#fef3c7' : '#fee2e2'
                      }}
                    />
                    {entry.metrics && (
                      <div className="text-xs text-gray-400 mt-1">
                        {entry.metrics.deviceType && `Device: ${entry.metrics.deviceType}`}
                        {entry.metrics.movementPattern && entry.metrics.movementPattern !== 'normal' && 
                          ` | Pattern: ${entry.metrics.movementPattern}`}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Enhanced Metrics */}
        {sessionData.sessionEnhancedMetrics && (
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Session Enhanced Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sessionData.sessionEnhancedMetrics).map(([key, value]) => {
                if (value === null || value === undefined) return null;
                
                let displayValue = value;
                if (typeof value === 'number' && key.includes('Quality')) {
                  displayValue = `${Math.round(value)}%`;
                } else if (typeof value === 'number' && key.includes('Level')) {
                  displayValue = `${Math.round(value * 100)}%`;
                } else if (typeof value === 'number' && key.includes('Stability')) {
                  displayValue = `${Math.round(value)}%`;
                } else if (typeof value === 'string') {
                  displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                }
                
                return (
                  <div key={key} className="text-xs">
                    <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                    <span className="ml-1 font-medium">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle legacy per-question cheating detection data
  if (!cheatingData) {
    return null; // Don't show anything when there's no data
  }

  const data = typeof cheatingData === 'string' ? JSON.parse(cheatingData) : cheatingData;
  const { 
    riskScore = 0, 
    alerts = [], 
    detectionHistory = [], 
    analytics = {},
    enhancedMetrics = {},
    severityLevel = 'low',
    version = '1.0'
  } = data;

  return (
    <div className="space-y-4">
      {/* Enhanced Risk Score Summary */}
      <div className="p-4 bg-white border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Enhanced Cheating Detection Summary</h3>
            {version && (
              <Badge variant="outline" className="text-xs">
                v{version}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getRiskColor(riskScore)}>
              {getRiskLevel(riskScore)} Risk
            </Badge>
            <Badge className={getSeverityColor(severityLevel)}>
              {severityLevel.toUpperCase()} Severity
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Overall Risk Score</span>
            <span>{Math.round(riskScore)}%</span>
          </div>
          <Progress value={riskScore} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Total Alerts</span>
            <span>{alerts.length}</span>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>Detection Sessions</span>
            <span>{detectionHistory.length}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Dashboard */}
      {analytics && Object.keys(analytics).length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-3 w-3 text-blue-600" />
              <div className="text-xs text-blue-600 font-medium">Average Risk</div>
            </div>
            <div className="text-lg font-semibold text-blue-700">
              {analytics.averageRisk || 0}%
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3 text-orange-600" />
              <div className="text-xs text-orange-600 font-medium">Peak Risk</div>
            </div>
            <div className="text-lg font-semibold text-orange-700">
              {analytics.peakRisk || 0}%
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3 w-3 text-purple-600" />
              <div className="text-xs text-purple-600 font-medium">Total Violations</div>
            </div>
            <div className="text-lg font-semibold text-purple-700">
              {analytics.totalViolations || 0}
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3 text-green-600" />
              <div className="text-xs text-green-600 font-medium">Session Duration</div>
            </div>
            <div className="text-lg font-semibold text-green-700">
              {formatDuration(analytics.sessionDuration || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Metrics */}
      {enhancedMetrics && Object.keys(enhancedMetrics).length > 0 && (
        <div className="p-4 bg-white border rounded-lg">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            Enhanced Detection Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {enhancedMetrics.faceQuality !== undefined && (
              <div className="text-xs">
                <span className="text-gray-600">Face Quality:</span>
                <span className="ml-1 font-medium">{Math.round(enhancedMetrics.faceQuality)}%</span>
              </div>
            )}
            {enhancedMetrics.movementPattern && (
              <div className="text-xs">
                <span className="text-gray-600">Movement Pattern:</span>
                <span className="ml-1 font-medium capitalize">{enhancedMetrics.movementPattern}</span>
              </div>
            )}
            {enhancedMetrics.noiseLevel !== undefined && (
              <div className="text-xs">
                <span className="text-gray-600">Audio Noise Level:</span>
                <span className="ml-1 font-medium">{Math.round(enhancedMetrics.noiseLevel * 100)}%</span>
              </div>
            )}
            {enhancedMetrics.deviceType && (
              <div className="text-xs">
                <span className="text-gray-600">Detected Device:</span>
                <span className="ml-1 font-medium capitalize">{enhancedMetrics.deviceType}</span>
              </div>
            )}
            {enhancedMetrics.gazeStability !== undefined && (
              <div className="text-xs">
                <span className="text-gray-600">Gaze Stability:</span>
                <span className="ml-1 font-medium">{Math.round(enhancedMetrics.gazeStability)}%</span>
              </div>
            )}
            {enhancedMetrics.responseTime !== undefined && (
              <div className="text-xs">
                <span className="text-gray-600">Response Time:</span>
                <span className="ml-1 font-medium">{Math.round(enhancedMetrics.responseTime / 1000)}s</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Most Common Violation */}
      {analytics.mostCommonViolation && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            <div className="text-xs text-yellow-600 font-medium">Most Common Violation</div>
          </div>
          <div className="text-sm font-medium text-yellow-700 capitalize">
            {analytics.mostCommonViolation.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </div>
        </div>
      )}

      {/* Enhanced Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Detection Alerts ({alerts.length})
          </h4>
          {alerts.slice(-5).map((alert, index) => (
            <Alert key={index} className={`border ${getAlertColor(alert.type)}`}>
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.type)}
                <AlertDescription className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium capitalize">
                      {alert.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {alert.severity && (
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      )}
                      <span className="text-xs opacity-70">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs opacity-80">{alert.message}</p>
                  {alert.confidence && (
                    <div className="text-xs opacity-60 mt-1">
                      Confidence: {Math.round(alert.confidence * 100)}%
                    </div>
                  )}
                  {alert.riskScore && (
                    <div className="text-xs opacity-60">
                      Risk Score: {Math.round(alert.riskScore)}%
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Enhanced Detection History Chart */}
      {detectionHistory.length > 0 && (
        <div className="p-4 bg-white border rounded-lg">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Risk Trend Analysis
          </h4>
          <div className="space-y-2">
            {detectionHistory.slice(-10).map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Session {index + 1}</span>
                    <span>{Math.round(entry.riskScore)}%</span>
                  </div>
                  <Progress 
                    value={entry.riskScore} 
                    className="h-1.5" 
                    style={{
                      backgroundColor: entry.riskScore < 30 ? '#dcfce7' : 
                                     entry.riskScore < 70 ? '#fef3c7' : '#fee2e2'
                    }}
                  />
                  {/* Show enhanced metrics if available */}
                  {entry.metrics && (
                    <div className="text-xs text-gray-400 mt-1">
                      {entry.metrics.deviceType && `Device: ${entry.metrics.deviceType}`}
                      {entry.metrics.movementPattern && entry.metrics.movementPattern !== 'normal' && 
                        ` | Pattern: ${entry.metrics.movementPattern}`}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detection Accuracy */}
      {analytics.detectionAccuracy && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-3 w-3 text-green-600" />
            <div className="text-xs text-green-600 font-medium">Detection Accuracy</div>
          </div>
          <div className="text-sm font-medium text-green-700">
            {analytics.detectionAccuracy}% accurate
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatingDetectionReport; 