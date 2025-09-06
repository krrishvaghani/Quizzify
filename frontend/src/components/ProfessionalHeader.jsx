import React from 'react';
import { GraduationCap } from 'lucide-react';

const ProfessionalHeader = ({ title, subtitle }) => {
  return (
    <div className="professional-header">
      <div className="header-icon">
        <GraduationCap size={48} />
      </div>
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default ProfessionalHeader;
