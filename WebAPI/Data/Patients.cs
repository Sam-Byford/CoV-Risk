using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data
{
    public partial class Patients
    {
        [Key]
        [Column("PatientID")]
        [StringLength(255)]
        public string PatientId { get; set; }
        [Required]
        [StringLength(1)]
        public string Sex { get; set; }
        public int Age { get; set; }
        [StringLength(255)]
        public string Preconditions { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime Uploaded { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? Modified { get; set; }
        public int RiskScore { get; set; }
        [StringLength(25)]
        public string PhoneNumber { get; set; }
        public int? PreviousRiskScore { get; set; }
    }
}
