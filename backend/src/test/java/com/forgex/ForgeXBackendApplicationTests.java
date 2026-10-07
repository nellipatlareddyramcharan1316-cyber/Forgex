package com.forgex;

import com.forgex.model.TrustScoreResult;
import com.forgex.service.TrustScoreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ForgeXBackendApplicationTests {

    @Autowired
    private TrustScoreService trustScoreService;

    @Test
    void contextLoads() {
        assertNotNull(trustScoreService);
    }

    @Test
    void testTrustScoreCalculation_SafeToReview() {
        TrustScoreResult result = trustScoreService.calculateScore(
                "US-TEST-101",
                24, 24, // 100% unit tests
                4, 4,   // 100% integration tests
                0, 0, 1,// 0 critical, 0 high, 1 medium
                0,      // 0 secrets
                92.0    // 92% coverage
        );

        assertNotNull(result);
        assertTrue(result.getOverallScore() >= 80);
        assertEquals("SAFE TO REVIEW", result.getVerdict());
        assertTrue(result.isSafeToDeploy());
    }

    @Test
    void testTrustScoreCalculation_BlockedOnCriticalSecurity() {
        TrustScoreResult result = trustScoreService.calculateScore(
                "US-TEST-102",
                24, 24,
                4, 4,
                1, 0, 0,// 1 Critical vulnerability!
                0,
                95.0
        );

        assertNotNull(result);
        assertTrue(result.getOverallScore() <= 30);
        assertTrue(result.getVerdict().contains("BLOCKED"));
        assertFalse(result.isSafeToDeploy());
    }
}
