"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        fetch("/api/socket");

        socketRef.current = io();

        socketRef.current.on("message", (msg: string) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() && socketRef.current) {
            socketRef.current.emit("message", message);
            setMessage("");
        }
    };
    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <ScrollArea className="h-64 border rounded-md p-4">
                {messages.map((msg, i) => (
                    <div key={i} className="text-sm text-muted-foreground mb-2">
                        {msg}
                    </div>
                ))}
            </ScrollArea>
            <div className="flex gap-2">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="メッセージを入力..."
                />
                <Button onClick={sendMessage}>送信</Button>
            </div>
        </div>
    );
}
