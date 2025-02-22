using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class Addednewstarterdatas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "DisplayName" },
                values: new object[,]
                {
                    { 1, "fekvőbeteg" },
                    { 2, "járóbeteg" }
                });

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "DisplayName", "Note" },
                values: new object[,]
                {
                    { 1, "Makó", null },
                    { 2, "Hódmezővásárhely", null },
                    { 3, "fekvőbeteg", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
