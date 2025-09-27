import { Card } from "./ui/card";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface MessagesProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
}

export function Messages({ messages, isLoading, scrollAreaRef }: MessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-secondary-foreground" />
                </div>
              </div>
            )}
            <Card className={`p-3 ${msg.role === "user" ? "bg-border text-foreground max-w-[80%] break-words" : "bg-card text-card-foreground max-w-[80%] break-words"}`}>
              <div className="text-md leading-snug whitespace-pre-wrap break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
              <p className={`text-xs opacity-60 mt-0 m-0 ${msg.role === "user" ? "text-foreground" : "text-muted-foreground"}`}>
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
  );
}
