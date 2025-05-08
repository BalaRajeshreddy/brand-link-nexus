
import React from 'react';

interface HeadingTextBlockProps {
  content: {
    heading: string;
    text: string;
  };
  styles: Record<string, any>;
}

export const HeadingTextBlock = ({ content, styles }: HeadingTextBlockProps) => {
  const {
    backgroundColor = 'transparent',
    padding = '16px',
    borderRadius = '8px',
    textAlign = 'left',
    textColor = '#000000',
    headingSize = '24px',
    textSize = '16px',
  } = styles || {};

  return (
    <div 
      className="heading-text-block w-full my-4"
      style={{
        backgroundColor,
        padding,
        borderRadius,
        textAlign,
      }}
    >
      {content.heading && (
        <h2 
          className="mb-2"
          style={{
            fontSize: headingSize,
            fontWeight: 'bold',
            color: textColor,
            textAlign,
          }}
        >
          {content.heading}
        </h2>
      )}
      {content.text && (
        <p
          style={{
            fontSize: textSize,
            color: textColor,
            textAlign,
          }}
        >
          {content.text}
        </p>
      )}
    </div>
  );
};
