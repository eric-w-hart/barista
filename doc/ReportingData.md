# Reporting Queries

- Projects converted by development type

```sql
select "development_type_code", COUNT(*) from project p
where "wasImported"
group by "development_type_code"
```

- Community Projects

```sql
select "name" ,id , created_at , updated_at, "wasImported" from project p
where development_type_code = 'community'
order by "name"
```

- Projects with scans

```sql
select "name", id , deployment_type_code, package_manager_code , git_url, created_at , updated_at from project p3
where id in (
select distinct on (s2."projectId" )
s2."projectId"
from scan s2,
project p2
where p2.id = s2."projectId" and p2.development_type_code = 'organization'
order by s2."projectId" , s2.completed_at desc)
order by p3."name"
```

- Projects added by weekly/monthly

```sql
SELECT date_trunc('week', p2.created_at::date)::date AS weekly,
       COUNT(*)
FROM project p2
GROUP BY weekly
ORDER BY weekly;

SELECT date_trunc('month', p2.created_at::date)::date AS monthly,
       COUNT(*)
FROM project p2
GROUP BY monthly
ORDER BY monthly;
```

- Scans by weekly/monthly

```sql
SELECT date_trunc('week', ssr.created_at::date)::date AS weekly,
       COUNT(*)
FROM security_scan_result ssr
GROUP BY weekly
ORDER BY weekly;

SELECT date_trunc('month', ssr.created_at::date)::date AS monthly,
       COUNT(*)
FROM security_scan_result ssr
GROUP BY monthly
ORDER BY monthly;
```

- License counts for approved components without community projects

```sql
select  l2.name, count(*)
from license l2,
license_scan_result_item lsri ,
license_scan_result lsr,
(select distinct on (s2."projectId" )
s2.id,
s2."projectId"
from scan s2,
project p2
where p2.id = s2."projectId" and p2.development_type_code = 'organization'
order by s2."projectId" , s2.completed_at desc ) scan
where scan.id = lsr."scanId" and lsri."licenseScanId" = lsr.id and l2.id = lsri."licenseId"
group by l2.name
order by count(*)
```

- Vulnerablities by package/severity

```sql
select p2.deployment_type_code , ssri."path" as "package" ,Upper(ssri.severity) as severity , ssri."displayIdentifier" ,ssri.description ,count(*)
from
project p2 ,
security_scan_result_item ssri ,
security_scan_result ssr ,
(select distinct on (s2."projectId" )
s2.id,
s2."projectId"
from scan s2
order by s2."projectId" , s2.completed_at desc) scan
where ssr."scanId" = scan.id and ssri."securityScanId" = ssr."scanId" and scan."projectId" = p2.id
group by p2.deployment_type_code , ssri."path"  ,Upper(ssri.severity) ,ssri."displayIdentifier" ,ssri.description
order by count(*),Upper(ssri.severity), package
```
