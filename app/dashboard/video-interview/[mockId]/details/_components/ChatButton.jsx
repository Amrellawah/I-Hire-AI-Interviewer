"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function ChatButton({ candidate }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!candidate.userEmail) {
      toast.error('Candidate email not available');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/chat/direct-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: candidate.userEmail,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!');
        setMessage('');
        setIsOpen(false);
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Message</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.userName?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Message {candidate.userName || 'Candidate'}
                  </h3>
                  <p className="text-sm text-gray-500">{candidate.userEmail}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Message Input */}
            <div className="p-4 flex-1">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    disabled={isSending}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>This message will be sent directly to the candidate.</p>
                  <p>No friend request is required.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isSending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatButton; 