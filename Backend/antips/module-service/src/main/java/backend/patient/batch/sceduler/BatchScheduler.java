package backend.patient.batch.sceduler;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionException;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class BatchScheduler {
    private final JobLauncher jobLauncher;
    private final Job updatePatientStatusJob;  // ✅ 반드시 등록된 Job과 일치해야 함

    @Scheduled(cron = "0 0 5,11,22 * * ?", zone = "Asia/Seoul") // 새벽 5시, 오전 10시, 오후 10시 실행
    public void runBatchJob() throws JobExecutionException {
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis()) // 중복 실행 방지
                .toJobParameters();

        jobLauncher.run(updatePatientStatusJob, jobParameters);  // ✅ 등록된 Job 실행
    }
}