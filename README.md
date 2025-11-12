# YesCoder

**Official Website:** [https://co.yes.vg](https://co.yes.vg)

Your essential companion for YesCode in VS Code. Monitor your balance and manage providers seamlessly from the status bar.

## Features

-   **Balance Monitoring:** Keep an eye on your most critical balance (Team, Subscription, or PayGo) directly in the status bar.
-   **Provider Management:** Switch your default and alternative providers for both your user account and your team account without ever leaving the editor.
-   **Centralized Command Menu:** A single click on the status bar opens a menu with all core extension commands.
-   **Smart Display Modes:** Automatically detects the most relevant balance to display, with a manual override to lock it to a specific mode (Team, Subscription, or PayGo).
-   **Detailed Tooltips:** Hover over the status bar for a mini-dashboard with a full breakdown of your current balance.
-   **Secure API Key Storage:** Uses VS Code's native `SecretStorage` to keep your API key safe.
-   **Automatic Refresh:** Keeps your balance up-to-date by automatically refreshing every minute.

## Setup

1.  Install the extension from the VS Code Marketplace.
2.  Click the "YesCode: Loading..." item in the status bar to open the menu.
3.  Select `Set API Key` and enter your YesCode API key when prompted.
4.  Your balance and provider management features are now active.

## Commands

-   **`YesCode: Show Menu`**: Opens the main command menu from the status bar.
-   **`YesCode: Refresh Balance`**: Manually refreshes your balance information.
-   **`YesCode: Switch Display Mode`**: Manually selects which balance to display.
-   **`YesCode: Switch Vendor`**: Opens the provider management interface.
-   **`YesCode: Set API Key`**: Stores your API key securely.

## Project Architecture

This extension is built with a clean, feature-driven architecture:

-   `src/extension.ts`: The main activation file that orchestrates the different features.
-   `src/core/`: Contains the core logic for command registration and status bar creation.
-   `src/monitor/`: All logic for the balance monitoring feature.
-   `src/providers/`: All logic for the provider management feature.
-   `src/api.ts`: Manages all API calls to YesCode.
-   `src/types.ts`: Defines all shared data structures.

## Acknowledgements

Special thanks to **好果汁**, the CFO of YesCode, for providing invaluable testing, support, and guidance.

## Development

```bash
# Clone the repository
git clone https://github.com/simplelumine/yescode-statusbar.git
cd yescode-statusbar

# Install dependencies
npm install

# Compile and watch for changes
npm run watch

# Open in VS Code and press F5 to launch the Extension Development Host.
```

## License

[MIT](./LICENSE.md)