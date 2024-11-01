// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Sidebar from '../components/Sidebar';
// import MessageDetails from '../components/MessageDetails';
// import Compose from '../components/Compose';

// const DashboardPage = () => {
//   const { slug } = useParams(); 
//   const { user, isLoading } = useUser(); 
//   const [emails, setEmails] = useState([]);
//   const [labelCounts, setLabelCounts] = useState({});
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [threadMessages, setThreadMessages] = useState([]); 
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchMode, setSearchMode] = useState(false);
//   const [isComposeOpen, setIsComposeOpen] = useState(false);

//   const loaderRef = useRef(null);

//   const getGmailLabel = (slug) => {
//     switch (slug) {
//       case 'inbox':
//         return 'INBOX';
//       case 'promotions':
//         return 'CATEGORY_PROMOTIONS';
//       case 'social':
//         return 'CATEGORY_SOCIAL';
//       case 'spam':
//         return 'SPAM';
//       case 'trash':
//         return 'TRASH';
//       case 'sent':
//         return 'SENT';
//       case 'drafts':
//         return 'DRAFT';
//       case 'starred':
//         return 'STARRED';
//       default:
//         return 'INBOX';
//     }
//   };

//   const fetchEmails = async (label, email, pageToken = null, query = '') => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${pageToken ? `&pageToken=${pageToken}` : ''}&query=${query}`);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Unknown error occurred while fetching emails');
//       }

//       const data = await response.json();
//       if (Array.isArray(data.messages)) {
//         setEmails((prevEmails) => [...prevEmails, ...data.messages]);
//       } else {
//         setEmails([]);
//       }

//       setLabelCounts(data.labelCounts || {});
//       setNextPageToken(data.nextPageToken || null);
//     } catch (error) {
//       console.error('Error fetching emails:', error.message);
//     }
//     setLoading(false);
//   };

//   const fetchThread = async (threadId) => {
//     try {
//       const response = await fetch(`/api/auth/google/fetchThreads?email=${encodeURIComponent(user.email)}&threadId=${threadId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch thread');
//       }
//       const data = await response.json();
//       setThreadMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching thread:', error.message);
//     }
//   };

//   const handleOpenMessage = (message) => {
//     if (message && message.threadId) {
//       setSelectedMessage(message);
//       fetchThread(message.threadId); 
//     } else {
//       console.error('No threadId found for this message.');
//     }
//   };

//   const handleCloseMessage = () => {
//     setSelectedMessage(null);
//     setThreadMessages([]); 
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setEmails([]); 
//     setSearchMode(true); 
//     const label = getGmailLabel(slug);
//     fetchEmails(label, user.email, null, searchQuery);  
//   };

//   const handleBackToInbox = () => {
//     setSearchMode(false);  
//     setSearchQuery('');    
//     setEmails([]);         
//     const label = getGmailLabel('inbox');  
//     fetchEmails(label, user.email);        
//   };

//   const openComposeModal = () => {
//     setIsComposeOpen(true);
//   };

//   const closeComposeModal = () => {
//     setIsComposeOpen(false);
//   };

//   useEffect(() => {
//     if (user && slug && !searchMode) {
//       const label = getGmailLabel(slug); 
//       fetchEmails(label, user.email);
//     }
//   }, [slug, user, searchMode]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading user info...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar labelCounts={labelCounts} />
//       <div className="flex-grow p-6 overflow-y-auto">
//         <h1 className="text-4xl font-semibold capitalize mb-6 text-gray-800">{slug}</h1>

//         {!selectedMessage && (
//           <>
//             <form className="mb-4">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-lg focus:outline-none"
//                 placeholder="Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </form>

//             {searchMode && (
//               <button className="text-blue-500 hover:text-blue-700 mb-4" onClick={handleBackToInbox}>
//                 &larr; Back to Inbox
//               </button>
//             )}

//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 mb-4"
//               onClick={openComposeModal}
//             >
//               Compose
//             </button>
//           </>
//         )}

//         {loading && emails.length === 0 ? (
//           <p className="text-gray-600">Loading emails...</p>
//         ) : selectedMessage ? (
//           <MessageDetails
//             selectedMessage={selectedMessage}
//             threadMessages={threadMessages}
//             handleCloseMessage={handleCloseMessage}
//           />
//         ) : emails.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-lg text-gray-500">No emails found for {slug}</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4">
//             {emails.map((email) => (
//               <div
//                 key={email.id}
//                 className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
//                 onClick={() => handleOpenMessage(email)}
//               >
//                 <h2 className="font-bold text-lg mb-1">{email.subject || '(No Subject)'}</h2>
//                 <p className="text-sm text-gray-500 truncate">From: {email.from}</p>
//                 <p className="text-gray-600 mt-2 truncate">{email.snippet}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Compose isOpen={isComposeOpen} onClose={closeComposeModal} userEmail={user?.email} />
//     </div>
//   );
// };

// export default DashboardPage;













'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import MessageDetails from '../components/MessageDetails';
import Compose from '../components/Compose';
import { FaExclamationCircle } from 'react-icons/fa';  // Importing icons for the priority indicator

const DashboardPage = () => {
  const router = useRouter(); // Initialize useRouter for redirection
  const { slug } = useParams();
  const { user, isLoading } = useUser();
  const [emails, setEmails] = useState([]);
  const [labelCounts, setLabelCounts] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);  // Pagination token
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const loaderRef = useRef(null);  // For observing when to load more emails

  useEffect(() => {
    // Redirect to 'inbox' if slug is undefined (user is on /dashboard)
    if (!slug) {
      router.replace('/dashboard/inbox');
    }
  }, [slug, router]);

  const getGmailLabel = (slug) => {
    switch (slug) {
      case 'inbox': return 'INBOX';
      case 'promotions': return 'CATEGORY_PROMOTIONS';
      case 'social': return 'CATEGORY_SOCIAL';
      case 'spam': return 'SPAM';
      case 'trash': return 'TRASH';
      case 'sent': return 'SENT';
      case 'drafts': return 'DRAFT';
      case 'starred': return 'STARRED';
      default: return 'INBOX';
    }
  };

  const fetchEmails = async (label, email, pageToken = null, query = '') => {
    setLoading(true);
    try {
      const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${pageToken ? `&pageToken=${pageToken}` : ''}${query ? `&query=${encodeURIComponent(query)}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred while fetching emails');
      }

      const data = await response.json();
      const classifiedEmails = await classifyEmails(data.messages);
      setEmails((prevEmails) => [...prevEmails, ...classifiedEmails]);
      setNextPageToken(data.nextPageToken || null);
      setLabelCounts(data.labelCounts || {});
    } catch (error) {
      console.error('Error fetching emails:', error.message);
    }
    setLoading(false);
  };

  const classifyEmails = async (emails) => {
    return await Promise.all(
      emails.map(async (email) => {
        try {
          const emailContent = { subject: email.subject, body: email.snippet };
          const response = await fetch('/api/ai/classifyEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailContent }),
          });
          const { priority } = await response.json();
          return { ...email, priority };
        } catch (error) {
          console.error('Error classifying email:', error.message);
          return { ...email, priority: 'Low Priority' };
        }
      })
    );
  };

  const handleOpenMessage = (message) => {
    if (message && message.threadId) {
      setSelectedMessage(message);
      fetchThread(message.threadId);
    } else {
      console.error('No threadId found for this message.');
    }
  };

  const fetchThread = async (threadId) => {
    try {
      const response = await fetch(`/api/auth/google/fetchThreads?email=${encodeURIComponent(user.email)}&threadId=${threadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch thread');
      }
      const data = await response.json();
      setThreadMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching thread:', error.message);
    }
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setThreadMessages([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setEmails([]);
    setSearchMode(true);
    const label = getGmailLabel(slug);
    if (user?.email) {
      fetchEmails(label, user.email, null, searchQuery);
    }
  };

  const handleBackToInbox = () => {
    setSearchMode(false);
    setSearchQuery('');
    setEmails([]);
    const label = getGmailLabel('inbox');
    if (user?.email) {
      fetchEmails(label, user.email);
    }
  };

  const openComposeModal = () => {
    setIsComposeOpen(true);
  };

  const closeComposeModal = () => {
    setIsComposeOpen(false);
  };

  useEffect(() => {
    if (user && slug && !searchMode) {
      const label = getGmailLabel(slug);
      fetchEmails(label, user.email);
    }
  }, [slug, user, searchMode]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar labelCounts={labelCounts} />
      <div className="flex-grow p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold capitalize mb-4 text-gray-900">{slug}</h1>

        {!selectedMessage && (
          <>
            <form className="mb-4" onSubmit={handleSearch}>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
              </button>
            </form>

            {searchMode && (
              <button className="text-blue-500 hover:text-blue-700 mb-4" onClick={handleBackToInbox}>
                &larr; Back to Inbox
              </button>
            )}

            <button
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={openComposeModal}
            >
              Compose
            </button>
          </>
        )}

        {loading && emails.length === 0 ? (
          <p className="text-gray-600">Loading emails...</p>
        ) : selectedMessage ? (
          <MessageDetails
            selectedMessage={selectedMessage}
            threadMessages={threadMessages}
            handleCloseMessage={handleCloseMessage}
            onDeleteMessage={() => setEmails(emails.filter(e => e.id !== selectedMessage.id))}
          />
        ) : emails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">No emails found for {slug}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`relative bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer ${email.priority === 'High Priority' ? 'border border-red-500' : ''}`}
                  onClick={() => handleOpenMessage(email)}
                >
                  <h2 className="font-bold text-xl mb-2">{email.subject || '(No Subject)'}</h2>
                  <p className="text-sm text-gray-500 truncate">From: {email.from}</p>
                  <p className="text-gray-600 mt-2 truncate">{email.snippet}</p>

                  {email.priority && (
                    <FaExclamationCircle
                      className={`absolute top-2 right-2 ${email.priority === 'High Priority' ? 'text-red-500' : 'text-green-500'}`}
                      size={20}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => {
                if (user?.email) {
                  fetchEmails(getGmailLabel(slug), user.email, nextPageToken);
                }
              }}
            >
              Load More
            </button>
          </>
        )}
      </div>

      <Compose isOpen={isComposeOpen} onClose={closeComposeModal} userEmail={user?.email} />
    </div>
  );
};

export default DashboardPage;
