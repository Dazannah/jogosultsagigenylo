using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ApplicationDbContext>(option => {
	option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

//Interfaces and concrete types registrations
builder.Services.AddScoped<IAuthItem, AuthItemService>();
builder.Services.AddScoped<IColumn, ColumnService>();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if(app.Environment.IsDevelopment()) {
	app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
