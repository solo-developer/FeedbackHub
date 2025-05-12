import React from 'react';
import { ClipLoader } from 'react-spinners';
import './../styles/FullScreenLoader.css';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fullscreen-loader">
      <ClipLoader size={60} color="#0d6efd" />
    </div>
  );
};

export default FullScreenLoader;
