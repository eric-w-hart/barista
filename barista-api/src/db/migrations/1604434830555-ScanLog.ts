import {MigrationInterface, QueryRunner} from "typeorm";

export class ScanLog1604434830555 implements MigrationInterface {
    name = 'ScanLog1604434830555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scan_log" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "metaData" jsonb, "tag" character varying, "updated_at" TIMESTAMP DEFAULT now(), "log" text, "scanId" integer, CONSTRAINT "PK_3bf6f0e8fa1e46e7b7ccb76fa22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scan_log" ADD CONSTRAINT "FK_fb681f93959005f41323ce6339a" FOREIGN KEY ("scanId") REFERENCES "scan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scan_log" DROP CONSTRAINT "FK_fb681f93959005f41323ce6339a"`);
        await queryRunner.query(`DROP TABLE "scan_log"`);
    }

}
