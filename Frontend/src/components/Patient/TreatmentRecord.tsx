// components/Treatment/TreatmentRecord.tsx
import React from 'react';
import './TreatmentRecordStyle.css';
import { FaSyringe, FaFlask } from 'react-icons/fa';

interface TreatmentRecordProps {
  type: 'urgent' | 'normal';
  title: string;
  description: string;
  doctor: string;
  timestamp: string;
}

const TreatmentRecord: React.FC<TreatmentRecordProps> = ({
  type,
  title,
  description,
  doctor,
  timestamp
}) => {
  const Icon = type === 'urgent' ? FaSyringe : FaFlask;
  
  return (
    <div className="treatment-record">
      <div className={`record-icon ${type}`}>
        <Icon />
      </div>
      <div className="record-content">
        <div className="record-header">
          <h3>{title}</h3>
          <span className="timestamp">{timestamp}</span>
        </div>
        <p className="description">{description}</p>
        <div className="doctor-info">
          <span>담당의: {doctor}</span>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRecord;