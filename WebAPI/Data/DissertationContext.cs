using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace WebAPI.Data
{
    public partial class DissertationContext : DbContext
    {
        public DissertationContext()
        {
        }

        public DissertationContext(DbContextOptions<DissertationContext> options)
            : base(options)
        {
        }

        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;

        public DissertationContext(IConfiguration configuration, IHostingEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }


        public virtual DbSet<Patients> Patients { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                if (_env.IsDevelopment())
                {
                    optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DissertationLocalDB"));
                }
                else
                {
                    optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DissertationLiveDB"));
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patients>(entity =>
            {
                entity.Property(e => e.PatientId).ValueGeneratedNever();
            });
        }
    }
}
