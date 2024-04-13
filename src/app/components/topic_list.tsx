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
const pngImage = '/anya_chibi_t.png';
const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <div style={{ maxWidth: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {topics.map((topic) => (
          <li key={topic.id} style={{ marginBottom: '1rem', position: 'relative' }}>
            <div style={{ borderRadius: '12px', padding: '2rem', backgroundColor: 'rgba(83, 228, 193, 0.9)', color: 'white', position: 'relative' }}> 
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <a href={`/topics/${topic.id}`} style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{topic.title}</a> 
                <div style={{ borderBottom: '1px solid black', width: '100%', marginBottom: '1rem' }}></div>
                <p style={{ fontSize: '1.5rem', margin: 0 }}>{topic.description}</p> 
              </div>
              {/* Image positioned to the top-right corner */}
              <img src={pngImage} alt="Corner Image" style={{ position: 'absolute', top: '0.01rem', left: '0.01rem', width: '50px', height: '50px' }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;