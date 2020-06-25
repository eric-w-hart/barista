import {MigrationInterface, QueryRunner} from "typeorm";

/**
 * Migration needed to make changes to ID element for use outside Optum.
 * Shift from using AskID to ProjectID, also updates the content.
 */
export class ProjectIDMigration1593094810331 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "UPDATE tool_tip SET content='Input your ProjectID', element_name='projectID' WHERE element_name='askID'"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "UPDATE tool_tip SET content='Input your askID', element_name='askID' WHERE element_name='projectID'"
        );
    }

}