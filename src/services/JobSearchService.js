
// Updated: 2025-02-09 10:15:00
export class JobSearchService {
  static filterJobs(jobs, criteria) {
    return jobs.filter(j => j.salary >= criteria.minSalary);
  }
}
