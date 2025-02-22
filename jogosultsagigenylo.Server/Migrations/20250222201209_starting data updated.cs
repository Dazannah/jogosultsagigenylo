using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class startingdataupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 3,
                column: "DisplayName",
                value: "Kakasszék");

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "DisplayName", "Note" },
                values: new object[,]
                {
                    { 4, "Központ", null },
                    { 5, "Egyéb", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.UpdateData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: 3,
                column: "DisplayName",
                value: "fekvőbeteg");
        }
    }
}
