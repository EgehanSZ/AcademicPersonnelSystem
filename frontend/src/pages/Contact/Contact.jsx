import React from 'react';
import { Button, Form, Input, message } from 'antd';

export const Contact = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('https://formspree.io/f/mblodawe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: values.user.ad,
          soyad: values.user.soyad,
          email: values.user.email,
          mesaj: values.user.introduction
        })
      });

      if (response.ok) {
        message.success('Mesajınız başarıyla gönderildi!');
      } else {
        message.error('Form gönderilirken hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      message.error('Sunucuya ulaşılamadı.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // sayfa ortası
        backgroundColor: '#f9f9f9', // hafif gri zemin
        padding: '2rem'
      }}
    >
      <Form
        name="contact"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Form.Item name={['user', 'ad']} label="Ad" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={['user', 'soyad']} label="Soyad" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={['user', 'email']} label="E-mail" rules={[{ type: 'email', required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={['user', 'introduction']} label="Mesaj">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Gönder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};



// import React, { useState, useRef, useEffect, useCallback } from 'react';

// export const Contact = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessageText, setNewMessageText] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   const handleSendMessage = async () => {
//     if (!newMessageText.trim()) return;

//     const newMsg = {
//       id: crypto.randomUUID(),
//       sender: 'user',
//       text: newMessageText,
//       timestamp: Date.now(),
//       status: 'sending',
//     };

//     setMessages((prev) => [...prev, newMsg]);
//     setNewMessageText('');
//     setIsSending(true);

//     if (inputRef.current) {
//       inputRef.current.style.height = 'auto';
//       inputRef.current.focus();
//     }

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === newMsg.id ? { ...m, status: 'sent' } : m
//         )
//       );
//     } catch (error) {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === newMsg.id ? { ...m, status: 'failed' } : m
//         )
//       );
//     } finally {
//       setIsSending(false);
//     }

//     setTimeout(() => {
//       const reply = {
//         id: crypto.randomUUID(),
//         sender: 'other',
//         text: 'Teşekkürler, mesajınızı aldım!',
//         timestamp: Date.now(),
//         status: 'sent',
//       };
//       setMessages((prev) => [...prev, reply]);
//     }, 2500);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey && !isSending) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewMessageText(e.target.value);
//     const textarea = e.target;
//     textarea.style.height = 'auto';
//     textarea.style.height = `${textarea.scrollHeight}px`;
//   };

//   const handleRetry = (id) => {
//     setMessages((prev) =>
//       prev.map((m) => (m.id === id ? { ...m, status: 'sending' } : m))
//     );

//     setTimeout(() => {
//       setMessages((prev) =>
//         prev.map((m) => (m.id === id ? { ...m, status: 'sent' } : m))
//       );
//     }, 1000);
//   };

//   const handleDelete = (id) => {
//     setMessages((prev) => prev.filter((m) => m.id !== id));
//   };

//   const renderStatusIcon = (status) => {
//     switch (status) {
//       case 'sending':
//         return '⏳';
//       case 'sent':
//         return '✅';
//       case 'failed':
//         return '❌';
//       default:
//         return '';
//     }
//   };

//   return (
//     <div style={styles.appContainer}>
//       <div style={styles.chatWindow}>
//         <div style={styles.header}>
//           <strong>Diğer Kullanıcı</strong>
//           <span style={styles.online}>● Online</span>
//         </div>

//         <div style={styles.messageList}>
//           {messages.map((m, index) => (
//             <div
//               key={m.id}
//               style={{
//                 ...styles.messageContainer,
//                 justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
//               }}
//             >
//               <div
//                 style={{
//                   ...styles.messageBubble,
//                   backgroundColor:
//                     m.sender === 'user' ? '#3b82f6' : '#e5e7eb',
//                   color: m.sender === 'user' ? 'white' : 'black',
//                 }}
//               >
//                 {m.text}
//                 <div style={styles.meta}>
//                   <small>
//                     {new Date(m.timestamp).toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </small>{' '}
//                   {m.sender === 'user' && index === messages.length - 1 && (
//                     <span>{renderStatusIcon(m.status)}</span>
//                   )}
//                 </div>
//               </div>
//               {m.status === 'failed' && m.sender === 'user' && (
//                 <div style={{ marginTop: 4 }}>
//                   <button
//                     onClick={() => handleRetry(m.id)}
//                     style={styles.retryButton}
//                   >
//                     Tekrar Dene
//                   </button>
//                   <button
//                     onClick={() => handleDelete(m.id)}
//                     style={styles.deleteButton}
//                   >
//                     Sil
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div style={styles.inputArea}>
//           <textarea
//             ref={inputRef}
//             rows={1}
//             value={newMessageText}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             placeholder="Mesajınızı yazın..."
//             style={styles.textarea}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={isSending}
//             style={{
//               ...styles.sendButton,
//               opacity: isSending ? 0.6 : 1,
//               cursor: isSending ? 'not-allowed' : 'pointer',
//             }}
//           >
//             Gönder
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   appContainer: {
//     height: '100vh',
//     display: 'flex',
//     backgroundColor: '#f3f4f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   chatWindow: {
//     width: '100%',
//     maxWidth: 600,
//     height: '80vh',
//     backgroundColor: 'white',
//     borderRadius: 16,
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//   },
//   header: {
//     padding: 16,
//     borderBottom: '1px solid #e5e7eb',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     background: '#f9fafb',
//   },
//   online: {
//     fontSize: 12,
//     color: 'green',
//   },
//   messageList: {
//     flex: 1,
//     padding: 16,
//     overflowY: 'auto',
//   },
//   messageContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     marginBottom: 10,
//   },
//   messageBubble: {
//     padding: '10px 14px',
//     borderRadius: 12,
//     maxWidth: '70%',
//     wordBreak: 'break-word',
//   },
//   meta: {
//     fontSize: 10,
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   inputArea: {
//     borderTop: '1px solid #e5e7eb',
//     padding: 12,
//     display: 'flex',
//     gap: 8,
//   },
//   textarea: {
//     flex: 1,
//     borderRadius: 8,
//     border: '1px solid #d1d5db',
//     padding: 10,
//     resize: 'none',
//     fontFamily: 'inherit',
//     fontSize: 14,
//   },
//   sendButton: {
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     padding: '10px 16px',
//     borderRadius: 8,
//     border: 'none',
//   },
//   retryButton: {
//     fontSize: 12,
//     marginRight: 8,
//     padding: '4px 8px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: 4,
//   },
//   deleteButton: {
//     fontSize: 12,
//     padding: '4px 8px',
//     backgroundColor: '#ef4444',
//     color: 'white',
//     border: 'none',
//     borderRadius: 4,
//   },
// };


