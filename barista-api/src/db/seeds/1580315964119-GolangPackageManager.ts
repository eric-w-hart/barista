import { getConnection, MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { PackageManager } from '../../models';

export class GolangPackageManager1580315964119 implements MigrationInterface {

  connection = getConnection('seed');

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repo: Repository<PackageManager> = this.connection.getRepository(PackageManager);

    await repo.delete({ code: 'golang-modules' });
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const packageManager = {
      description: 'Golang Modules',
      code: 'golang-modules',
      tag: this.constructor.name,
    };
    await this.connection.getRepository(PackageManager).save(packageManager);
  }

}
