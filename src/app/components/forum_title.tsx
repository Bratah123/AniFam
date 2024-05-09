import React from 'react';

type ForumTitleProps = {
  text: string;
};

export function ForumTitle(prop : ForumTitleProps){
    return (
        <div>
            <h1 className="text-3xl font-bold text-white text-center">{prop.text}</h1>
        </div>
    );
}