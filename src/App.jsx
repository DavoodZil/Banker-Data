import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import { notifyReady, listenToParent } from '@/utils/iframeCommunication'

function App() {
  useEffect(() => {
    // Notify parent that iframe is ready
    notifyReady();
    
    // Listen for messages from parent
    const cleanup = listenToParent((message) => {
      console.log('Received message from parent:', message);
      // Handle parent messages here if needed
    });
    
    return cleanup;
  }, []);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 