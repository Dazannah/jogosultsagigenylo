using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class startingdataaddedcategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "DisplayName" },
                values: new object[] { 3, "kisegítő osztályok" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
