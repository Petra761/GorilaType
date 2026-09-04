using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GorilaType.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    username = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false
                    ),
                    email = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    password_hash = table.Column<string>(
                        type: "text",
                        nullable: true
                    ),
                    profile_picture_url = table.Column<string>(
                        type: "text",
                        nullable: true
                    ),
                    created_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                    updated_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                    last_login = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: true
                    ),
                    deleted_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: true
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "friendships",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    requester_id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false
                    ),
                    addressee_id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false
                    ),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    created_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                    updated_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_friendships", x => x.id);
                    table.ForeignKey(
                        name: "FK_friendships_users_addressee_id",
                        column: x => x.addressee_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "FK_friendships_users_requester_id",
                        column: x => x.requester_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "leaderboard_daily",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    language = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    duration = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    wpm = table.Column<int>(type: "integer", nullable: false),
                    accuracy = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    raw_wpm = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    consistency = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    test_date = table.Column<DateOnly>(
                        type: "date",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leaderboard_daily", x => x.id);
                    table.ForeignKey(
                        name: "FK_leaderboard_daily_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "leaderboard_global",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    duration = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    language = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    best_wpm = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    accuracy = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    raw_wpm = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    consistency = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    achieved_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leaderboard_global", x => x.id);
                    table.ForeignKey(
                        name: "FK_leaderboard_global_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "oauth_accounts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false
                    ),
                    provider_user_id = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    created_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_oauth_accounts", x => x.id);
                    table.ForeignKey(
                        name: "FK_oauth_accounts_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "tests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    test_type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    duration = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    language = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    wpm = table.Column<int>(type: "integer", nullable: false),
                    accuracy = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    raw_wpm = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    consistency = table.Column<double>(
                        type: "double precision",
                        nullable: false
                    ),
                    correct_chars = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    incorrect_chars = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    extra_chars = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    missed_chars = table.Column<int>(
                        type: "integer",
                        nullable: false
                    ),
                    created_at = table.Column<DateTime>(
                        type: "timestamptz",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tests", x => x.id);
                    table.ForeignKey(
                        name: "FK_tests_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_friendships_addressee_id",
                table: "friendships",
                column: "addressee_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_friendships_requester_id_addressee_id",
                table: "friendships",
                columns: new[] { "requester_id", "addressee_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_leaderboard_daily_user_id_duration_language_test_date",
                table: "leaderboard_daily",
                columns: new[]
                {
                    "user_id",
                    "duration",
                    "language",
                    "test_date",
                },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_leaderboard_global_user_id_duration_language",
                table: "leaderboard_global",
                columns: new[] { "user_id", "duration", "language" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_oauth_accounts_provider_provider_user_id",
                table: "oauth_accounts",
                columns: new[] { "provider", "provider_user_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_oauth_accounts_user_id",
                table: "oauth_accounts",
                column: "user_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_tests_test_type",
                table: "tests",
                column: "test_type"
            );

            migrationBuilder.CreateIndex(
                name: "IX_tests_user_id",
                table: "tests",
                column: "user_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "friendships");

            migrationBuilder.DropTable(name: "leaderboard_daily");

            migrationBuilder.DropTable(name: "leaderboard_global");

            migrationBuilder.DropTable(name: "oauth_accounts");

            migrationBuilder.DropTable(name: "tests");

            migrationBuilder.DropTable(name: "users");
        }
    }
}
