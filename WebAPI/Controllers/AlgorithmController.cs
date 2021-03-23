using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Logic;
using System.IO;
using WebAPI.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Collections.Generic;
using Microsoft.Extensions.Options;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmController : ControllerBase
    {
        private static AlgorithmLogic _algorithm;
        private static DataLogic _data;
        private static OtherLogic _other;
        private readonly TwilioConfiguration _twilioConfig;

        public AlgorithmController(IConfiguration configuration, IHostingEnvironment env, IOptions<TwilioConfiguration> twilioConfig)
        {
            var context = new DissertationContext(configuration, env);
            _algorithm = new AlgorithmLogic();
            _data = new DataLogic(context);
            _other = new OtherLogic();
            _twilioConfig = twilioConfig.Value;
        }

        // GET: api/Algorithm
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("GetPatients")]
        public ReturnedPatients GetPatients()
        {
            var patients = _data.GetPatients();
            if (patients.ErrorMessage == "" || patients.ErrorMessage == null)
            {
                var returnedLists = _other.CalculatePatientPerPrecondition(patients.Patients);
                patients.PatientsPerPrecondition = returnedLists[0];
                patients.FemalePatientsPerPrecondition = returnedLists[1];
                patients.MalePatientsPerPrecondition = returnedLists[2];

                patients.FemaleAvgRiskScore = _other.CalculateFemaleRiskScoreAvg(patients.Patients);
                patients.MaleAvgRiskScore = _other.CalculateMaleRiskScoreAvg(patients.Patients);
            }
            return patients;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("Download")]
        public async Task<IActionResult> Download()
        {
            var fileName = "TemplateFile.csv";
            var filePath = "./Templates/TemplateFile.csv";
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, "text/csv", fileName);
        }

        // POST: api/Algorithm
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("UploadPatients")]
        public ReturnedPatients UploadPatients(IFormFile file)
        {
            var feilds = _algorithm.ExtractPatients(file);
            var response = _algorithm.ValidateFile(feilds);
            if (response.ErrorMessage == "")
            {
                response.ErrorMessage = _data.UploadPatients(response.Patients);
            }
            return response;
        }

        // POST: api/Algorithm
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("MessagePatients")]
        public List<string> MessagePatients([FromBody] List<Patient> patients)
        {
            //var patients = patientsCollection
            List<string> phoneNumbers = _data.GetPatientsPhoneNumberByID(patients);
            string response = _other.MessagePatients(phoneNumbers, _twilioConfig);

            List<string> returnList = new List<string>
            {
                response
            };

            return returnList;
        }

        // POST: api/Algorithm
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("UpdatePatient")]
        public ReturnedPatients UpdatePatient(Patient patient)
        {
            var response = _algorithm.ValidatePatientUpdate(patient);

            if (response.ErrorMessage == "") {

                patient.preconditions = _algorithm.ConvertPreconditions(patient.preconditions[0]);

                List<Patient> patientWrapper = new List<Patient>
                {
                    patient
                };

                patientWrapper = _algorithm.CalculateRisk(patientWrapper);

                var convertedPatient = _data.ConvertPatientForDB(patientWrapper[0]);

                var convertedPatientList = new List<Patients>
                {
                    convertedPatient
                };

                response.ErrorMessage = _data.UpdatePatients(convertedPatientList);

                _data.SaveChanges();
            }

            return response;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("DeletePatients")]
        public ReturnedPatients DeletePatients([FromBody] List<Patient> patients)
        {
            var response = new ReturnedPatients
            {
                ErrorMessage = _data.DeletePatients(patients)
            };

            return response;
        }
    }
}
