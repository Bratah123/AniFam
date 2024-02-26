import React from 'react';

interface Topic {
  id: number;
  title: string;
  description: string;
  // Add more properties if needed, basic properties for now
}

interface TopicListProps {
  topics: Topic[];
}

const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <div>
      <h2>Recent Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <a href={`/topics/${topic.id}`}>{topic.title}</a>
            <p>{topic.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
