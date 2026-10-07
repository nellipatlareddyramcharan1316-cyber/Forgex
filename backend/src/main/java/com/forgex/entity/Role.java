package com.forgex.entity;

public enum Role {
    ROLE_ADMIN,
    ROLE_PROJECT_MANAGER,
    ROLE_DEVELOPER,
    ROLE_VIEWER;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return ROLE_DEVELOPER;
        String normalized = roleStr.toUpperCase().trim();
        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }
        for (Role r : values()) {
            if (r.name().equals(normalized)) {
                return r;
            }
        }
        return ROLE_DEVELOPER;
    }
}
