using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Patient
    {
        public Patient(string[] feilds)
        {
            string trimmedID = string.Concat(feilds[0].Where(c => !char.IsWhiteSpace(c)));
            id = trimmedID;
            sex = feilds[1];
            age = Int32.Parse(feilds[2]);
            var conditions = feilds[3].Trim().Split(';');
            foreach (var condition in conditions)
            {
                string trimmedCondition = string.Concat(condition.Where(c => !char.IsWhiteSpace(c)));
                if (trimmedCondition == "")
                {
                    continue;
                }
                preconditions.Add(condition.Trim().ToUpper());
            }
            if (feilds[4] == "")
            {
                phoneNumber = null;
            }
            else
            {
                phoneNumber = feilds[4].Trim();
            }
            riskScore = 0;
            highRisk = false;
            uploaded = DateTime.Now;
            rowColour = "black";
            deletePatient = false;
        }

        public Patient() {}

        public string id { get; set; }
        public string sex { get; set; }
        public int age { get; set; }
        public List<string> preconditions = new List<string>();
        public string preconditonsStr { get; set; }
        public int riskScore { get; set; }
        public bool highRisk { get; set; }
        public DateTime uploaded { get; set; }
        public DateTime? modified { get; set; }
        public string rowColour { get; set; }
        public string phoneNumber { get; set; }
        public bool deletePatient { get; set; }
    }
}
