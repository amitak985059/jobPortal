import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // const res = await fetch('http://localhost:4000/contactus/getcontactus');
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contactus/getcontactus`);

        const data = await res.json();
        const sortedMessages = data.data.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));
        setMessages(sortedMessages);

      } catch (err) {
        console.error('Error fetching contact messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6 bg-[#0F172A] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-4 bg-gray-800 rounded-xl shadow-md">
              <p><span className="font-semibold">Name:</span> {msg.name}</p>
              <p><span className="font-semibold">Email:</span> {msg.email}</p>
              <p><span className="font-semibold">Subject:</span> {msg.subject}</p>
              <p><span className="font-semibold">Message:</span> {msg.message}</p>
              <p className="text-sm text-gray-400 mt-2">
                {msg.sendAt && !isNaN(new Date(msg.sendAt))
                  ? new Date(msg.sendAt).toLocaleString()
                  : 'Invalid Date'}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;
