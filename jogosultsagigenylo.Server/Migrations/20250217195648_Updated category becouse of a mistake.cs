using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jogosultsagigenylo.Server.Migrations
{
    /// <inheritdoc />
    public partial class Updatedcategorybecouseofamistake : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthItems_Categories_CategoryId",
                table: "AuthItems");

            migrationBuilder.DropIndex(
                name: "IX_AuthItems_CategoryId",
                table: "AuthItems");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "AuthItems");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Departments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_CategoryId",
                table: "Departments",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Categories_CategoryId",
                table: "Departments",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Categories_CategoryId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_CategoryId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Departments");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Departments",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "AuthItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AuthItems_CategoryId",
                table: "AuthItems",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthItems_Categories_CategoryId",
                table: "AuthItems",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
