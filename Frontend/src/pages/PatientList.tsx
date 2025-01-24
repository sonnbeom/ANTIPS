import React, { useState, useEffect, useRef } from "react";
import "./PatientListStyle.css";
import PatientCard from "../components/Patient/PatientCard.tsx"; // 환자 카드 컴포넌트
import PatientAlertSection from "../components/Patient/PatientAlert.tsx";
import FloorButton from "../components/Patient/Floorbtn.tsx";
import SortButton from "../components/Patient/SortBtn.tsx";

const PatientList: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<number>(6); // 처음 렌더링할 카드 수
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleFloorClick = (floor: string) => {
    setActiveFloor(prev => (prev === floor ? null : floor));
  };

  const handleSortClick = (sort: string) => {
    setActiveSort(sort); // 클릭된 정렬 기준을 활성화 상태로 설정
    console.log(`현재 정렬 기준: ${sort}`);
  };

  // 전체 환자 데이터
  const patientData = [
    { name: "김서연", patientId: "#12345", location: "1층 - 101호", status: "입원중", alertType: "응급", alertMessage: "알레르기 반응", lastTreatmentDate: "2일 전" },
    { name: "이민준", patientId: "#12346", location: "1층 - 103호", status: "대기중", alertType: "특별 메모", alertMessage: "추적 관찰 필요", lastTreatmentDate: "5일 전" },
    { name: "박지우", patientId: "#12347", location: "2층 - 201호", status: "입원중", alertType: "응급", alertMessage: "심박수 이상", lastTreatmentDate: "1일 전" },
    { name: "최민수", patientId: "#12348", location: "2층 - 202호", status: "대기중", alertType: "특별 메모", alertMessage: "약물 부작용 관찰 필요", lastTreatmentDate: "3일 전" },
    { name: "이정민", patientId: "#12349", location: "3층 - 301호", status: "입원중", alertType: "", alertMessage: "", lastTreatmentDate: "4일 전" },
    { name: "한지민", patientId: "#12350", location: "3층 - 302호", status: "대기중", alertType: "", alertMessage: "", lastTreatmentDate: "6일 전" },
    // 더 많은 데이터 추가 가능
  ];

  // 무한 스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCards((prev) => prev + 4); // 추가로 렌더링할 카드 수
        }
      },
      { root: observerRef.current, threshold: 1.0 } // root를 `patient-card-list`로 설정
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);

    return () => {
      if (currentObserver) observer.disconnect();
    };
  }, []);

  return (
    <div className="patient-list-container">
      {/* 응급 및 특별 알림 */}
      <div className="patient-alert-sections">
        <PatientAlertSection />
      </div>

      {/* 층별 필터 */}
      <div className="patient-floor-filter-section">
        {["1층", "2층", "3층"].map((floor) => (
          <FloorButton
            key={floor}
            floor={floor}
            count={patientData.filter((p) => p.location.startsWith(floor)).length}
            isActive={activeFloor === floor}
            onClick={() => handleFloorClick(floor)}
          />
        ))}
      </div>

      <div className="patient-sort-section">
  <div className="sort-buttons">
    {["최신순", "위급도순"].map((option) => (
      <SortButton
        key={option}
        label={option}
        isActive={activeSort === option}
        onClick={() => handleSortClick(option)}
      />
    ))}
  </div>
  {!isMobile && <button className="add-patient-button">+ 환자 추가</button>}
</div>

      {/* 환자 카드 리스트 */}
      <div className="patient-card-list" ref={observerRef}>
        {patientData.slice(0, visibleCards).map((patient, index) => (
          <PatientCard key={index} {...patient} />
        ))}
        {/* 무한 스크롤 트리거 */}
        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
};

export default PatientList;
