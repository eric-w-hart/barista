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
