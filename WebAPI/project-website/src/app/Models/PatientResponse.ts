import { Patient } from './Patient';

export class PatientResponse {
  errorMessage: string = "";
  patients: Patient[] = [];
  patientsPerPrecondition: [] = [];
  malePatientsPerPrecondition: [] = [];
  femalePatientsPerPrecondition: [] = [];
  maleAvgRiskScore: number = 0;
  femaleAvgRiskScore: number = 0;
}
