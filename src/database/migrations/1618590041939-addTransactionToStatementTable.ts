import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addTransactionToStatementTable1618590041939
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfer_sender", "transfer_receiver"],
      })
    );

    await queryRunner.addColumns("statements", [
      new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      }),
      new TableColumn({
        name: "receiver_id",
        type: "uuid",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw"],
      })
    );
    await queryRunner.dropColumn("statements", "sender_id");
    await queryRunner.dropColumn("statements", "receiver_id");
  }
}
