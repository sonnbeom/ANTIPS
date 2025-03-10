# 📝 프로젝트 소개


<br/>

> 격리병동 의료진을 위한 환자 모니터링 서비스입니다.
<br/> <br/>
> 개발 인원 : 6명 <br/>
> 백엔드, 인프라 1명, 프론트 1명, 임베디드 4명 <br/>
> 개발 기간 : 2025.01 ~ 2025.02
감 <br/>
담당: 팀장, 인프라, 백엔드
## 기술 스택
- 설계: 점진적으로 MSA 구축 중 (현재 4개의 서비스), 멀티 모듈로 서비스 관리
* 서비스: Java, Spring Boot, Spring Security, Spring Cloud Gateway, JPA, QueryDSL
* 데이터베이스: MySQL, Redis
* 인프라: Nginx, Docker, AWS, Docker
<br/>

<br/>


## 목차

1. 시스템 아키텍처
2. ERD
3. API 문서
4. 디렉토리 구조
5. 주요 업무
7. 트러블 슈팅 & 개선 작업
<br/>

<br/>





# 🔨 시스템 아키텍처


클라이언트 측의 요청을 Nginx로 구축된 Reverse Proxy에서 전달 받습니다.
이후 인증이 필요한 endpoint의 경우에는 인증서버를 거쳐서 개별 서비스로 전달 되도록 설계되었습니다.

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
전체 서비스는 멀티 모듈 형태로 구성하였습니다.

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

# 🔧 Troubleshooting & 개선 작업

### 1. EC2 서버 에러 모니터링 자동화
#### 문제 상황
- EC2 서버에 쌓이는 에러 로그를 수동으로 확인하는 작업이 번거롭고 비효율적이었음
- 실시간으로 발생하는 예외 상황을 즉각적으로 파악하기 어려움
#### 해결 과정
- Spring Exception Sender 모듈을 개발하여 특정 예외 발생 시 MatterMost Webhook API를 통해 에러 메시지를 자동 전송하도록 구현
- 예외의 Stack Trace와 발생 시간을 함께 전송하도록 설정하여 디버깅 효율성을 높임


![Image](https://github.com/user-attachments/assets/e23e302d-288b-42ea-9c95-0a48b07d8824)

## 2.  CI/CD 빌드 결과 자동 알림 시스템
#### 문제 상황
- Jenkins를 통해 빈번한 빌드가 이루어졌으나, 성공/실패 여부를 직접 EC2에 접속해 확인해야 하는 불편함 존재
#### 해결 과정
- Git Push 발생 시 Jenkins 빌드 결과(성공/실패)를 MatterMost 채널로 자동 전송하도록 Webhook 연동
- MatterMost 메시지에서 빌드 번호와 상세 로그 링크를 함께 제공하여 빠른 접근 가능하도록 구성
![Image](https://github.com/user-attachments/assets/150675a6-3462-4471-9025-22a4e1c65b25)
<hr/>




