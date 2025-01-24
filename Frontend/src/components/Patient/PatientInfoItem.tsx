// components/Patient/PatientInfoItem.tsx
import React from 'react';

interface PatientInfoItemProps {
  label: string;
  value: string | number;
  isUrgencyLevel?: boolean;
  urgencyLevel?: number;
  priority?: boolean; // 우선순위 표시를 위한 prop 추가
}

const PatientInfoItem: React.FC<PatientInfoItemProps> = ({ 
  label, 
  value, 
  isUrgencyLevel = false,
  urgencyLevel,
  priority = false
}) => {
  return (
    <div className={`patient-detailcard-info-item ${priority ? 'priority-item' : ''}`}>
      <label>{label}</label>
      {isUrgencyLevel ? (
        <p className={`level-${urgencyLevel}`}>
          Level {value}
        </p>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};

export default PatientInfoItem;
