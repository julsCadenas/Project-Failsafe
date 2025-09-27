import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./chatHeader";
import { Messages } from "./messages";
import { ChatInput } from "./chatInput";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Greetings. I am the Bat-Computer, your interface to Gotham's hero intelligence network. I can provide information about heroes, their capabilities, contingency plans, and threat assessments. How may I assist you?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE" | "CHECKING">("CHECKING");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Health check function
  const checkHealth = async () => {
    try {
      const res = await fetch("http://localhost:5555/api/health");
      const data = await res.json();
      setStatus(data.status?.toLowerCase() === "ok" ? "ONLINE" : "OFFLINE");
    } catch (err) {
      setStatus("OFFLINE");
      console.error("Health check error:", err);
    }
  };

  // Run health check on first load
  useEffect(() => {
    checkHealth();
  }, []);

  // Handle sending messages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check health every time before sending
    try {
      checkHealth();
    } catch (err) {
      console.error("Health check failed:", err);
      setStatus("OFFLINE");
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5555/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input.trim(),
          session_id: sessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();

      if (data.session_id) setSessionId(data.session_id);

      let answerText = "";
      if (typeof data.answer === "string") {
        answerText = data.answer;
      } else if (data.answer && typeof data.answer === "object") {
        answerText = data.answer.content || JSON.stringify(data.answer);
      } else {
        answerText = "I apologize, but I'm unable to process that request at the moment.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: answerText,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content:
            "Connection to the Bat-Computer mainframe has been interrupted. Please check the network connection and try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader status={status} />
      <Messages messages={messages} isLoading={isLoading} scrollAreaRef={scrollAreaRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
