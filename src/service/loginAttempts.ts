import { sequelize } from "../config/database.js";
import { LoginAttempt } from "../models/LoginAttempt.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MINUTES = 15;
const SESSION_LOCK_MINUTES = 15;

export async function isLoginLocked(
  email: string,
  ipAddress: string,
): Promise<boolean> {
  const attempt = await LoginAttempt.findOne({ where: { email, ipAddress } });

  return Boolean(
    attempt?.lockedUntil && attempt.lockedUntil.getTime() > Date.now(),
  );
}

export async function recordFailedAttempt(
  email: string,
  ipAddress: string,
): Promise<void> {
  await sequelize.query(
    `INSERT INTO \`login_attempts\`
      (\`email\`, \`ipAddress\`, \`attempts\`, \`windowStartedAt\`, \`lockedUntil\`, \`createdAt\`, \`updatedAt\`)
     VALUES
      (:email, :ipAddress, 1, NOW(), NULL, NOW(), NOW())
     ON DUPLICATE KEY UPDATE
      \`attempts\` = CASE
        WHEN \`windowStartedAt\` < DATE_SUB(NOW(), INTERVAL ${LOGIN_WINDOW_MINUTES} MINUTE) THEN 1
        ELSE \`attempts\` + 1
      END,
      \`lockedUntil\` = CASE
        WHEN \`windowStartedAt\` < DATE_SUB(NOW(), INTERVAL ${LOGIN_WINDOW_MINUTES} MINUTE) THEN NULL
        WHEN \`attempts\` >= ${MAX_LOGIN_ATTEMPTS}
          THEN DATE_ADD(NOW(), INTERVAL ${SESSION_LOCK_MINUTES} MINUTE)
        WHEN \`lockedUntil\` <= NOW() THEN NULL
        ELSE \`lockedUntil\`
      END,
      \`windowStartedAt\` = CASE
        WHEN \`windowStartedAt\` < DATE_SUB(NOW(), INTERVAL ${LOGIN_WINDOW_MINUTES} MINUTE) THEN NOW()
        ELSE \`windowStartedAt\`
      END,
      \`updatedAt\` = NOW()`,
    { replacements: { email, ipAddress } },
  );
}
