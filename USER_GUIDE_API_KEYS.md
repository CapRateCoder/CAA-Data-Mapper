# User Guide: Getting Your Gemini API Key

This guide will help users of your RESO Data Harmonizer get their own free Gemini API key for AI-powered field mapping.

## Why Do I Need an API Key?

The AI-powered "Auto-Map" feature uses Google's Gemini AI to intelligently map non-standard MLS field names to RESO standard fields. To use this feature, you need your own (free) Gemini API key.

## Getting Your Free API Key

### Step 1: Visit Google AI Studio

Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign In

- Sign in with your Google account
- If you don't have one, you can create a free Google account

### Step 3: Create API Key

1. Click "Create API Key" or "Get API Key"
2. Select a Google Cloud project (or create a new one)
3. Your API key will be generated instantly
4. Copy the API key to your clipboard

### Step 4: Enter Key in the App

1. In the RESO Data Harmonizer, look for "API Key Settings"
2. Click to expand the settings section
3. Paste your API key into the input field
4. Click "Save"

That's it! Your key is now stored securely in your browser.

## Is This Free?

**Yes!** Google provides a generous free tier for Gemini API usage:

- Free tier includes 60 requests per minute
- 1,500 requests per day
- More than enough for typical MLS data mapping tasks

For current pricing and limits, visit: https://ai.google.dev/pricing

## Is My API Key Safe?

**Absolutely!** Here's how we protect your key:

✅ **Stored locally only**: Your key is saved in your browser's localStorage  
✅ **Never transmitted**: The key never passes through our servers  
✅ **Direct API calls**: Calls go straight from your browser to Google  
✅ **You control it**: You can view, update, or delete your key anytime  

## Managing Your Key

### Viewing Your Key

1. Click "API Key Settings" to expand
2. Click the eye icon to show/hide your key

### Updating Your Key

1. Enter a new key in the input field
2. Click "Save"

### Removing Your Key

1. Click "API Key Settings" to expand
2. Click the "Clear" button
3. Your key is removed from browser storage

## Troubleshooting

### "API key not working"

**Possible solutions:**
- Check that you copied the entire key (no spaces before/after)
- Verify the key is active in Google AI Studio
- Make sure you've enabled the Gemini API in your Google Cloud project
- Try generating a new key

### "Rate limit exceeded"

**What it means:**
You've hit the free tier limit (60 requests/minute or 1,500/day)

**Solutions:**
- Wait a few minutes and try again
- For heavy usage, consider upgrading in Google Cloud Console

### "Invalid API key"

**Solutions:**
- Make sure you're using a Gemini API key (not a different Google service)
- Check that the key hasn't been restricted or deleted
- Try creating a new key

## Privacy & Security Best Practices

### Do:
✅ Keep your API key private (don't share it publicly)  
✅ Use the key only in your browser  
✅ Clear your key if using a shared computer  

### Don't:
❌ Share your key in screenshots or videos  
❌ Commit your key to Git repositories  
❌ Use someone else's key  

## Need Help?

If you're having trouble:

1. **Check Google AI Studio**: https://aistudio.google.com/
2. **Review API documentation**: https://ai.google.dev/docs
3. **Contact Google Cloud support** for API-specific issues

## Alternative: Using Without AI

You can still use the RESO Data Harmonizer without an API key! The app includes:

- **Exact matching**: Automatically finds fields that match RESO names exactly
- **Fuzzy matching**: Intelligently suggests matches for similar field names
- **Manual mapping**: You can always map fields manually using the dropdown

The AI Auto-Map feature is optional and just makes the process faster for unusual or non-standard field names.

## Benefits of Using Your Own Key

**For you:**
- Free API access
- Control your own usage
- Privacy protection

**For the app owner:**
- No API costs
- No usage limits to manage
- Simpler deployment and maintenance

---

**Questions?** This approach ensures maximum privacy, zero cost for the app maintainer, and free usage for you!
