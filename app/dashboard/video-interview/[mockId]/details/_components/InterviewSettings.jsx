import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Shield,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function InterviewSettings({ mockId, isHidden = false }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone and will remove all candidate data.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mock-interview/delete/${mockId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete interview');
      }

      toast.success('Interview deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error(error.message || 'Failed to delete interview');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const response = await fetch(`/api/mock-interview/hide/${mockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHidden: !isHidden }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update interview visibility');
      }

      toast.success(`Interview ${!isHidden ? 'hidden' : 'shown'} successfully`);
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error updating interview visibility:', error);
      toast.error(error.message || 'Failed to update interview visibility');
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-orange-50">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 rounded-t-xl text-white">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          Interview Settings
        </CardTitle>
        <CardDescription className="text-orange-100">
          Manage interview visibility and deletion
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <span className="text-sm text-[#8e575f]">Current Status</span>
              <div className="flex items-center gap-2">
                <Badge className={isHidden ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}>
                  {isHidden ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Hidden
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Visible
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {isHidden ? (
                <Eye className="h-5 w-5 text-amber-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-600" />
              )}
              <div>
                <span className="text-sm font-medium text-[#191011]">
                  {isHidden ? 'Show Interview' : 'Hide Interview'}
                </span>
                <p className="text-xs text-[#8e575f]">
                  {isHidden 
                    ? 'Make this interview visible to job seekers' 
                    : 'Hide this interview from job seekers'
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleVisibility}
              disabled={isTogglingVisibility}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                isHidden 
                  ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' 
                  : 'border-amber-200 text-amber-700 hover:bg-amber-50'
              }`}
            >
              {isTogglingVisibility ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isHidden ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {isTogglingVisibility ? 'Updating...' : (isHidden ? 'Show' : 'Hide')}
            </Button>
          </div>
        </div>

        {/* Delete Section */}
        <div className="border-t border-orange-200 pt-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <span className="text-sm font-medium text-red-800">Delete Interview</span>
                <p className="text-xs text-red-600">
                  Permanently delete this interview and all candidate data
                </p>
              </div>
            </div>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InterviewSettings; 