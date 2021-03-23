using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Logic
{
    public class AlgorithmLogic
    {
        public AlgorithmLogic()
        {
            
        }

        public List<string[]> ExtractPatients(IFormFile file)
        {
            List<string[]> feilds = new List<string[]>();
            var result = new StringBuilder();
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                // Ignore the first line
                string headerLine = reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    var record = reader.ReadLine();
                    feilds.Add(record.Split(','));
                }
            }

            return feilds;
        }

        public ReturnedPatients ValidateFile(List<string[]> feilds)
        {
            
            var ErrorMessage = Validation(feilds);

            List<Patient> patients = new List<Patient>();

            if (ErrorMessage == "")
            {
                feilds.ForEach(item =>
                {
                    var patient = new Patient(item);
                    patients.Add(patient);
                });

                patients = CalculateRisk(patients);
            }
            else
            {
                // Return back to the front end an error message for the user
                ErrorMessage = "DATA ERROR:\n" + ErrorMessage;             
            }
            var returnedPatients = new ReturnedPatients
            {
                Patients = patients,
                ErrorMessage = ErrorMessage
            };
            return returnedPatients;
        }

        public List<Patient> CalculateRisk(List<Patient> patients)
        {
            foreach (var patient in patients)
            {
                patient.riskScore = 0;

                //Calculate risk score of patients
                foreach (var condition in patient.preconditions)
                {

                    switch (condition.ToUpper())
                    {
                        case "PNEUMONIA":
                            patient.riskScore += 100;
                            break;
                        case "RENAL_CHRONIC":
                            patient.riskScore += 75;
                            break;
                        case "DIABETES":
                            patient.riskScore += 50;
                            break;
                        case "HYPERTENSION":
                            patient.riskScore += 30;
                            break;
                        case "OBESITY":
                            patient.riskScore += 30;
                            break;
                        case "IMMUNOSUPPRESSED":
                            patient.riskScore += 25;
                            break;
                        case "COPD":
                            patient.riskScore += 25;
                            break;
                        default:
                            patient.riskScore += 0;
                            break;
                    }
                }
                if (patient.sex.ToUpper() == "M")
                {
                    patient.riskScore += 40;
                }
                if (patient.age >= 50)
                {
                    patient.riskScore += 40;
                }

                // Calculate if the paitent is at high risk
                // High risk = risk score >= 50
                if (patient.riskScore >= 50)
                {
                    patient.highRisk = true;
                    patient.rowColour = "red";
                }
            }

            return patients;
        }

        public static string Validation(List<string[]> patients)
        {
            string ErrorMessage = "";
            List<string> duplicateIds = new List<string>();

            // Column number validation
            if (patients.Count() == 0)
            {
                ErrorMessage += "File contains no values\n";
                return ErrorMessage;
            }

            if (patients.First().Length != 5)
            {
                ErrorMessage += "File contains an incorrect number of columns. Should only contain  - Id, Sex, Age, Preconditions, Phone Number\n";
                return ErrorMessage;
            }

            // feild validation
            foreach (var patient in patients)
            {
                string patientID = patient[0], sex = patient[1], age = patient[2], preconditions = patient[3], phoneNumber = patient[4];
                //preconditions validation
                ErrorMessage += ValidatePreconditions(preconditions, patientID);
                //Null Entry validation
                ErrorMessage += ValidateNonNullColumns(patientID, sex, age);
                // Duplicate ID validation
                var duplicateIdCount = patients.Count(i => i[0] == patientID);
                if (duplicateIdCount > 1)
                {
                    if (!duplicateIds.Contains(patientID))
                    {
                        duplicateIds.Add(patientID);
                    }
                }
                // Age validation
                ErrorMessage += ValidateAge(age, patientID);
                //Sex validation
                ErrorMessage += ValidateSex(sex, patientID);
                // PhoneNumber validation
                ErrorMessage += ValidatePhoneNumber(phoneNumber, patientID);
            }

            duplicateIds.ForEach(ID =>
            {
                ErrorMessage += ("Duplicate paitent id - " + ID + ".\n");
            });

            return ErrorMessage;
        }

        private static string ValidatePreconditions(string preconditions, string patientID)
        {
            var ErrorMessage = "";

            if (preconditions.Length > 0)
            {
                if (preconditions[0] == ';')
                {
                    ErrorMessage += ("The preconditions column cannot start with ';' for Id - " + patientID + "\n");
                }

                var CleanedPreconditions = preconditions.ToUpper().Split(';').ToList() ;

                CleanedPreconditions = CleanedPreconditions.Select(t => t.Trim()).ToList();

                var duplicatePreconditions = new List<string>();

                var duplicates = CleanedPreconditions.GroupBy(_ => _).Where(_ => _.Count() > 1).Sum(_ => _.Count());

                if (duplicates > 0)
                {
                    ErrorMessage += ("You cannot enter the same precondition more than once for patient - " + patientID + "\n");
                }

                bool invalidConditions = false;
                foreach (var condition in CleanedPreconditions)
                {
                    var trimmedCondition = condition.Trim();
                    if (trimmedCondition != "PNEUMONIA" && trimmedCondition != "RENAL_CHRONIC" && trimmedCondition != "DIABETES" && trimmedCondition != "HYPERTENSION"
                        && trimmedCondition != "OBESITY" && trimmedCondition != "IMMUNOSUPPRESSED" && trimmedCondition != "COPD" && condition != "")
                    {
                        invalidConditions = true;
                        break;
                    }
                }

                if (invalidConditions)
                {
                    ErrorMessage += ("One or more of the preconditions for patient - " + patientID + " are not supported. " +
                        "The preconditons currently supported are - pneumonia, renal_chronic, diabetes, hypertension, obesity, immunosupressed, COPD " + "\n"); ;
                }
            }

            return ErrorMessage;
        }

        private static string ValidateNonNullColumns(string patientID, string sex, string age)
        {
            var ErrorMessage = "";

            if (patientID == "")
            {
                ErrorMessage += ("One or more of the patients does not have an ID" + "\n");
            }

            if (sex == "" || age == "")
            {
                ErrorMessage += ("No value has been entered in either the Sex or Age column for Id - " + patientID + "\n");
            }

            return ErrorMessage;
        }

        private static string ValidateAge(string patientAge, string patientID)
        {
            var ErrorMessage = "";

            var isAgeNumeric = int.TryParse(patientAge, out int age);

            if ((!isAgeNumeric || age > 120 || age < 0))
            {
                ErrorMessage += ("The value in the Age column for patient " + patientID + " should be a number in the range 0-120" + "\n");
            }

            return ErrorMessage;
        }

        private static string ValidatePhoneNumber(string phoneNumber, string patientID)
        {
            var ErrorMessage = "";

            // Phone number validation
            if (phoneNumber != null)
            {
                if (phoneNumber.Length > 0)
                {
                    var phoneErrorMsg = "The value in the Phone Number column for patient " + patientID + " should be a mobile number in the format shown in the template" + "\n";
                    var phoneArr = phoneNumber.Split(' ').ToList();

                    // Ensure number entered in format "countrycode number" which would lead to 2 items in phone array when split on space
                    if (phoneArr.Count() != 2)
                    {
                        ErrorMessage += phoneErrorMsg;
                    }
                    else
                    {
                        var countryCode = phoneArr[0].ToList();

                        if (countryCode[0] != '+')
                        {
                            ErrorMessage += phoneErrorMsg;
                        }
                        else
                        {
                            //remove operator from code
                            var cleanedCode = phoneArr[0].TrimStart('+');

                            //ensure code is numeric - this is where certain island countries will fail validation
                            var isCodeNumeric = Regex.IsMatch(cleanedCode, @"^\d+$");
                            if (!isCodeNumeric)
                            {
                                ErrorMessage += phoneErrorMsg;
                            }
                            else
                            {
                                var isNumberNumeric = Regex.IsMatch(phoneArr[1], @"^\d+$");

                                if (!isNumberNumeric)
                                {
                                    ErrorMessage += phoneErrorMsg;
                                }
                            }
                        }
                    }
                }
            }

            return ErrorMessage;
        }

        private static string ValidateSex(string sex, string patientID)
        {
            var ErrorMessage = "";

            if (sex.ToUpper() != "M" && sex.ToUpper() != "F" && sex != "")
            {
                ErrorMessage += ("The value in the Sex column for patient " + patientID + " should either be M (male), F (female) or O (other)" + "\n");
            }

            return ErrorMessage;
        }

        public ReturnedPatients ValidatePatientUpdate(Patient patient)
        {
            var ErrorMessage = "";

            string patientID = patient.id;
            string age = patient.age.ToString();
            List<string> preconditions = patient.preconditions;
            string phoneNumber = patient.phoneNumber;

            ErrorMessage += ValidateAge(age, patientID);
            ErrorMessage += ValidatePreconditions(preconditions[0], patientID);
            ErrorMessage += ValidatePhoneNumber(phoneNumber, patientID);

            var response = new ReturnedPatients
            {
                ErrorMessage = ErrorMessage
            };

            return response;
        }

        public List<string> ConvertPreconditions(string preconditions)
        {
            List<string> preconditionsList = new List<string>();

            var conditions = preconditions.Trim().Split(';');
            foreach (var condition in conditions)
            {
                string trimmedCondition = string.Concat(condition.Where(c => !char.IsWhiteSpace(c)));
                if (trimmedCondition == "")
                {
                    continue;
                }
                preconditionsList.Add(condition.Trim().ToUpper());
            }

            return preconditionsList;
        }
    }
}
