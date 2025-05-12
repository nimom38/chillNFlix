import { useState, useEffect, useRef } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


function Chatbot() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! I'm your AI movie assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 👇 Define the AI role
    const aiRole = `You are an AI movie assistant. Nobody in this world has better movie or drama knowledge than you.
    - You also know which movie I like, know every single detail regarding my movie taste.
    - You know everything about my friends. You know what movie they like, down to the smallest detail.
    - You will receive questions regarding my friends. If you don't recognize the friend's name just respond by making things up, as if you know my friend very well.`;
    
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: aiRole },        // 👈 pass role as system prompt
                        { role: "user", content: userMessage.text }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`
                    }
                }
            );

            const botText = response.data.choices[0].message.content.trim();
            const botResponse = { sender: "bot", text: botText };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-[90vh] max-w-3xl mx-auto border rounded-lg shadow bg-[#1e1e1e] text-white">
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded max-w-[80%] ${
                            msg.sender === "user"
                                ? "bg-blue-600 text-white self-end ml-16"
                                : "bg-gray-700 text-white self-start mr-16"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className="p-2 rounded bg-gray-700 text-white self-start mr-16">
                        AI Companion is typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700 flex bg-[#2c2c2c]">
                <textarea
                    className="flex-1 border border-gray-600 bg-[#1e1e1e] text-white rounded p-2 mr-2 resize-none"
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message and press Enter..."
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={sendMessage}
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
