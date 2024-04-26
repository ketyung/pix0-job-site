import React from 'react';
//import Markdown from 'markdown-to-jsx';
import Markdown from 'react-markdown'
import './css/Md.css';

interface MarkdownRendererProps {
    markdownContent: string;
}

const customComponents: { [key: string]: React.ComponentType<any> } = {
  h1: ({ children }) => <h1 style={{ color: '#333',fontSize:"22px", fontWeight:"bolder" }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ color: '#222',fontSize:"18px", fontWeight:"bold" }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ color: '#223',fontSize:"14px" }}>{children}</h3>,
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent }) => {
   
  return (
    <div className='mt-4' style={{ whiteSpace: 'break-spaces', fontWeight:400 }}>
      <Markdown components={customComponents} className="MyMd">{markdownContent}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
