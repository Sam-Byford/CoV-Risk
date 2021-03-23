using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebAPI.Data;
using WebAPI.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Models;

namespace WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        public IConfiguration _configuration { get; }
        private readonly IHostingEnvironment _env;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Inject AppSettings
            services.Configure<ApplicationSettings>(_configuration.GetSection("ApplicationSettings"));

            services.Configure<TwilioConfiguration>(_configuration.GetSection("TwilioConfiguration"));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            //JWT
            var key = Encoding.UTF8.GetBytes(_configuration["ApplicationSettings:JWT_Secret"].ToString());

            services.AddAuthentication(x => 
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x => 
            {
                x.RequireHttpsMetadata = false; // may cause issue in live as that uses HTTPS?
                x.SaveToken = false;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // Development and Production settings
            if (_env.IsDevelopment())
            {
                services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                });

                //Kestral Dev Server setup
                services.Configure<KestrelServerOptions>(options =>
                {
                    options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
                });

                //Local Dev Database
                services.AddDbContext<DissertationContext>(options =>
                options.UseSqlServer(_configuration.GetConnectionString("DissertationLocalDB")));

                // Authentication
                services.AddDbContext<AuthenticationContext>(options =>
                options.UseSqlServer(_configuration.GetConnectionString("DissertationLocalDB")));

                services.AddDefaultIdentity<ApplicationUser>()
                    .AddEntityFrameworkStores<AuthenticationContext>();

                services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredLength = 4;
                });

                //Root to angular files
                services.AddSpaStaticFiles(configuration =>
                {
                    configuration.RootPath = "project-website/dist";
                });
            }
            else
            {
                services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder.WithOrigins(_configuration["ApplicationSettings:ClientURL"].ToString())
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                });

                services.AddSpaStaticFiles(configuration =>
                {
                    configuration.RootPath = "project-website/dist/project-website";
                });
                services.AddDbContext<DissertationContext>(options =>
                options.UseSqlServer(_configuration.GetConnectionString("DissertationLiveDB")));

                services.AddDbContext<AuthenticationContext>(options =>
                options.UseSqlServer(_configuration.GetConnectionString("DissertationLiveDB")));

                services.AddDefaultIdentity<ApplicationUser>()
                    .AddEntityFrameworkStores<AuthenticationContext>();

                services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredLength = 4;
                });
            }

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseAuthentication();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "project-website";

                if (env.IsDevelopment())
                {
                    // The below code allows for building of API and angular in one, simple but slow
                    spa.Options.StartupTimeout = new TimeSpan(0, 0, 120);
                    spa.UseAngularCliServer(npmScript: "start");
                    // alternative is the code below. It runs JUST the angular (effectivley ng serve)...
                    //...then to run API also have to navigate to angular app using 'CD ProjectApp' and run 'npm start'...
                    //...it compiles and runs quicker but is more faff
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
