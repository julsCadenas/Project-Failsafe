import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { BatmanLogo } from "./batmanLogo";
import { Send, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5555/api/health");
        const data = await res.json();
        setStatus(data.status?.toLowerCase() === "ok" ? "ONLINE" : "OFFLINE");
      } catch (err) {
        setStatus("OFFLINE");
        console.error("Health check error:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
      {/* Header */}
      <div className="border-b border-border bg-card flex-none px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
          <div className="flex items-center space-x-3">
            <BatmanLogo size={48} />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">BAT-COMPUTER</h1>
              <p className="text-sm text-muted-foreground">Gotham Intelligence System</p>
            </div>
          </div>
          <div className="flex flex-row gap-1 mt-2 sm:mt-0 text-xs font-semibold">
            <p className="text-muted-foreground">Status:</p>
            <p
              className={
                status === "ONLINE"
                  ? "text-green-400"
                  : status === "OFFLINE"
                  ? "text-red-400"
                  : "text-yellow-400"
              }
            >
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-secondary-foreground" />
                  </div>
                </div>
              )}

          <Card
            className={`p-3 ${
              msg.role === "user"
                ? "bg-border text-foreground max-w-[80%] break-words"
                : "bg-card text-card-foreground max-w-[80%] break-words"
            }`}
          >
            <div className="text-md leading-snug whitespace-pre-wrap break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>

            <p
              className={`text-xs opacity-60 mt-0 m-0 ${
                msg.role === "user" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {msg.timestamp.toLocaleTimeString()}
            </p>
          </Card>

              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User size={16} className="text-secondary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-secondary-foreground" />
                </div>
              </div>
              <Card className="bg-card text-card-foreground p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card flex-none p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-2 items-center">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about heroes, contingencies, or threat assessments..."
              disabled={isLoading}
              className="flex-1 resize-none overflow-hidden bg-input border-border text-foreground placeholder:text-muted-foreground text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
              }}}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
