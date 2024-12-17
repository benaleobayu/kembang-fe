"use client";
import * as React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

type Props = {};
export default function Page(props: Props) {
    const [messages, setMessages] = React.useState<any[]>([]);
    const [message, setMessage] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [stompClient, setStompClient] = React.useState<any>(null);

    React.useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);

        client.connect({}, () => {
            // Subscribe to /topic/messages for new messages
            client.subscribe('/topic/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log('Received Message:', receivedMessage);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });

            // Subscribe to /topic/deletions for deleted messages
            client.subscribe('/topic/deletions', (message) => {
                const deletedMessageId = message.body;
                console.log('Deleted Message ID:', deletedMessageId);
                // Remove the deleted message from the local state
                setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== deletedMessageId));
            });
        });

        setStompClient(client);
        return () => {
            client.disconnect();
        };
    }, []);

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (message.trim()) {
            const chatMessage = {
                nickname,
                content: message,
                id: Date.now().toString()  // Assign a unique ID to the message
            };

            console.log('Sent Message:', chatMessage);
            stompClient.send('/app/messages', {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const deleteMessage = (messageId: string) => {
        console.log('Deleting Message ID:', messageId);

        // Remove the message locally
        setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));

        // Send the message ID to the server to notify other clients
        stompClient.send('/app/deleteMessage', {}, messageId);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-90px)]">
            <header className="flex items-center justify-between px-4 py-2 border-b">
                <h1 className="text-lg font-semibold">Chat Room</h1>
                <Button variant="outline" size="sm">Leave Chat</Button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end space-x-2 ${msg.nickname === nickname ? 'justify-end' : ''}`}>
                        {msg.nickname !== nickname && (
                            <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`p-2 rounded-lg ${msg.nickname === nickname ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <p className="text-sm">{msg.content}</p>
                        </div>
                        {msg.nickname === nickname && (
                            <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        )}
                        {msg.nickname === nickname && (
                            <Button variant="outline" size="sm" onClick={() => deleteMessage(msg.id)}>
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </main>
            <footer className="flex items-center space-x-2 p-2 border-t">
                <Input
                    className="flex-1"
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChange={handleNicknameChange}
                />
                <Input
                    className="flex-1"
                    placeholder="Type a message"
                    value={message}
                    onChange={handleMessageChange}
                />
                <Button variant="outline" size="sm" onClick={sendMessage}>
                    Send
                </Button>
            </footer>
        </div>
    );
};
