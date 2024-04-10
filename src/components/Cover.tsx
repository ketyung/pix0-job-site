import React from 'react';
import './css/Cover.css'; // Import CSS file for styling
import { BeatLoader } from 'react-spinners';

interface Props {
  visible?: boolean;
}

const Cover: React.FC<Props> = ({ visible }) => {
  // If 'visible' prop is false or undefined, return null to hide the cover
  if (!visible) {
      return null;
  }

  return (
    <div className="cover">
        <div className="loading-indicator"><BeatLoader size={10}/></div>
    </div>
  );
};

export default Cover;
