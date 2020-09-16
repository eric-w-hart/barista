import {MigrationInterface, QueryRunner} from "typeorm";

export class ProjectAttribution1599235563079 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "project_attribution" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "metaData" jsonb, "tag" character varying, "updated_at" TIMESTAMP DEFAULT now(), "attribution" text NOT NULL DEFAULT '', "projectId" integer, CONSTRAINT "PK_c92cc1c21c22899965fa3ea5eea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "system_configuration" ALTER COLUMN "npm_cache_directory" SET DEFAULT '/usr/src/app/tools'`);
        await queryRunner.query(`ALTER TABLE "system_configuration" ALTER COLUMN "npm_registry" SET DEFAULT 'https://registry.npmjs.org/'`);
        await queryRunner.query(`ALTER TABLE "project_attribution" ADD CONSTRAINT "FK_7efed94bf3ce57f504c6dc13c8c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_attribution" DROP CONSTRAINT "FK_7efed94bf3ce57f504c6dc13c8c"`);
        await queryRunner.query(`ALTER TABLE "system_configuration" ALTER COLUMN "npm_registry" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "system_configuration" ALTER COLUMN "npm_cache_directory" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "project_attribution"`);
    }

}
