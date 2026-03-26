import React from 'react';

const MessageBubble = ({ text, sender, emotion }) => {
    // This was integrated into ChatWindow for simplicity, but I can separate it if needed.
    // For now, I'll just make sure it's here if the user wanted a separate file.
    return (
        <div className={`p-4 rounded-lg my-2 ${sender === 'user' ? 'bg-blue-600 self-end' : 'bg-slate-700 self-start'}`}>
            {text}
        </div>
    );
};

export default MessageBubble;