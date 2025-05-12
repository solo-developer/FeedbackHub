// components/InlineLoader.tsx
import React from 'react';
import { BeatLoader } from 'react-spinners';

const InlineLoader: React.FC = () => {
  return (
    <div className="d-flex justify-content-center py-3">
      <BeatLoader size={12} margin={3} color="#6c757d" />
    </div>
  );
};

export default InlineLoader;
