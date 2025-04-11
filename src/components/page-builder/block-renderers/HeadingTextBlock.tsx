
import React from 'react';

interface HeadingTextBlockProps {
  content: {
    heading: string;
    text: string;
  };
  styles: Record<string, any>;
}

export const HeadingTextBlock = ({ content, styles }: HeadingTextBlockProps) => {
  return (
    <div 
      className="heading-text-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <h2 
        className="mb-2"
        style={{
          fontSize: styles.headingSize || '24px',
          fontWeight: 'bold',
          color: styles.textColor || '#000000',
          textAlign: styles.textAlign || 'left'
        }}
      >
        {content.heading}
      </h2>
      <p
        style={{
          fontSize: styles.textSize || '16px',
          color: styles.textColor || '#000000',
          textAlign: styles.textAlign || 'left'
        }}
      >
        {content.text}
      </p>
    </div>
  );
};
