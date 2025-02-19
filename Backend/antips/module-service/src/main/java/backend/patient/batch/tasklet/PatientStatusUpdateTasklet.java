package backend.patient.batch.tasklet;

import backend.patient.domain.Patient;
import backend.patient.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PatientStatusUpdateTasklet implements Tasklet {
    private final PatientRepository patientRepository;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        updatePatientStatus();

        return RepeatStatus.FINISHED;
    }
    @Transactional
    private void updatePatientStatus(){
        List<Patient> patients = patientRepository.findAll();
        for (Patient patient : patients) {
            patient.resetStatus(); // 더티체킹
        }
    }
}
