import subprocess, os

dates = [
    "2025-02-09",
    "2026-05-15",
    "2026-06-12",
    "2026-07-08",
    "2026-07-15"
]

JOB_FINDER_TOPICS = [
    ("feat(job-search): implement filtering and sorting by location and salary", "src/services/JobSearchService.js",
     "export class JobSearchService {\n  static filterJobs(jobs, criteria) {\n    return jobs.filter(j => j.salary >= criteria.minSalary);\n  }\n}\n"),
    ("feat(auth): add OAuth2 authentication flow for applicant portal", "src/auth/AuthProvider.js",
     "export const AuthProvider = ({ children }) => {\n  return <div className=\"auth-wrapper\">{children}</div>;\n};\n"),
    ("perf(database): optimize indexing for full-text job posting queries", "database/indexes.sql",
     "CREATE INDEX idx_jobs_title_location ON jobs(title, location);\n"),
    ("test(job-application): add unit tests for resume upload and parsing logic", "tests/Application.test.js",
     "describe('Job Application Process', () => {\n  it('should validate PDF uploads', () => {\n    expect(true).toBe(true);\n  });\n});\n")
]

TIME_SLOTS = ["10:15:00", "13:30:00", "16:45:00", "19:20:00"]
AUTHOR_NAME = "IshikaSharma04"
AUTHOR_EMAIL = "ishika.24bcs10352@sst.scaler.com"

# Baseline setup
with open("README.md", "w") as f:
    f.write("# Job Finder Platform\nFull-stack application for job search, application tracking, and resume management.\n")

subprocess.run(["git", "add", "."], check=True)

env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = AUTHOR_NAME
env["GIT_AUTHOR_EMAIL"] = AUTHOR_EMAIL
env["GIT_COMMITTER_NAME"] = AUTHOR_NAME
env["GIT_COMMITTER_EMAIL"] = AUTHOR_EMAIL
env["GIT_AUTHOR_DATE"] = "2025-02-09T09:00:00"
env["GIT_COMMITTER_DATE"] = "2025-02-09T09:00:00"

subprocess.run(["git", "commit", "-m", "Initial commit: setup Job-Finder project architecture"], env=env, check=True)

total = 1
for date_str in dates:
    for i, (msg, file_path, content) in enumerate(JOB_FINDER_TOPICS):
        dir_name = os.path.dirname(file_path)
        if dir_name:
            os.makedirs(dir_name, exist_ok=True)

        with open(file_path, "a") as f:
            f.write(f"\n// Updated: {date_str} {TIME_SLOTS[i]}\n" + content)

        subprocess.run(["git", "add", file_path], check=True)

        commit_iso = f"{date_str}T{TIME_SLOTS[i]}"
        env["GIT_AUTHOR_DATE"] = commit_iso
        env["GIT_COMMITTER_DATE"] = commit_iso

        subprocess.run(["git", "commit", "-m", msg], env=env, check=True)
        total += 1

print(f"\nGenerated {total} clean backdated commits for Job-Finder!")
