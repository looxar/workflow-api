import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAmountColumnType1729879732520 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "item"
            ALTER COLUMN amount TYPE NUMERIC(10, 4);
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "item"
            ALTER COLUMN amount TYPE INTEGER;
          `);
    }

}
