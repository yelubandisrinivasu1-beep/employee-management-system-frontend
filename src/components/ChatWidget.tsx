"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import API from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const selectedUserRef = useRef<User | null>(null);
  const isOpenRef = useRef(isOpen);
  const contactsRef = useRef<User[]>([]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
    // Clear unread count for this user when we select them
    if (selectedUser) {
      setUnreadCounts(prev => {
        const next = { ...prev };
        delete next[selectedUser._id];
        return next;
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    // We don't clear all unreads when opening the widget, only when selecting a specific user.
  }, [isOpen]);

  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  useEffect(() => {
    if (user && user._id) {
      // Connect to Socket
      socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:5000");

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("join", user._id);
      });

      socketRef.current.on("new_message", (message: Message) => {
        const su = selectedUserRef.current;
        const currentIsOpen = isOpenRef.current;

        if (su && (message.senderId === su._id || message.receiverId === su._id)) {
          setMessages((prev) => {
            // Prevent duplicate messages in case of re-renders
            if (message._id && prev.some(m => m._id === message._id)) return prev;
            return [...prev, message];
          });
        }

        // Notify if it's an incoming message and (chat closed OR not on the sender's chat)
        if (message.senderId !== user._id) {
          if (!currentIsOpen || !su || su._id !== message.senderId) {
            setUnreadCounts((prev) => ({
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1
            }));

            const sender = contactsRef.current.find(c => c._id === message.senderId);
            const senderName = sender ? sender.name : "Someone";
            setToastMessage(`New message from ${senderName}`);
            setTimeout(() => setToastMessage(null), 4000);
          }
        }
      });

      // Fetch Contacts
      API.get("/chat/contacts").then((res) => {
        setContacts(res.data.data);
      }).catch(err => console.error("Could not fetch contacts", err));
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (contact: User) => {
    setSelectedUser(contact);
    try {
      const res = await API.get(`/chat/${contact._id}`);
      setMessages(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser || !user) return;

    const newMsg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: inputMessage,
    };

    socketRef.current?.emit("private_message", newMsg);
    // Optimistic UI update already handled by receiving emit to self from server
    setInputMessage("");
  };

  const totalUnreadCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {toastMessage && (
          <div className="bg-slate-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg border border-slate-700 animate-bounce">
            {toastMessage}
          </div>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        >
          <FiMessageSquare className="w-6 h-6" />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {totalUnreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-80 md:w-96 h-[500px] max-h-[80vh] flex flex-col'}`}>
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shrink-0">
        <h3 className="font-semibold flex items-center gap-2">
          <FiMessageSquare /> {selectedUser ? selectedUser.name : "Pengwin Tech Solution"}
        </h3>
        <div className="flex gap-3">
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-indigo-200 cursor-pointer transition-colors">
            {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200 cursor-pointer transition-colors">
            <FiX />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-1 overflow-hidden">
          {/* Contacts List */}
          {!selectedUser ? (
            <div className="w-full overflow-y-auto p-2">
              <p className="text-xs text-slate-500 font-semibold mb-2 px-2 uppercase">Select a Contact</p>
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => loadConversation(contact)}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors border-b border-slate-100 last:border-0 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-slate-800 truncate leading-tight">{contact.name}</p>
                    <p className="text-xs text-slate-500 truncate">{contact.role.replace("_", " ")}</p>
                  </div>
                  {unreadCounts[contact._id] > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                      {unreadCounts[contact._id]}
                    </span>
                  )}
                </button>
              ))}
              {contacts.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-400">No contacts available.</div>
              )}
            </div>
          ) : (
            /* Chat Area */
            <div className="w-full flex flex-col bg-slate-50 relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-2 left-2 z-10 text-xs bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors"
              >
                ← Back
              </button>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-10">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={endOfMessagesRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shrink-0 shadow-sm w-9 h-9 flex items-center justify-center cursor-pointer transition-colors">
                  <FiSend className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
