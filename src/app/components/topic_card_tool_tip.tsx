'use client';
import { ReactNode, useRef } from 'react';

/*
 This client component is used to display tooltips on hover for topic items.
*/
export interface TopicToolTipProps {
  title: string;
    long_description: string;
    short_description: string;
    user: string;
  
}
interface Props extends TopicToolTipProps {
  children: ReactNode;
}
export const TopicToolTip = ({
  children,
  title,
  long_description,
  short_description,
}: Props) => {
  const tooltipReference = useRef<HTMLDivElement>(null);
  const containerReference = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerReference}
      onMouseEnter={({ clientX, clientY }) => {
        if (!tooltipReference.current || !containerReference) return;
        const boundingRect =
          containerReference.current?.getBoundingClientRect();
        let left = 0.0;
        let top = 0.0;
        if (boundingRect) {
          ({ left, top } = boundingRect);
        }
        tooltipReference.current.style.left = `${clientX - left}px`;
        tooltipReference.current.style.top = `${clientY - top}px`;
      }}
      className="group relative inline-block"
    >
      {children}
      <div
        ref={tooltipReference}
        className="p2 invisible absolute rounded-lg bg-slate-600/90 opacity-0 transition group-hover:visible group-hover:z-50 group-hover:opacity-100"
      >
        <div className="flex w-72 flex-col p-2">
          <h3 className="eft flex1 text-left text-lg font-semibold text-slate-100">
            {title}
          </h3>
          <div className="mt-2 flex justify-between">
          </div>
          <div className="mt-2 flex-1">
          </div>
        </div>
      </div>
    </div>
  );
};
