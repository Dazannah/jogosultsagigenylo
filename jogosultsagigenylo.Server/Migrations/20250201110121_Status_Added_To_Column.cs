using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class Status_Added_To_Column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "Columns",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Columns_StatusId",
                table: "Columns",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Columns_Status_StatusId",
                table: "Columns",
                column: "StatusId",
                principalTable: "Status",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Columns_Status_StatusId",
                table: "Columns");

            migrationBuilder.DropIndex(
                name: "IX_Columns_StatusId",
                table: "Columns");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "Columns");
        }
    }
}
