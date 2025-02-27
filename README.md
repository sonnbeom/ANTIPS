# 📝 프로젝트 소개


<br/>

> 격리병동 의료진을 위한 환자 모니터링 서비스입니다.
<br/> <br/>
> 개발 인원 : 6명 <br/>
> 개발 기간 : 2025.01 ~ 2025.02

## 기술 스택

* 서비스: Java, Spring Boot, Spring Security, Spring Cloud Gateway, JPA, QueryDSL
* 데이터베이스: MySQL, Redis
* 인프라: Jenkins,  Docker, AWS EC2
<br/>

<br/>


## 목차

1. 시스템 아키텍처
2. API 문서 (스웨거)
3. 폴더 구조
4. ERD
5. 통합 테스트
6. 리팩토링
7. 트러블 슈팅
<br/>

<br/>





# 🔨 시스템 아키텍처

![Image](https://github.com/user-attachments/assets/0ed2aa40-5ed2-4c57-b6d0-d09f38c8e862)
![Image](https://github.com/user-attachments/assets/e16e46d2-ad70-4783-bb81-798f234fbcba)
<br/>

# 🗒️ ERD 설계

- [ERD 링크](https://www.erdcloud.com/d/ywTjLbdqE25HPAYdG)

![Image](https://github.com/user-attachments/assets/5fb21747-8b33-403f-85ac-24ac0c9980e8)

<br/>

# 📜  API 문서

![Image](https://github.com/user-attachments/assets/aeb3f812-f697-4add-a7e5-ab2df05c4ba0)


# 📁 디렉토리 구조

![Image](https://github.com/user-attachments/assets/8a176dc0-abeb-410a-806a-2a332cc8abcb)



<br/>

# 💡 주요 업무


- **Jenkins, NginX를 활용하여  CI/CD 파이프라인 구축(블루,그린 무중단 배포)**
- **에러 발생시, MatterMost Web hook을 통해 에러를 확인 가능(Spring Exception Sender)**
- **인증 서버, 서비스 서버, 게이트웨이 서버를 각각 Docker 컨테이너로 구축. 스프링 클라우드 게이트웨이를 통해 라우팅**
- **깃에 푸쉬할 경우, MatterMost를 통해 빌드 결과 확인 가능**
- **깃에 푸쉬할 경우, SonarQube를 통해 정적분석 결과 확인 가능**
- **SSE 통신을 통해 실시간 알림 구현**

<br/>

# 🌟 프로젝트 진행 중 고려사항



### 1차 모델
![image](https://github.com/sonnbeom/play_spring/assets/127067296/f2a17167-1cce-4916-a1e6-6016a1f26bfb)





<hr/>




