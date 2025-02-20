package backend.patient.batch.sceduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class BatchScheduler {
    private final JobLauncher jobLauncher;
    private final Job updatePatientStatusJob;  // ✅ 반드시 등록된 Job과 일치해야 함

//    @Scheduled(cron = "0 0 5,11,22 * * ?", zone = "Asia/Seoul") // 새벽 5시, 오전 10시, 오후 10시 실행
//    public void runBatchJob() throws JobExecutionException {
//        JobParameters jobParameters = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis()) // 중복 실행 방지
//                .toJobParameters();
//
//        jobLauncher.run(updatePatientStatusJob, jobParameters);  // ✅ 등록된 Job 실행
//    }
    @Scheduled(cron = "0 * * * * ?", zone = "Asia/Seoul")
    public void runBatchJob() throws JobExecutionException {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis()) // 중복 실행 방지
                    .toJobParameters();

            log.info("환자 상태 업데이트 배치 작업 시작");
            JobExecution execution = jobLauncher.run(updatePatientStatusJob, jobParameters);
            log.info("환자 상태 업데이트 배치 작업 완료: {}", execution.getStatus());
        } catch (Exception e) {
            log.error("배치 작업 실행 중 오류 발생", e);
            throw e;
        }
    }
}