import {MigrationInterface, QueryRunner} from "typeorm";

export class ClearlyDefined1598451633613 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "clearly_defined" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "metaData" jsonb, "tag" character varying, "updated_at" TIMESTAMP DEFAULT now(), "copyrights" character varying, "indentifier" character varying NOT NULL, "license" character varying, "licensetext" character varying, "name" character varying, "uuid" character varying, "version" character varying, "website" character varying, CONSTRAINT "PK_6e509addc590d35154106dc1200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99d1735db2c4104d1e63aa8985" ON "clearly_defined" ("indentifier") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_99d1735db2c4104d1e63aa8985"`);
        await queryRunner.query(`DROP TABLE "clearly_defined"`);
    }

}
