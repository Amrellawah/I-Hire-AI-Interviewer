"use client";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  UserPlus, 
  Search, 
  Send, 
  ArrowLeft,
  Check,
  X,
  Users,
  User,
  Mail
} from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'chat'
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendEmail, setAddFriendEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFriends(),
        fetchFriendRequests(),
        fetchConversations(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends/list');
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.conversationId,
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        scrollToBottom();
        // Refresh conversations to update last message
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!addFriendEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    if (!user || !user.id) {
      alert('User not loaded. Please sign in again.');
      return;
    }

    const requestBody = {
      requesterId: user.id,
      recipientEmail: addFriendEmail.trim(),
    };

    console.log('Sending friend request with:', requestBody);

    try {
      const response = await fetch('/api/friends/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAddFriendEmail('');
        alert(data.message || 'Friend request sent successfully!');
        fetchFriendRequests();
      } else {
        alert(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (connectionId) => {
    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId,
        }),
      });

      if (response.ok) {
        fetchFriendRequests();
        fetchFriends();
        alert('Friend request accepted!');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (connectionId) => {
    try {
      const response = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId,
        }),
      });

      if (response.ok) {
        fetchFriendRequests();
        alert('Friend request rejected');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const startConversation = async (friendId) => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant2Id: friendId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.conversation);
        setActiveTab('chat');
        fetchConversations();
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#191011] mb-4">Please sign in to access chat</p>
          <Link href="/sign-in" className="bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-6 py-2 rounded-full">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#f1e9ea] px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/job-seeker')}
              className="flex items-center gap-2 text-[#be3144] hover:text-[#a82a3d]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-[#191011]">Chat</h1>
          </div>
          <UserAvatar 
            profilePhoto={user.imageUrl} 
            name={user.fullName} 
            size={40} 
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'friends' 
                ? 'bg-[#be3144] text-white' 
                : 'text-[#191011] hover:bg-[#f1e9ea]'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'requests' 
                ? 'bg-[#be3144] text-white' 
                : 'text-[#191011] hover:bg-[#f1e9ea]'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Requests ({friendRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'chat' 
                ? 'bg-[#be3144] text-white' 
                : 'text-[#191011] hover:bg-[#f1e9ea]'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Messages
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1">
            {activeTab === 'friends' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#191011] mb-4">Friends</h2>
                
                {/* Add Friend */}
                <div className="mb-6 p-4 bg-[#f9f6f6] rounded-lg">
                  <h3 className="font-semibold text-[#191011] mb-2">Add Friend</h3>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={addFriendEmail}
                      onChange={(e) => setAddFriendEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendFriendRequest}
                      className="bg-[#be3144] hover:bg-[#a82a3d]"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Friends List */}
                <div className="space-y-3">
                  {friends.map((friend, index) => {
                    const uniqueKey = [
                      'friend',
                      friend.connectionId,
                      friend.friend?.userId,
                      friend.friend?.email,
                      index
                    ].filter(Boolean).join('-');
                    return (
                      <div 
                        key={uniqueKey}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f1e9ea] cursor-pointer"
                        onClick={() => startConversation(friend.friend?.userId)}
                      >
                      <UserAvatar 
                        profilePhoto={friend.friend?.profilePhoto} 
                        name={friend.friend?.name} 
                        size={40} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#191011] truncate">
                          {friend.friend?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-[#8e575f] truncate">
                          {friend.friend?.email}
                        </p>
                      </div>
                                              <Button 
                          size="sm"
                          className="bg-[#be3144] hover:bg-[#a82a3d]"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                  {friends.length === 0 && (
                    <p className="text-center text-[#8e575f] py-8">
                      No friends yet. Add some friends to start chatting!
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#191011] mb-4">Friend Requests</h2>
                <div className="space-y-3">
                  {friendRequests.map((request, index) => {
                    const uniqueKey = [
                      'request',
                      request.id,
                      request.requester?.userId,
                      request.requester?.email,
                      index
                    ].filter(Boolean).join('-');
                    return (
                      <div 
                        key={uniqueKey}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#e4d3d5]"
                      >
                      <UserAvatar 
                        profilePhoto={request.requester?.profilePhoto} 
                        name={request.requester?.name} 
                        size={40} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#191011] truncate">
                          {request.requester?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-[#8e575f] truncate">
                          {request.requester?.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => acceptFriendRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => rejectFriendRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                  {friendRequests.length === 0 && (
                    <p className="text-center text-[#8e575f] py-8">
                      No pending friend requests
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#191011] mb-4">Conversations</h2>
                <div className="space-y-3">
                  {conversations.map((conversation, index) => {
                    const uniqueKey = [
                      'conversation',
                      conversation.conversationId,
                      conversation.id,
                      index
                    ].filter(Boolean).join('-');
                    return (
                      <div 
                        key={uniqueKey}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.conversationId === conversation.conversationId
                            ? 'bg-[#be3144] text-white'
                            : 'hover:bg-[#f1e9ea]'
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                      <UserAvatar 
                        profilePhoto={conversation.otherParticipant?.profilePhoto} 
                        name={conversation.otherParticipant?.name} 
                        size={40} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conversation.otherParticipant?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm truncate">
                          {conversation.otherParticipant?.email}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })}
                  {conversations.length === 0 && (
                    <p className="text-center text-[#8e575f] py-8">
                      No conversations yet. Start chatting with your friends!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-[#e4d3d5]">
                  <UserAvatar 
                    profilePhoto={selectedConversation.otherParticipant?.profilePhoto} 
                    name={selectedConversation.otherParticipant?.name} 
                    size={40} 
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#191011]">
                      {selectedConversation.otherParticipant?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-[#8e575f]">
                      {selectedConversation.otherParticipant?.email}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-[#be3144] text-white'
                            : 'bg-[#f1e9ea] text-[#191011]'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#e4d3d5]">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1"
                      disabled={sendingMessage}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="bg-[#be3144] hover:bg-[#a82a3d]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-[#8e575f] mx-auto mb-4" />
                  <p className="text-[#8e575f]">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 