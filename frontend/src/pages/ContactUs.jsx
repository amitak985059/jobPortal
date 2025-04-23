import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

      await axios.post('/contactus', {
        name,
        email,
        subject,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-8 max-w-xl w-full text-white">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold text-sm text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1 font-semibold text-sm text-gray-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 font-semibold text-sm text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Message
          </button>
          {success && (
            <p className="text-green-400 font-semibold text-center">
              Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
