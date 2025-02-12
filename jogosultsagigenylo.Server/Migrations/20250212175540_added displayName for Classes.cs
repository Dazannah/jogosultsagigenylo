using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class addeddisplayNameforClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "Classes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "Classes");
        }
    }
}
