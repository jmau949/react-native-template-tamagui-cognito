#!/bin/bash

# React Native Template Setup Script
# This script helps you configure the template for your specific project

set -e  # Exit on any error

# Function to display usage
usage() {
    echo "Usage: $0 --app-name <name> --app-slug <slug> [options]"
    echo ""
    echo "Required arguments:"
    echo "  --app-name          Display name of your app"
    echo "  --app-slug          URL-friendly slug for your app"
    echo ""
    echo "Optional arguments:"
    echo "  --app-description   App description (default: 'A React Native app with Expo and Tamagui')"
    echo "  --app-emoji         App emoji (default: '📱')"
    echo "  --ios-bundle-id     iOS bundle identifier (default: 'com.yourcompany.yourapp')"
    echo "  --android-package   Android package name (default: 'com.yourcompany.yourapp')"
    echo "  --company-name      Company name (default: 'Your Company')"
    echo "  --help, -h          Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --app-name \"My Awesome App\" --app-slug \"my-awesome-app\""
    exit 1
}

# Default values
APP_NAME=""
APP_SLUG=""
APP_DESCRIPTION="A React Native app with Expo and Tamagui"
APP_EMOJI="📱"
IOS_BUNDLE_ID="com.yourcompany.yourapp"
ANDROID_PACKAGE="com.yourcompany.yourapp"
COMPANY_NAME="Your Company"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --app-name)
            APP_NAME="$2"
            shift 2
            ;;
        --app-slug)
            APP_SLUG="$2"
            shift 2
            ;;
        --app-description)
            APP_DESCRIPTION="$2"
            shift 2
            ;;
        --app-emoji)
            APP_EMOJI="$2"
            shift 2
            ;;
        --ios-bundle-id)
            IOS_BUNDLE_ID="$2"
            shift 2
            ;;
        --android-package)
            ANDROID_PACKAGE="$2"
            shift 2
            ;;
        --company-name)
            COMPANY_NAME="$2"
            shift 2
            ;;
        --help|-h)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate required arguments
if [[ -z "$APP_NAME" ]] || [[ -z "$APP_SLUG" ]]; then
    echo "Error: --app-name and --app-slug are required"
    echo ""
    usage
fi

echo "🚀 Setting up React Native Template for: $APP_NAME"
echo ""

# Update template.config.ts
echo "📝 Updating template configuration..."

cat > template.config.ts << EOF
// Template configuration file
// This file defines the placeholders and default values for the template
export const TEMPLATE_CONFIG = {
  // App Information
  APP_NAME: "$APP_NAME",
  APP_SLUG: "$APP_SLUG",
  APP_DESCRIPTION: "$APP_DESCRIPTION",
  APP_VERSION: "1.0.0",
  
  // App Icon/Branding
  APP_EMOJI: "$APP_EMOJI", // Default app emoji
  APP_COLOR: "\$blue9", // Default Tamagui color
  
  // Bundle Identifiers (you'll need to replace these)
  IOS_BUNDLE_ID: "$IOS_BUNDLE_ID",
  ANDROID_PACKAGE: "$ANDROID_PACKAGE",
  
  // Company Info
  COMPANY_NAME: "$COMPANY_NAME",
  
  // EAS Project (you'll need to run eas build:configure)
  EAS_PROJECT_ID: "your-eas-project-id",
  
  // Git Repository
  REPO_URL: "https://github.com/yourusername/your-repo",
} as const;

// Export individual values for easier imports
export const {
  APP_NAME,
  APP_SLUG,
  APP_DESCRIPTION,
  APP_VERSION,
  APP_EMOJI,
  APP_COLOR,
  IOS_BUNDLE_ID,
  ANDROID_PACKAGE,
  COMPANY_NAME,
  EAS_PROJECT_ID,
  REPO_URL,
} = TEMPLATE_CONFIG;
EOF

echo "✅ Updated template.config.ts"

# Update app.json
echo "📝 Updating app.json..."

# Check if jq is available for JSON manipulation
if command -v jq &> /dev/null; then
    # Use jq for clean JSON manipulation
    jq --arg name "$APP_NAME" \
       --arg slug "$APP_SLUG" \
       --arg bundleId "$IOS_BUNDLE_ID" \
       '.expo.name = $name | .expo.slug = $slug | .expo.ios.bundleIdentifier = $bundleId' \
       app.json > app.json.tmp && mv app.json.tmp app.json
else
    # Fallback to sed if jq is not available
    echo "Warning: jq not found, using sed for JSON updates (less reliable)"
    sed -i.bak "s/\"name\": \"[^\"]*\"/\"name\": \"$APP_NAME\"/" app.json
    sed -i.bak "s/\"slug\": \"[^\"]*\"/\"slug\": \"$APP_SLUG\"/" app.json
    sed -i.bak "s/\"bundleIdentifier\": \"[^\"]*\"/\"bundleIdentifier\": \"$IOS_BUNDLE_ID\"/" app.json
    rm -f app.json.bak
fi

echo "✅ Updated app.json"

# Update package.json
echo "📝 Updating package.json..."

if command -v jq &> /dev/null; then
    # Use jq for clean JSON manipulation
    jq --arg name "$APP_SLUG" \
       --arg description "$APP_DESCRIPTION" \
       '.name = $name | .description = $description' \
       package.json > package.json.tmp && mv package.json.tmp package.json
else
    # Fallback to sed if jq is not available
    sed -i.bak "s/\"name\": \"[^\"]*\"/\"name\": \"$APP_SLUG\"/" package.json
    sed -i.bak "s/\"description\": \"[^\"]*\"/\"description\": \"$APP_DESCRIPTION\"/" package.json
    rm -f package.json.bak
fi

echo "✅ Updated package.json"

echo ""
echo "🎉 Template setup complete!"
echo ""
echo "Next steps:"
echo "1. 📱 Replace app icons in the assets/ folder"
echo "2. 🏗️  Run 'eas build:configure' to set up EAS builds"
echo "3. 🚀 Start developing: 'npm start'"
echo ""
echo "Happy coding! 🚀" 