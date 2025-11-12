import { ProfileResponse, BalanceResult } from './types';
import { formatDate, calculateNextReset, getDaysUntil } from './utils';

export function calculateSubscriptionBalance(profile: ProfileResponse): BalanceResult {
    const {
        subscription_balance,
        pay_as_you_go_balance,
        current_week_spend,
        subscription_plan,
        balance_preference,
        last_week_reset,
        subscription_expiry
    } = profile;

    if (!subscription_plan || !subscription_expiry) {
        throw new Error('Subscription data is missing');
    }

    const nextReset = calculateNextReset(last_week_reset);
    const resetDate = new Date(last_week_reset);
    resetDate.setDate(resetDate.getDate() + 7);
    const resetRelative = getDaysUntil(resetDate.toISOString());
    const expiryDate = formatDate(subscription_expiry);
    const expiryRelative = getDaysUntil(subscription_expiry);

    const dailyBalance = subscription_plan.daily_balance;
    const weeklyLimit = subscription_plan.weekly_limit;

    const dailyUsed = Math.max(0, dailyBalance - subscription_balance);
    const weeklyUsed = Math.max(0, current_week_spend);

    const dailyPercentage = dailyBalance === 0
        ? 0
        : Math.min(100, (dailyUsed / dailyBalance) * 100);
    const weeklyPercentage = weeklyLimit === 0
        ? 0
        : Math.min(100, (weeklyUsed / weeklyLimit) * 100);
    const isCriticalDaily = dailyPercentage >= weeklyPercentage;

    const tooltip = [
        `Subscription Mode`,
        `Plan: ${subscription_plan.name}`,
        `Daily: $${dailyUsed.toFixed(2)} / $${dailyBalance.toFixed(2)} (${dailyPercentage.toFixed(1)}%)`,
        `Weekly: $${weeklyUsed.toFixed(2)} / $${weeklyLimit.toFixed(2)} (${weeklyPercentage.toFixed(1)}%)`,
        `Reset: ${nextReset} (${resetRelative})`,
        `Expiry: ${expiryDate} (${expiryRelative})`,
        ``,
        'Click to open menu'
    ].join('\n');

    if (isCriticalDaily) {
        return {
            type: 'daily',
            percentage: dailyPercentage,
            displayText: `YesCode Subs: ${dailyPercentage.toFixed(0)}%`,
            tooltip
        };
    } else {
        return {
            type: 'weekly',
            percentage: weeklyPercentage,
            displayText: `YesCode Subs: ${weeklyPercentage.toFixed(0)}%`,
            tooltip
        };
    }
}
