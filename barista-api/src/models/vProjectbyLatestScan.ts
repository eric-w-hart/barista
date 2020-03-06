import { ViewColumn, ViewEntity } from 'typeorm';
@ViewEntity({
  expression: `
        SELECT DISTINCT ON (s2."projectId") s2.id AS scanId,
            s2."projectId" as projectId,
            p2.development_type_code as developmentTypeCode
        FROM scan s2, project p2
        where p2.id = s2."projectId" and lower(p2.development_type_code) = 'organization'
        ORDER BY s2."projectId", s2.completed_at DESC;
    `,
})
export class ProjectsByLatestScan {
  @ViewColumn()
  developmentTypeCode: string;

  @ViewColumn()
  projectId: string;

  @ViewColumn()
  scanid: number;
}
