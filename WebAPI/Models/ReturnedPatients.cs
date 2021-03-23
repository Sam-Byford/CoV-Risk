using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ReturnedPatients
    {
        public ReturnedPatients()
        {

        }

        public List<Patient> Patients = new List<Patient>();
        public string ErrorMessage { get; set; }
        public List<int> PatientsPerPrecondition = new List<int>();
        public List<int> MalePatientsPerPrecondition = new List<int>();
        public List<int> FemalePatientsPerPrecondition = new List<int>();
        public int? MaleAvgRiskScore { get; set; }
        public int? FemaleAvgRiskScore { get; set; }
    }
}
