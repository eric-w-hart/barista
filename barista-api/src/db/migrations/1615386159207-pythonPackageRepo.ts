import {MigrationInterface, QueryRunner} from "typeorm";

export class pythonPackageRepo1615386159207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "system_configuration" ADD "python_packaage_repo" character varying DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "system_configuration" DROP COLUMN "python_packaage_repo"`);
    }

}
