import unittest
from fastapi.testclient import TestClient
from main import app

class TestAIService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "UP")
        self.assertIn("capabilities", data)

    def test_analyze_requirement_food_delivery(self):
        payload = {
            "requirement_text": "Build an online food delivery application with login, restaurant search, cart and payment.",
            "project_name": "Food Delivery Demo"
        }
        response = self.client.post("/api/ai/analyze-requirement", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertGreaterEqual(len(data["epics"]), 3)
        self.assertGreaterEqual(data["total_stories"], 4)

    def test_repo_intelligence(self):
        payload = {
            "query": "Which files would be affected if I change the payment service?"
        }
        response = self.client.post("/api/ai/repo-intelligence", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data["affected_files"]), 0)

    def test_security_scan_detects_sqli_and_secret(self):
        payload = {
            "code_snippet": 'String query = "SELECT * FROM users WHERE name = " + userInput; String token = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";'
        }
        response = self.client.post("/api/ai/security-scan", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["critical_count"], 2)
        self.assertFalse(data["is_deployable"])

    def test_trust_score_calculation_safe(self):
        payload = {
            "unit_tests_passed": 24,
            "unit_tests_total": 24,
            "integration_tests_passed": 4,
            "integration_tests_total": 4,
            "critical_vulnerabilities": 0,
            "high_vulnerabilities": 0,
            "medium_vulnerabilities": 1,
            "secrets_detected": 0,
            "requirement_coverage_pct": 92.0
        }
        response = self.client.post("/api/ai/trust-score", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["overall_score"], 80)
        self.assertIn(data["verdict"], ["SAFE TO REVIEW", "REQUIRES APPROVAL"])
        self.assertTrue(data["is_safe_to_deploy"])

    def test_trust_score_blocks_on_critical_security(self):
        payload = {
            "unit_tests_passed": 24,
            "unit_tests_total": 24,
            "integration_tests_passed": 4,
            "integration_tests_total": 4,
            "critical_vulnerabilities": 1,
            "high_vulnerabilities": 0,
            "medium_vulnerabilities": 0,
            "secrets_detected": 0,
            "requirement_coverage_pct": 95.0
        }
        response = self.client.post("/api/ai/trust-score", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertLessEqual(data["overall_score"], 30)
        self.assertIn("BLOCKED", data["verdict"])
        self.assertFalse(data["is_safe_to_deploy"])

if __name__ == "__main__":
    unittest.main()
