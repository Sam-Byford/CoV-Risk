using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Twilio;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using WebAPI.Models;

namespace WebAPI.Logic
{
    public class OtherLogic
    {
        public OtherLogic()
        {

        }

        public List<List<int>> CalculatePatientPerPrecondition(List<Patient> patients)
        {
            int imCount = 0, pnCount = 0, obCount = 0, coCount = 0, hyCount = 0, diaCount = 0, rcCount = 0;
            int maleImCount = 0, malePnCount = 0, maleObCount = 0, maleCoCount = 0, maleHyCount = 0, maleDiaCount = 0, maleRcCount = 0;
            int femaleImCount = 0, femalePnCount = 0, femaleObCount = 0, femaleCoCount = 0, femaleHyCount = 0, femaleDiaCount = 0, femaleRcCount = 0;

            foreach (var patient in patients)
            {
                bool male = false;

                if (patient.sex == "M")
                {
                    male = true;
                }

                foreach (var condition in patient.preconditions)
                {
                    switch (condition.Trim().ToUpper())
                    {
                        case "PNEUMONIA":
                            pnCount += 1;
                            if (male)
                            {
                                malePnCount += 1;
                            }
                            else
                            {
                                femalePnCount += 1;
                            }
                            break;
                        case "RENAL_CHRONIC":
                            rcCount += 1;
                            if (male)
                            {
                                maleRcCount += 1;
                            }
                            else
                            {
                                femaleRcCount += 1;
                            }
                            break;
                        case "DIABETES":
                            diaCount += 1;
                            if (male)
                            {
                                maleDiaCount += 1;
                            }
                            else
                            {
                                femaleDiaCount += 1;
                            }
                            break;
                        case "HYPERTENSION":
                            hyCount += 1;
                            if (male)
                            {
                                maleHyCount += 1;
                            }
                            else
                            {
                                femaleHyCount += 1;
                            }
                            break;
                        case "OBESITY":
                            obCount += 1;
                            if (male)
                            {
                                maleObCount += 1;
                            }
                            else
                            {
                                femaleObCount += 1;
                            }
                            break;
                        case "IMMUNOSUPPRESSED":
                            imCount += 1;
                            if (male)
                            {
                                maleImCount += 1;
                            }
                            else
                            {
                                femaleImCount += 1;
                            }
                            break;
                        case "COPD":
                            coCount += 1;
                            if (male)
                            {
                                maleCoCount += 1;
                            }
                            else
                            {
                                femaleCoCount += 1;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

            List<int> femalePatientsPerPrecondition = new List<int>
            {
                femaleImCount,
                femalePnCount,
                femaleObCount,
                femaleCoCount,
                femaleHyCount,
                femaleDiaCount,
                femaleRcCount
            };
            List<int> malePatientsPerPrecondition = new List<int>
            {
                maleImCount,
                malePnCount,
                maleObCount,
                maleCoCount,
                maleHyCount,
                maleDiaCount,
                maleRcCount
            };

            List<int> patientsPerPrecondition = new List<int>
            {
                imCount,
                pnCount,
                obCount,
                coCount,
                hyCount,
                diaCount,
                rcCount
            };

            List<List<int>> returnList = new List<List<int>>
            {
                patientsPerPrecondition,
                femalePatientsPerPrecondition,
                malePatientsPerPrecondition

            };

            return returnList;
        }
        public int CalculateMaleRiskScoreAvg(List<Patient> patients)
        {
            List<int> maleRisks = new List<int>();
            var Males = patients.Where(p => p.sex == "M").ToList();
            var AvgMaleRisk = 0;

            if (Males.Count() > 0)
            {
                foreach (var male in Males)
                {
                    maleRisks.Add(male.riskScore);
                }

                var MaleRiskSum = maleRisks.Sum();
                if (MaleRiskSum > 0)
                {
                    AvgMaleRisk = MaleRiskSum / Males.Count();
                }

            }

            return AvgMaleRisk;
        }
        public int CalculateFemaleRiskScoreAvg(List<Patient> patients)
        {
            List<int> femaleRisks = new List<int>();
            var females = patients.Where(p => p.sex == "F").ToList();
            var AvgFemaleRisk = 0;

            if (females.Count() > 0)
            {
                foreach (var female in females)
                {
                    femaleRisks.Add(female.riskScore);
                }
                var femaleRiskSum = femaleRisks.Sum();
                if (femaleRiskSum > 0)
                {
                    AvgFemaleRisk = femaleRiskSum / females.Count();
                }
            }

            return AvgFemaleRisk;
        }
        public string MessagePatients(List<string> phoneNumbers, TwilioConfiguration _twilioConfig)
        {
            var errorMessage = "";

            try
            {
                string accountSID = _twilioConfig.AccountSID;
                string authToken = _twilioConfig.AuthenticationToken;

                // Initialize the TwilioClient.
                TwilioClient.Init(accountSID, authToken);

                foreach (var number in phoneNumbers)
                {
                    var message = MessageResource.Create(
                        to: new PhoneNumber(number),
                        from: new PhoneNumber("Cov19Risk"),
                        body: "COVID-19 High Risk Alert\n\nYou have been marked as high risk for developing a severe form of COVID-19. " +
                        "This means you are eligible for a COVID-19 vaccination.\n\n Please contact your GP for more information");
                }
            }
            catch (TwilioException ex)
            {
                errorMessage += ex;
            }

            return errorMessage;

        }
    }
}
