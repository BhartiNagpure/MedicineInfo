import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Maximize2, Minimize2 } from 'lucide-react';

const Chatbot = ({ scannedMedicine }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: `You are a helpful medical assistant. The current medicine is: ${scannedMedicine}` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const updatedMessages = [...messages, { role: 'user', content: input }];
      setMessages(updatedMessages);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
          temperature: 0.5,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages([...updatedMessages, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error chatting:', error);
      setMessages([...messages, { role: 'assistant', content: 'Sorry, I could not process your request.' }]);
    }

    setInput('');
    setLoading(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className={`absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out 
          ${isExpanded ? 'w-[85vw] h-[80vh] md:w-[600px] md:h-[80vh]' : 'w-[85vw] h-[70vh] md:w-80 md:h-[400px]'}`}>
          <div className="bg-sky-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">Medicine Assistant</h3>
            <div className="flex items-center space-x-2">
              <button onClick={toggleExpand} className="text-white hover:text-gray-200 p-1">
                {isExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col h-[calc(100%-64px)]">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.slice(1).map((m, index) => (
                  <div key={index} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-full p-2 ${m.role === 'user' ? 'bg-sky-500' : 'bg-sky-600'}`}>
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className={`p-3 rounded-lg shadow max-w-[80%] ${m.role === 'user' ? 'bg-sky-500 text-white' : 'bg-white'}`}>
                      <p className="text-sm break-words">{m.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about the medicine..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      }

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-sky-900 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-all duration-300 ${isOpen ? 'scale-90' : 'scale-100'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div >
  );
};

export default Chatbot;
