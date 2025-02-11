// components/Treatment/TreatmentRecord.tsx
import React from 'react';
import './TreatmentRecordStyle.css';
import { FaSyringe } from 'react-icons/fa';

interface TreatmentRecordProps {
  id: number;        // key 대신 id 사용
  content: string;
  createdAt: string;
}

const TreatmentRecord: React.FC<TreatmentRecordProps> = ({
  id,
  content,
  createdAt,
}) => {
  const Icon = FaSyringe;
  
  return (
    <div className="treatment-record">
      <div className={`record-icon`}>
        <Icon />
      </div>
      <div className="record-content">
        <div className="record-header">
          <span className="timestamp">{createdAt.split('T')[0]}</span>
        </div>
        <p className="description">{content}</p>
      </div>
    </div>
  );
};

export default TreatmentRecord;
