using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class removedmandatoryclassNumberfromDepartmentandrenamedtodepartmentNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassNumber",
                table: "Departments");

            migrationBuilder.AddColumn<string>(
                name: "DepartmentNumber",
                table: "Departments",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentNumber",
                table: "Departments");

            migrationBuilder.AddColumn<string>(
                name: "ClassNumber",
                table: "Departments",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
