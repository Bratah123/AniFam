'use client';
import React, { useState, useEffect } from 'react';
import TopicList from '@/app/components/topic_list';
import { fetchAnyAvailSession } from "@/app/actions";
import Navbar from '@/app/components/navbar';

export default function Forums(params: any) { // Forums page component
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null); 
  const [topics, setTopics] = useState<any[]>([]); // state that holds the topics

  useEffect(() => { // Fetch session data after the component mounts to avoid a fetch waterfall issue
    const fetchSessionData = async () => {
      const res = await fetchAnyAvailSession('forums', params.searchParams);
      setSessionData(res);
    };

    fetchSessionData(); // Call the async function
  }, [params.searchParams]);

  const handleToggleTopicForm = () => { //show or hide the topic form
    setShowTopicForm(!showTopicForm);
  };

  const handleCreateTopic = () => { // Create a new topic
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;

    // Create new topic object
    const newTopic = {
      id: topics.length + 1,
      title,
      description,
    };

    setTopics(prevTopics => [...prevTopics, newTopic]);

    setShowTopicForm(false);
  };

  return ( 
    <div className="flex flex-col h-screen relative bg-slate-1000 bg-[url(/album_collage_1080.jpg)] bg-cover bg-center bg-no-repeat opacity-85">
      <Navbar isAdmin={sessionData?.is_admin} onHome={false} onForums={true} onAdmin={false} /> 
      <div className="py-4 px-4 bg-black bg-opacity-80 relative">
        <h1 className="text-5xl font-bold text-white text-center mb-4">Ani x Family Forums</h1>
      </div>
      <div className="flex-grow">
        <TopicList topics={topics} />
      </div>
      <button className="fixed bottom-12 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md" onClick={handleToggleTopicForm}>
        Create Topic
      </button>
      
      {showTopicForm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(83, 228, 193, 0.9)', padding: '1rem', borderRadius: '12px' }}>
          <form className="space-y-4">
            <label htmlFor="title" className="block text-black">
              Title:
              <input type="text" id="title" name="title" className="border border-gray-300 rounded-md p-2 w-full" />
            </label>
            <label htmlFor="description" className="block text-black">
              Description:
              <textarea id="description" name="description" rows={4} className="border border-gray-300 rounded-md p-2 w-full"></textarea>
            </label>
            <button type="button" className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4" onClick={handleCreateTopic}>
              Create
            </button>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-lg mt-4" onClick={handleToggleTopicForm}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
