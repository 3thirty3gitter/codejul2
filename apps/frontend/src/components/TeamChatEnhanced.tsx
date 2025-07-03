import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Brain, Zap, Target, Code, Settings, Lightbulb, FileCode, GitCommit, Play, Wrench } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  avatar: string;
  expertise: string[];
  workingStyle: string;
}

interface CodeAction {
  type: 'create' | 'edit' | 'delete' | 'rename' | 'move';
  filePath: string;
  content?: string;
  description: string;
  agent: string;
}

interface TeamChatEnhancedProps {
  aiTeam: any; // AITeamEnhanced instance
  onMessageSend: (message: string, selectedMembers: string[]) => Promise<{ codeActions: CodeAction[] }>;
  onCodeActionExecute: (action: CodeAction) => Promise<void>;
}

export default function TeamChatEnhanced({ aiTeam, onMessageSend, onCodeActionExecute }: TeamChatEnhancedProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<Map<string, TeamMember>>(new Map());
  const [activeView, setActiveView] = useState<'chat' | 'team' | 'project' | 'actions'>('chat');
  const [pendingActions, setPendingActions] = useState<CodeAction[]>([]);
  const [executedActions, setExecutedActions] = useState<CodeAction[]>([]);

  useEffect(() => {
    if (aiTeam) {
      setTeam(aiTeam.getTeam());
    }
  }, [aiTeam]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await onMessageSend(message, selectedMembers);
      if (result.codeActions) {
        setPendingActions(prev => [...prev, ...result.codeActions]);
      }
      setMessage('');
    } catch (error) {
      console.error('Team chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (action: CodeAction) => {
    try {
      await onCodeActionExecute(action);
      setPendingActions(prev => prev.filter(a => a !== action));
      setExecutedActions(prev => [...prev, action]);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = `? ${action.description}`;
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Failed to execute action:', error);
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

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return <FileCode className="w-4 h-4 text-green-600" />;
      case 'edit': return <Code className="w-4 h-4 text-blue-600" />;
      case 'delete': return <Wrench className="w-4 h-4 text-red-600" />;
      default: return <GitCommit className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with View Tabs */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AI Development Team</h2>
            <div className="text-xs text-green-600 font-medium">?? VIBE CODING ENABLED</div>
          </div>
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
            onClick={() => setActiveView('actions')}
            className={`px-4 py-2 transition-colors relative ${
              activeView === 'actions' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-4 h-4" />
            {pendingActions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {pendingActions.length}
              </span>
            )}
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
            {/* Vibe Coding Status */}
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">Vibe Coding Mode:</span>
                <span className="text-gray-700">Team can create, edit, and execute real code!</span>
                <div className="ml-auto flex items-center gap-1 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">CREATE</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">EDIT</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">EXECUTE</span>
                </div>
              </div>
            </div>

            {/* Team Member Selection */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Select Vibe Coders</h3>
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
                      ?? Suggested
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
                      {selectedMembers.includes(member.id) && (
                        <div className="text-xs text-green-600 font-medium">?? VIBE MODE</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {recommendedMembers.length > 0 && (
                <div className="mt-2 text-xs text-green-600">
                  ?? Suggested for vibe coding: {recommendedMembers.map(id => team.get(id)?.name).join(', ')}
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
                    placeholder="Tell your team what to build, create, or modify... They'll actually do it! ??"
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
                        ? `${selectedMembers.length} vibe coder(s) will work on this`
                        : 'Auto-routing to best team members'
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      Ctrl+Enter to send • Real code will be generated!
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Vibe Coding...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Vibe Code!
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'actions' && (
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Code Actions</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">Vibe Coding Results</span>
            </div>

            {/* Pending Actions */}
            {pendingActions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Pending Actions ({pendingActions.length})
                </h4>
                <div className="space-y-2">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getActionIcon(action.type)}
                          <div>
                            <div className="font-medium text-sm">{action.description}</div>
                            <div className="text-xs text-gray-600">{action.filePath}</div>
                            <div className="text-xs text-blue-600">By: {team.get(action.agent)?.name}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleExecuteAction(action)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Execute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executed Actions */}
            {executedActions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-green-500" />
                  Completed Actions ({executedActions.length})
                </h4>
                <div className="space-y-2">
                  {executedActions.slice(-5).map((action, index) => (
                    <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                      <div className="flex items-center gap-2">
                        {getActionIcon(action.type)}
                        <div>
                          <div className="font-medium text-sm text-green-800">{action.description}</div>
                          <div className="text-xs text-gray-600">{action.filePath}</div>
                          <div className="text-xs text-blue-600">By: {team.get(action.agent)?.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingActions.length === 0 && executedActions.length === 0 && (
              <div className="text-center py-12">
                <Code className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Code Actions Yet</h3>
                <p className="text-gray-600 mb-4">Start chatting with your team to see vibe coding in action!</p>
                <button
                  onClick={() => setActiveView('chat')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Vibe Coding
                </button>
              </div>
            )}
          </div>
        )}

        {activeView === 'team' && (
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Vibe Coding Team</h3>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">?? Enhanced Powers</span>
            </div>
            <div className="grid gap-4">
              {Array.from(team.values()).map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{member.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{member.name}</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          ?? VIBE CODER
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Vibe Coding Powers:</strong> {member.workingStyle}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {member.expertise.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{member.expertise.length - 4} more
                          </span>
                        )}
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
                Professional AI-powered development environment with VIBE CODING capabilities - 
                your team can now create, edit, and execute real code in real-time!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-700">Phase:</strong>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    ?? Vibe Coding Active
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Capabilities:</strong>
                  <span className="ml-2 text-gray-600">Real-time file operations, code execution</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Vibe Coding Powers
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>?? Real-time file creation and editing</li>
                  <li>? Live code execution and testing</li>
                  <li>??? Dynamic configuration management</li>
                  <li>?? Instant deployment preparation</li>
                  <li>?? Automated quality assurance</li>
                  <li>?? Live prototype generation</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Next Objectives
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>?? Advanced AI code generation</li>
                  <li>?? Git integration with team actions</li>
                  <li>?? Real-time collaboration features</li>
                  <li>?? Live deployment automation</li>
                  <li>?? Performance monitoring integration</li>
                  <li>?? Advanced debugging capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
