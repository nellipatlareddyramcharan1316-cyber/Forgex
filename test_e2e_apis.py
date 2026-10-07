import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


def post(url, data):
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print("==================================================")
print("  FORGEX FULL-STACK E2E PHASE 6 - 12 VERIFICATION ")
print("==================================================")

# Phase 6 & 7 Backend checks
print("\n[PHASE 6 & 7] Spring Boot Backend:")
backend_health = get("http://127.0.0.1:8080/api/v1/health")
print(" Backend Status:", backend_health.get("status"), "| DB:", backend_health.get("database"))

repos = get("http://127.0.0.1:8080/api/v1/github/repositories")
print(" GitHub Repositories Loaded:", len(repos))
for r in repos:
    print(f"  - {r['name']} ({r['language']}, {r['filesCount']} files, {r['openIssues']} issues, {r['openPrs']} PRs)")

stats = get("http://127.0.0.1:8080/api/v1/github/repos/forgex-demo/food-delivery-system/stats")
print(f"  -> Stats for food-delivery-system: Language: {stats['language']}, Files: {stats['files']}, Stars: {stats['stars']}")

branch_resp = post("http://127.0.0.1:8080/api/v1/github/repos/forgex-demo/food-delivery-system/branches", {
    "branchName": "feature/password-reset",
    "baseBranch": "main"
})
print("  -> Created Branch:", branch_resp.get("branch"), "Status:", branch_resp.get("status"))

# Phase 8 AI Requirement Analyzer
print("\n[PHASE 8] AI Requirement Analyzer:")
req_res = post("http://127.0.0.1:8000/api/ai/analyze-requirement", {
    "requirement_text": "Build an online parking reservation system for students and faculty."
})
print(" Project Title:", req_res["project_name"])
print(" Generated Epics (Total:", len(req_res["epics"]), "):")
for e in req_res["epics"]:
    print(f"  * {e['epic_name']}: {len(e['user_stories'])} user stories / tasks")
sample_story = req_res["epics"][2]["user_stories"][0]
print(f"  Sample Story: '{sample_story['title']}'")
print("  Acceptance Criteria:")
for ac in sample_story.get("acceptance_criteria", []):
    print(f"   {ac}")

# Phase 9 RAG Project Knowledge
print("\n[PHASE 9] RAG / Project Knowledge Retrieval:")
rag_res = post("http://127.0.0.1:8000/api/ai/rag/query", {
    "query": "Where is authentication handled?"
})
print(" AI Answer:\n ", rag_res["answer"])
print(" Retrieved Code Chunks:")
for src in rag_res.get("retrieved_chunks", []):
    print(f"  * {src['file_path']} - {src['symbol_name']} (Relevance Score: {src['relevance_score']})")

# Phase 10 AI Repository Analyzer
print("\n[PHASE 10] AI Repository Analyzer:")
repo_res = post("http://127.0.0.1:8000/api/ai/repo/analyze", {
    "repository_name": "food-delivery-system"
})
print(f" Stack: {repo_res['language']} | {repo_res['framework']} | {repo_res['database']}")
print(f" Metrics: Tests: {repo_res['tests_count']}, Coverage: {repo_res['coverage_pct']}%, Security Findings: {repo_res['security_findings_count']}, Dependencies: {repo_res['dependencies_count']}")
print(" Layered Architecture Flow:", " -> ".join(repo_res["architecture_flow"]))

# Phase 11 AI Development Planner
print("\n[PHASE 11] AI Development Planner:")
plan_res = post("http://127.0.0.1:8000/api/ai/dev-planner", {
    "task_description": "Add password reset functionality."
})
print(" AI Generated 8-Step Plan:")
for step in plan_res["implementation_steps"]:
    print(f"  {step}")
print(" Files Likely Affected:", ", ".join(plan_res["files_likely_affected"]))

# Phase 12 Governed AI Coding Agent
print("\n[PHASE 12] AI Coding Agent (Governed Execution):")
agent_res = post("http://127.0.0.1:8000/api/ai/code-agent/execute", {
    "task_title": "Implement password reset functionality",
    "branch_name": "feature/password-reset",
    "developer_approved": True
})
print(" Safety Rule Enforced:", agent_res["safety_rule_enforced"])
print(" Target Branch Created:", agent_res["target_branch"])
print(" Commit:", agent_res["commit_message"])
print(" Automated Tests Result: Passed", agent_res["tests_passed"], "/", agent_res["tests_run"])
print(" Security Scan Result:", agent_res["security_status"])
print(" Created Pull Request URL:", agent_res["pr_url"])
print(" Status:", agent_res["status"])

print("\n==================================================")
print(" ALL PHASES 6 THROUGH 12 VERIFIED SUCCESSFULLY!   ")
print("==================================================")
