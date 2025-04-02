using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedsubAuthItemstatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "SubAuthItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SubAuthItems_StatusId",
                table: "SubAuthItems",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubAuthItems_Locations_StatusId",
                table: "SubAuthItems",
                column: "StatusId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubAuthItems_Locations_StatusId",
                table: "SubAuthItems");

            migrationBuilder.DropIndex(
                name: "IX_SubAuthItems_StatusId",
                table: "SubAuthItems");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "SubAuthItems");
        }
    }
}
