/**
 * Sidebar Visibility Configuration
 * 
 * Contr  // 💬 Chatbot page
  chatbot: {
    name: "Chatbot",
    visible: true,  // ✅ VISIBLE - Set to false to hide
    description: "Customer service chatbot management"
  },
  
  // 🤖 AI API Testing page
  aiApiTest: {
    name: "AI API Testing",
    visible: true,  // ✅ VISIBLE - Set to false to hide
    description: "Test Gemini and OpenAI APIs with custom input"
  }ch sidebar items are visible or hidden
 * Set 'visible' to true to show the item, false to hide it
 * 
 * QUICK SETUP:
 * - To hide an item: Change 'visible: true' to 'visible: false'
 * - To show an item: Change 'visible: false' to 'visible: true'
 * - Save this file and the changes apply immediately
 */

export const sidebarVisibilityConfig = {
  // 🏠 Dashboard Overview page (Main dashboard)
  overview: {
    name: "Overview",
    visible: true,  // ✅ VISIBLE - Set to false to hide
    description: "Main dashboard with analytics and metrics"
  },
  
  // 📈 Forecasting page
  forecasting: {
    name: "Forecasting", 
    visible: false,  // ✅ VISIBLE - Set to false to hide
    description: "Sales and demand forecasting tools"
  },
  
  // 🏷️ Promotion Management page
  promotions: {
    name: "Promotion Management",
    visible: true,  // ✅ VISIBLE - Set to false to hide
    description: "Manage promotions and discounts"
  },
  
  // 📦 Stock Management page
  stock: {
    name: "Stock Management",
    visible: true,  // ✅ VISIBLE - Set to false to hide
    description: "Inventory control and stock tracking"
  },
  
  // 💳 POS Integration page
  posIntegration: {
    name: "POS Integrations",
    visible: false,  // ✅ VISIBLE - Set to false to hide
    description: "Point of sale system integrations"
  },
  
  // 🔧 External API Test page (Development tool)
  apiTest: {
    name: "External API Test",
    visible: false,  // ✅ VISIBLE - Set to false to hide (recommended for production)
    description: "API testing and debugging tools"
  },
  
  // 💬 Chatbot page
  chatbot: {
    name: "Chatbot",
    visible: false,  // ✅ VISIBLE - Set to false to hide
    description: "Customer service chatbot management"
  }
}

/**
 * Get filtered navigation items based on visibility configuration
 * @param {Array} allNavigationItems - All available navigation items
 * @returns {Array} Filtered navigation items that should be visible
 */
export const getVisibleNavigationItems = (allNavigationItems) => {
  const configMapping = {
    '/': 'overview',
    '/forecasting': 'forecasting',
    '/promotions': 'promotions',
    '/stock': 'stock',
    '/pos-integration': 'posIntegration',
    '/api-test-external': 'apiTest',
    '/chatbot': 'chatbot',
    '/ai-api-test': 'aiApiTest'
  }
  
  return allNavigationItems.filter(item => {
    const configKey = configMapping[item.url]
    return configKey && sidebarVisibilityConfig[configKey]?.visible === true
  })
}
