import {MigrationInterface, QueryRunner} from "typeorm";

export class vProjectbyLatestScan1582565019642 implements MigrationInterface {
    name = 'vProjectbyLatestScan1582565019642'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE VIEW "projects_by_latest_scan" AS 
        SELECT DISTINCT ON (s2."projectId") s2.id AS scanId,
            s2."projectId" as projectId,
            p2.development_type_code as developmentTypeCode
        FROM scan s2, project p2
        where p2.id = s2."projectId" and lower(p2.development_type_code) = 'organization'
        ORDER BY s2."projectId", s2.completed_at DESC;
    `, undefined);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","projects_by_latest_scan","SELECT DISTINCT ON (s2.\"projectId\") s2.id AS scanId,\n            s2.\"projectId\" as projectId,\n            p2.development_type_code as developmentTypeCode\n        FROM scan s2, project p2\n        where p2.id = s2.\"projectId\" and lower(p2.development_type_code) = 'organization'\n        ORDER BY s2.\"projectId\", s2.completed_at DESC;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","projects_by_latest_scan"]);
        await queryRunner.query(`DROP VIEW "projects_by_latest_scan"`, undefined);
    }

}
