import { useState } from "react";
import { StartupAnimation } from "./components/startupAnimation";
import { ChatInterface } from "./components/chatInterface";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {!showChat && <StartupAnimation onComplete={() => setShowChat(true)} />}
      {showChat && <ChatInterface />}
    </main>
  );
}

export default App;
