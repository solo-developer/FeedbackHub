import React, { ReactNode } from 'react';

interface PanelProps {
  title: string;
  headerContent?: ReactNode;  // Allows optional custom content in the header
  children: ReactNode;        // Content inside the body of the panel
}

const PagePanel: React.FC<PanelProps> = ({ title, headerContent, children }) => {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>{title}</div>
        {headerContent && <div>{headerContent}</div>}  {/* Render any custom content passed to headerContent */}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default PagePanel;
