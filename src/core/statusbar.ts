import * as vscode from 'vscode';
import { fetchBalance } from '../api';
import { calculateBalance, DisplayMode } from '../monitor/balance';

let statusBarItem: vscode.StatusBarItem;
let refreshTimer: NodeJS.Timeout | undefined;
let currentDisplayMode: DisplayMode = 'auto';

export function createStatusBar(context: vscode.ExtensionContext): vscode.StatusBarItem {
    // Load saved display mode
    currentDisplayMode = context.globalState.get<DisplayMode>('displayMode', 'auto');

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'yescode.showMenu';
    statusBarItem.text = 'YesCode: Loading...';
    statusBarItem.show();

    return statusBarItem;
}

export function startAutoRefresh(context: vscode.ExtensionContext): void {
    // Initial balance update
    updateStatusBar(context, false);

    // Set up automatic refresh every 1 minute
    refreshTimer = setInterval(() => {
        console.log('Automatic refresh triggered...');
        updateStatusBar(context, true); // Automatic refresh
    }, 1 * 60 * 1000); // 1 minute in milliseconds
}

export function stopAutoRefresh(): void {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = undefined;
    }
}

export async function updateStatusBar(context: vscode.ExtensionContext, isAutoRefresh: boolean): Promise<void> {
    try {
        if (!isAutoRefresh) {
            statusBarItem.text = `$(sync~spin) YesCode...`;
        }

        const data = await fetchBalance(context);

        if (!data) {
            statusBarItem.text = 'YesCode: Error';
            statusBarItem.tooltip = 'Failed to fetch balance. Click to retry.';
            return;
        }

        const result = calculateBalance(data, currentDisplayMode);

        statusBarItem.text = result.displayText;
        statusBarItem.tooltip = result.tooltip;

        if (result.type !== 'payGo') {
            if (result.percentage < 10) {
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            } else {
                statusBarItem.backgroundColor = undefined;
            }
        } else {
            if (result.percentage < 5) {
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            } else {
                statusBarItem.backgroundColor = undefined;
            }
        }
        if (!isAutoRefresh) {
            console.log('Balance updated successfully:', result.displayText);
        }

    } catch (error) {
        console.error('Error updating balance:', error);
        statusBarItem.text = 'YesCode: Error';
        statusBarItem.tooltip = 'An unexpected error occurred. Click to retry.';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
}

export function setDisplayMode(mode: DisplayMode): void {
    currentDisplayMode = mode;
}

export function getDisplayMode(): DisplayMode {
    return currentDisplayMode;
}

export function getRefreshTimer(): NodeJS.Timeout | undefined {
    return refreshTimer;
}
