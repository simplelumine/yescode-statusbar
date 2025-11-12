import { ProfileResponse, BalanceResult } from './types';
import { formatDate, calculateNextReset, getDaysUntil } from './utils';

export function calculateTeamBalance(profile: ProfileResponse): BalanceResult {
    const { current_team, team_membership } = profile;

    if (!current_team || !team_membership) {
        throw new Error('Team data is missing');
    }

    const nextReset = calculateNextReset(team_membership.last_week_reset);
    const resetDate = new Date(team_membership.last_week_reset);
    resetDate.setDate(resetDate.getDate() + 7);
    const resetRelative = getDaysUntil(resetDate.toISOString());
    const expiryDate = formatDate(team_membership.expires_at);
    const expiryRelative = getDaysUntil(team_membership.expires_at);

    const dailyBalance = current_team.per_user_daily_balance;
    const dailySpent = Math.max(0, team_membership.daily_subscription_spending);

    const weeklyLimit = current_team.weekly_limit;
    const weeklySpent = Math.max(0, team_membership.current_week_spend);

    const dailyPercentage = dailyBalance === 0
        ? 0
        : Math.min(100, (dailySpent / dailyBalance) * 100);
    const weeklyPercentage = weeklyLimit === 0
        ? 0
        : Math.min(100, (weeklySpent / weeklyLimit) * 100);

    // Display the larger percentage (more critical usage)
    const shouldShowDaily = dailyPercentage >= weeklyPercentage;

    const tooltip = [
        `Team Mode`,
        `Group: ${current_team.name}`,
        `Daily: $${dailySpent.toFixed(2)} / $${dailyBalance.toFixed(2)} (${dailyPercentage.toFixed(1)}%)`,
        `Weekly: $${weeklySpent.toFixed(2)} / $${weeklyLimit.toFixed(2)} (${weeklyPercentage.toFixed(1)}%)`,
        `Reset: ${nextReset} (${resetRelative})`,
        `Expiry: ${expiryDate} (${expiryRelative})`,
        ``,
        'Click to open menu'
    ].join('\n');

    // Return the percentage that represents higher usage (more critical)
    if (shouldShowDaily) {
        return {
            type: 'daily',
            percentage: dailyPercentage,
            displayText: `YesCode Team: ${dailyPercentage.toFixed(0)}%`,
            tooltip
        };
    } else {
        return {
            type: 'weekly',
            percentage: weeklyPercentage,
            displayText: `YesCode Team: ${weeklyPercentage.toFixed(0)}%`,
            tooltip
        };
    }
}
