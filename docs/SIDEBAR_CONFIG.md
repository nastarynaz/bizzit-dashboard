# Sidebar Visibility Configuration

## File Location
`lib/sidebar-visibility-config.js`

## How to Use

The sidebar visibility configuration allows you to easily show or hide menu items in the dashboard sidebar by editing a single file.

### Configuration Structure

Each sidebar item has the following properties:
- `name`: Display name of the menu item
- `visible`: Boolean value (`true` to show, `false` to hide)
- `description`: Description of what the page does

### Available Sidebar Items

1. **overview** - Main dashboard page (`/`)
2. **forecasting** - Sales forecasting page (`/forecasting`)
3. **promotions** - Promotion management page (`/promotions`)
4. **stock** - Stock management page (`/stock`)
5. **posIntegration** - POS integrations page (`/pos-integration`)
6. **apiTest** - External API test page (`/api-test-external`)
7. **chatbot** - Chatbot management page (`/chatbot`)

### Examples

#### To hide the Chatbot menu item:
```javascript
chatbot: {
  name: "Chatbot",
  visible: false,  // Change this to false
  description: "Customer service chatbot management"
}
```

#### To hide multiple items (e.g., hide Forecasting and API Test):
```javascript
forecasting: {
  name: "Forecasting", 
  visible: false,  // Hidden
  description: "Sales and demand forecasting tools"
},

apiTest: {
  name: "External API Test",
  visible: false,  // Hidden
  description: "API testing and debugging tools"
}
```

#### To show all items:
Set all `visible` properties to `true`.

### Quick Setup Examples

#### Minimal Dashboard (only Overview and Stock):
```javascript
overview: { name: "Overview", visible: true, description: "..." },
forecasting: { name: "Forecasting", visible: false, description: "..." },
promotions: { name: "Promotion Management", visible: false, description: "..." },
stock: { name: "Stock Management", visible: true, description: "..." },
posIntegration: { name: "POS Integrations", visible: false, description: "..." },
apiTest: { name: "External API Test", visible: false, description: "..." },
chatbot: { name: "Chatbot", visible: false, description: "..." }
```

#### Production Dashboard (hide development tools):
```javascript
// Show all main features
overview: { name: "Overview", visible: true, description: "..." },
forecasting: { name: "Forecasting", visible: true, description: "..." },
promotions: { name: "Promotion Management", visible: true, description: "..." },
stock: { name: "Stock Management", visible: true, description: "..." },
posIntegration: { name: "POS Integrations", visible: true, description: "..." },

// Hide development/testing tools
apiTest: { name: "External API Test", visible: false, description: "..." },
chatbot: { name: "Chatbot", visible: false, description: "..." }
```

### How It Works

1. Edit the `lib/sidebar-visibility-config.js` file
2. Change `visible: true` to `visible: false` for items you want to hide
3. Save the file
4. The sidebar will automatically update to show/hide the configured items
5. No server restart needed - changes apply immediately

### Notes

- Hidden menu items are completely removed from the sidebar
- Users cannot access hidden pages through the sidebar navigation
- The actual page files remain accessible if users navigate directly to the URL
- This is a frontend-only solution for controlling sidebar visibility
