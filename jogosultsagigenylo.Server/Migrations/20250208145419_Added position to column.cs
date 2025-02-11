using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class Addedpositiontocolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "Columns",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "Columns");
        }
    }
}
