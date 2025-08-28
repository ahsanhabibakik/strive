# Chat Integration Guide

This document provides information about the chat integration options for the website.

## Current Implementation: Tawk.to (Free)

The website currently uses [Tawk.to](https://www.tawk.to/) as the chat solution. Tawk.to offers a completely free live chat service with unlimited agents, chats, and websites.

### Features of Tawk.to

- **100% Free**: No hidden costs or limitations
- **Unlimited Agents**: Add as many team members as needed
- **Unlimited Chats**: No restrictions on the number of conversations
- **Mobile Apps**: iOS and Android apps available for managing chats on the go
- **Visitor Information**: See who's on your site and their activity
- **Chat History**: All conversations are saved for future reference
- **Customization**: Customize the chat widget to match your brand
- **Canned Responses**: Create quick responses for common questions
- **File Sharing**: Send and receive files through the chat
- **Offline Messaging**: Collect messages when you're not available

### How to Set Up Tawk.to

1. **Create an Account**:
   - Go to [Tawk.to](https://www.tawk.to/) and sign up for a free account

2. **Add Your Website**:
   - After logging in, click on "Administration" → "Property Settings"
   - Add your website URL and name

3. **Get Your Site ID and Chat ID**:
   - Go to "Administration" → "Chat Widget"
   - Click on "Widget Code"
   - You'll see a code snippet that contains your Site ID and Chat ID
   - The format will be: `https://embed.tawk.to/YOUR_SITE_ID/YOUR_CHAT_ID`

4. **Update the TawkChat Component**:
   - Open `src/components/chat/TawkChat.tsx`
   - Replace the placeholder Site ID and Chat ID with your actual IDs:
   ```typescript
   export function TawkChat({ 
     siteId = 'YOUR_SITE_ID_HERE', 
     chatId = 'YOUR_CHAT_ID_HERE'
   }: TawkChatProps) {
     // ...
   }
   ```

5. **Customize Your Chat Widget**:
   - Log in to your Tawk.to dashboard
   - Go to "Administration" → "Chat Widget" → "Appearance"
   - Customize colors, position, language, and other settings to match your brand

### Implementation Details

The chat widget is implemented in `src/components/chat/TawkChat.tsx` and is loaded through the `AnalyticsProvider` component when the user accepts cookies/tracking.

## Alternative Free Chat Options

If you want to try other free chat solutions in the future, here are some alternatives:

### 1. Tidio Live Chat

- **Free Plan**: Up to 3 agents and 100 monthly chats
- **Features**: Live chat, chatbots, visitor tracking
- **Integration**: [Tidio Documentation](https://www.tidio.com/help/getting-started/installing-tidio-on-your-website/)

### 2. Chatra

- **Free Plan**: One agent, unlimited chats
- **Features**: Live chat, offline messaging, file sharing
- **Integration**: [Chatra Documentation](https://chatra.com/help/integration/)

### 3. HubSpot Live Chat

- **Free Plan**: Part of HubSpot CRM (free)
- **Features**: Live chat, chatbots, team inbox
- **Integration**: [HubSpot Documentation](https://knowledge.hubspot.com/chatflows/set-up-live-chat)

### 4. Chatwoot (Self-hosted option)

- **Free**: Open-source and self-hosted
- **Features**: Live chat, team inbox, mobile apps
- **Integration**: [Chatwoot Documentation](https://www.chatwoot.com/docs/product/channels/website/setup)

## Switching from Crisp Chat

The website previously used Crisp Chat, which has a limited free trial and then requires payment. The switch to Tawk.to provides a fully featured chat solution at no cost.

If you need to revert to Crisp Chat or implement another solution, the modular architecture makes it easy to swap out the chat component in the `AnalyticsProvider`.