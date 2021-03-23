using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Logic
{
    public class DataLogic
    {
        private readonly DissertationContext _context;

        public DataLogic(DissertationContext context)
        {
            _context = context;
        }

        public string UploadPatients(List<Patient> patients)
        {
            string ErrorMessage = "";
            try
            {
                List<Patients> patientsForDBAdd = new List<Patients>();
                List<Patients> patientsforDBUpdate = new List<Patients>();
                // convert each patient class to DB version 'Patients' and add to list
                foreach (var patient in patients)
                {
                    var patientForDB = ConvertPatientForDB(patient);

                    var exists = _context.Patients.Count(p => p.PatientId == patientForDB.PatientId) > 0 ? true : false;

                    if (exists)
                    {
                        patientsforDBUpdate.Add(patientForDB);
                    }
                    else
                    {
                        patientForDB.Uploaded = patient.uploaded;
                        patientsForDBAdd.Add(patientForDB);
                    }
                }

                foreach (var patient in patientsForDBAdd)
                {
                    _context.Patients.Add(patient);
                }

                ErrorMessage += UpdatePatients(patientsforDBUpdate);

                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                ErrorMessage = ErrorMessage + "UPLOAD ERROR:\n" + ex;
            }
            return ErrorMessage;
        }

        public Patients ConvertPatientForDB(Patient patient)
        {
            string preconditions = null;
            if (patient.preconditions.Count() > 0)
            {
                if (patient.preconditions[0] != "")
                {
                    preconditions = string.Join("; ", patient.preconditions);
                }
            }
            var patientForDB = new Patients
            {
                PatientId = patient.id,
                Sex = patient.sex,
                Age = patient.age,
                Preconditions = preconditions,
                PhoneNumber = patient.phoneNumber,
                RiskScore = patient.riskScore
            };

            return patientForDB;
        }

        public ReturnedPatients GetPatients()
        {
            var patientsFromDB = _context.Patients.ToList();

            var patients = new ReturnedPatients();
            var patientList = new List<Patient>();

            foreach (var patient in patientsFromDB)
            {
                List<string> PatientPreconditions = new List<string>();

                if (patient.Preconditions != null) // This currently fails as preconditions is null. change to null check
                {
                    PatientPreconditions = patient.Preconditions.Split(';').ToList();
                }

                var convertedPatient = new Patient()
                {
                    id = patient.PatientId,
                    age = patient.Age,
                    sex = patient.Sex,
                    preconditions = PatientPreconditions,
                    riskScore = patient.RiskScore,
                    uploaded = patient.Uploaded,
                    modified = patient.Modified,
                    highRisk = patient.RiskScore >= 50 ? true : false,
                    rowColour = patient.RiskScore >= 50 ? "red" : "black",
                    phoneNumber = patient.PhoneNumber,
                    deletePatient = false
                };
                patientList.Add(convertedPatient);
            }

            patients.Patients = patientList;

            return patients;
        }

        public List<string> GetPatientsPhoneNumberByID(List<Patient> patients)
        {
            List<string> PatientIDsList = new List<string>();
            List<string> phoneNumber = new List<string>();

            patients.ForEach(patient =>
            {
                PatientIDsList.Add(patient.id);
            });

            // Select all patients from the db that are in the current uploaded file and are high risk
            var patientsFromDBByID = _context.Patients.Where(p => PatientIDsList.Contains(p.PatientId)).ToList();

            foreach(var patientFromDB in patientsFromDBByID)
            {
                //var nonUpdatedPatient = patients.Where(p => p.id == updatedPatient.PatientId).First();

                int? previousRiskScore = (patientFromDB.PreviousRiskScore == null) ? 0 : patientFromDB.PreviousRiskScore;
                bool greaterRiskScore = patientFromDB.RiskScore > previousRiskScore ? true : false;

                if (greaterRiskScore && patientFromDB.RiskScore >= 50 && patientFromDB.PhoneNumber != null)
                {
                    phoneNumber.Add(patientFromDB.PhoneNumber);
                }
            }

            return phoneNumber;
        }

        public string UpdatePatients(List<Patients> patients)
        {
            var ErrorMessage = "";

            try
            {
                foreach (var patient in patients)
                {
                    // fetch existing record
                    var patientFromDB = _context.Patients.Where(p => p.PatientId == patient.PatientId).First();

                    //update record
                    if ((patientFromDB.Age == patient.Age) && (patientFromDB.PhoneNumber == patient.PhoneNumber) && (patientFromDB.Preconditions == patient.Preconditions))
                    {
                        continue;
                    }
                    else
                    {
                        patientFromDB.Age = patient.Age;
                        patientFromDB.PhoneNumber = patient.PhoneNumber == "" ? null : patient.PhoneNumber;
                        patientFromDB.Preconditions = patient.Preconditions;
                        patientFromDB.PreviousRiskScore = patientFromDB.RiskScore;
                        patientFromDB.RiskScore = patient.RiskScore;
                        patientFromDB.Modified = DateTime.Now;

                        //mark as modified so record gets correctly updated
                        _context.Attach(patientFromDB).State = EntityState.Modified;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage += ex;
            }

            return ErrorMessage;
        }

        public string DeletePatients(List<Patient> patients)
        {
            string ErrorMessage = "";

            try
            {
                foreach (var patient in patients)
                {
                    var convertedPatient = ConvertPatientForDB(patient);
                    _context.Patients.Remove(convertedPatient);
                }
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                ErrorMessage += ex;
            }

            return ErrorMessage;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
