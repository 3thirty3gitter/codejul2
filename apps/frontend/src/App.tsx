import React, { useState } from 'react';
import FileExplorer from './components/FileExplorer';
import EditorTabs from './components/EditorTabs';
import CodeEditor from './components/CodeEditor';
import PreviewPane from './components/PreviewPane';
import DeploymentControls from './components/DeploymentControls';
import UserSettingsModal from './components/UserSettingsModal';
import Toast from './components/Toast';
import VersionControlPanel from './components/VersionControlPanel';
import VisualEditorPanel from './components/VisualEditorPanel';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleDeploy = () => {
    setToast({ show: true, message: "Deployment started..." });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <div className='min-h-screen bg-gray-950 flex flex-row items-stretch'>
      <div className='w-72 p-4'>
        <FileExplorer />
      </div>
      <div className='flex-1 flex flex-col p-8'>
        <div className='flex justify-end mb-2'>
          <button
            className='rounded-full bg-gray-900 p-2 hover:bg-gray-800 transition'
            onClick={() => setSettingsOpen(true)}
          >
            <img
              src='https://unpkg.com/lucide-static@latest/icons/user.svg'
              alt='User'
              className='h-5 w-5'
            />
          </button>
        </div>
        <VersionControlPanel />
        <VisualEditorPanel />
        <DeploymentControls onDeploy={handleDeploy} />
        <EditorTabs />
        <div className='flex flex-row gap-6 flex-1'>
          <div className='w-1/2 h-[500px] flex flex-col'>
            <h1 className='text-2xl font-bold text-white mb-4'>CodePilot Editor</h1>
            <CodeEditor />
          </div>
          <div className='w-1/2 h-[500px]'>
            <PreviewPane />
          </div>
        </div>
        <UserSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Toast message={toast.message} show={toast.show} />
      </div>
    </div>
  );
}
