package backend.common.config;

import backend.patient.batch.tasklet.PatientStatusUpdateTasklet;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;


@Configuration
@EnableBatchProcessing // 스프링 배치를 작동시켜준다.
@RequiredArgsConstructor
public class BatchConfig {
    private final JobRepository jobRepository;
    private final PatientStatusUpdateTasklet patientStatusUpdateTasklet;
    private final PlatformTransactionManager transactionManager; // 트랜잭션 매니저 추가

    @Bean
    public Job updatePatientStatusJob() {
        return new JobBuilder("updatePatientStatusJob", jobRepository) // Job 이름 설정
                .incrementer(new RunIdIncrementer()) // 매 실행마다 ID 증가
                .start(updatePatientStatusStep()) // 첫 번째 Step 설정
                .build();
    }

    @Bean
    public Step updatePatientStatusStep() {
        return new StepBuilder("updatePatientStatusStep", jobRepository) // Step 이름 설정
                .tasklet(patientStatusUpdateTasklet, transactionManager) // Tasklet 실행
                .build();
    }

}