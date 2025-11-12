import * as vscode from 'vscode';

export interface ProviderMenuItem extends vscode.QuickPickItem {
    isTeam: boolean;
    providerId?: number;
    providerType?: string;
    providerDisplayName?: string;
}

export interface AlternativeMenuItem extends vscode.QuickPickItem {
    alternativeId?: number;
    isCurrent: boolean;
    isDefaultReset?: boolean;
}
