import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Brain, Zap, Target, Code, Settings, Lightbulb } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  avatar: string;
  expertise: string[];
  workingStyle: string;
}

interface TeamChatProps {
  aiTeam: any; // AITeam instance
  onMessageSend: (message: string, selectedMembers: string[]) => Promise<void>;
}

export default function TeamChat({ aiTeam, onMessageSend }: TeamChatProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<Map<string, TeamMember>>(new Map());
  const [activeView, setActiveView] = useState<'chat' | 'team' | 'project'>('chat');

  useEffect(() => {
    if (aiTeam) {
      setTeam(aiTeam.getTeam());
    }
  }, [aiTeam]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onMessageSend(message, selectedMembers);
      setMessage('');
    } catch (error) {
      console.error('Team chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    setSelectedMembers(Array.from(team.keys()));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const getRecommendedMembers = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const recommended: string[] = [];

    if (lowerMessage.includes('architecture') || lowerMessage.includes('design') || lowerMessage.includes('scale')) {
      recommended.push('architect');
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('implement') || lowerMessage.includes('develop')) {
      recommended.push('lead-dev');
    }
    if (lowerMessage.includes('deploy') || lowerMessage.includes('infrastructure') || lowerMessage.includes('ci/cd')) {
      recommended.push('devops');
    }
    if (lowerMessage.includes('test') || lowerMessage.includes('quality') || lowerMessage.includes('bug')) {
      recommended.push('qa');
    }
    if (lowerMessage.includes('feature') || lowerMessage.includes('requirement') || lowerMessage.includes('user')) {
      recommended.push('product');
    }
    if (lowerMessage.includes('learn') || lowerMessage.includes('tutorial') || lowerMessage.includes('explain')) {
      recommended.push('junior-dev');
    }

    return recommended;
  };

  const recommendedMembers = getRecommendedMembers(message);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with View Tabs */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">AI Development Team</h2>
        </div>
        
        <div className="flex items-center bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-l-lg transition-colors ${
              activeView === 'chat' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView('team')}
            className={`px-4 py-2 transition-colors ${
              activeView === 'team' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView('project')}
            className={`px-4 py-2 rounded-r-lg transition-colors ${
              activeView === 'project' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Target className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Team Member Selection */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Select Team Members</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllMembers}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                  {recommendedMembers.length > 0 && (
                    <button
                      onClick={() => setSelectedMembers(recommendedMembers)}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Suggested
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {Array.from(team.values()).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                      selectedMembers.includes(member.id)
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : recommendedMembers.includes(member.id)
                        ? 'bg-green-50 border border-green-300 text-green-700'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{member.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">{member.name}</div>
                      <div className="text-xs opacity-75 truncate">{member.role.split(' ').slice(-1)[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {recommendedMembers.length > 0 && (
                <div className="mt-2 text-xs text-green-600">
                  ?? Suggested: {recommendedMembers.map(id => team.get(id)?.name).join(', ')}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your development challenge or request..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      {selectedMembers.length > 0 
                        ? `${selectedMembers.length} team member(s) selected`
                        : 'No team members selected - will auto-route'
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      Ctrl+Enter to send
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Consult Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'team' && (
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="grid gap-4">
              {Array.from(team.values()).map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{member.avatar}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Specializations:</strong> {member.specialization.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Working Style:</strong> {member.workingStyle}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'project' && (
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">CodePilot AI Workspace</h4>
              <p className="text-gray-600 mb-4">
                Professional AI-powered development environment with multi-agent chat system, 
                Monaco code editor, live preview, and advanced file management.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-700">Phase:</strong>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    Advanced Development
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Tech Stack:</strong>
                  <span className="ml-2 text-gray-600">React, TypeScript, Tailwind CSS</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Completed Features
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>? Professional Monaco Code Editor</li>
                  <li>? Multi-Agent AI Chat System</li>
                  <li>? Advanced File Management</li>
                  <li>? Live Preview System</li>
                  <li>? Perplexity API Integration</li>
                  <li>? Collapsible UI Panels</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Next Objectives
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>?? AI Development Team Integration</li>
                  <li>?? Git Version Control</li>
                  <li>?? Deployment System</li>
                  <li>?? Collaboration Features</li>
                  <li>?? Advanced AI Code Generation</li>
                  <li>?? Performance Optimization</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
