import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Show a one-time notification
    const message = "The 'YesCode StatusBar' extension is deprecated. Please uninstall it and install the new 'YesCoder' extension for the latest features.";
    const installButton = 'Install YesCoder';

    vscode.window.showWarningMessage(message, installButton).then(selection => {
        if (selection === installButton) {
            vscode.env.openExternal(vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=simplelumine.yescoder'));
        }
    });
}

export function deactivate() {}