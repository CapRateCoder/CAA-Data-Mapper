# Netlify Deployment Guide for CAA Data Harmonizer

This guide will help you deploy your React app to Netlify. **Good news: You don't need to configure any API keys on the server!** Users provide their own Gemini API keys directly in the web interface.

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup) (free tier works fine)
- Git installed on your computer (optional, but recommended)

## Why This Approach is Better

✅ **No API key management** - Users bring their own keys  
✅ **No usage costs** - Each user pays for their own API calls  
✅ **Enhanced privacy** - Keys are stored only in users' browsers  
✅ **Simple deployment** - No environment variables to configure  

## Deployment Methods

### Method 1: Drag and Drop (Easiest)

1. **Build the app locally:**
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist` folder with your built app.

2. **Go to Netlify:**
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Deploy manually"

3. **Drag and drop:**
   - Drag the entire `dist` folder onto the Netlify dashboard
   - Wait for deployment to complete

4. **Done!** 🎉
   - No environment variables to configure
   - Users will enter their own API keys when they use the app

### Method 2: Connect to Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure build settings:**
   Netlify should auto-detect these from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

4. **Deploy:**
   - Click "Deploy site"
   - That's it! No environment variables needed.

5. **Automatic updates:**
   - Every push to your main branch triggers a rebuild
   - Your app stays up-to-date automatically

### Method 3: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize your site:**
   ```bash
   netlify init
   ```
   Follow the prompts to connect your site.

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## How Users Get API Keys

When users visit your deployed app, they'll see an "API Key Settings" section where they can:

1. Click to expand the settings
2. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Paste their key into the input field
4. Click "Save" to store it in their browser

**Privacy Features:**
- Keys are stored only in the user's browser (localStorage)
- Keys never pass through your server
- Each user manages their own key
- Users can clear/update their key anytime

## Important Notes

### No Server-Side API Keys

Unlike the previous version:
- ❌ No `GEMINI_API_KEY` environment variable needed
- ❌ No API usage costs for you
- ❌ No key rotation or security concerns
- ✅ Users provide their own keys
- ✅ Keys stored client-side only

### Security Benefits

- Your Netlify deployment has zero secrets to manage
- No risk of exposing your API keys in logs or config
- Each user is responsible for their own API usage
- API calls go directly from user's browser to Google's API

### After Deployment

1. **Test the deployed app:**
   - Visit your Netlify URL
   - Expand "API Key Settings"
   - Enter a test API key
   - Upload a file and test the AI mapping feature

2. **Custom domain (optional):**
   - Go to Site settings → Domain management
   - Add your custom domain

3. **HTTPS:**
   - Netlify automatically provisions SSL certificates
   - Your site will be available via HTTPS

4. **Continuous deployment:**
   - With Git method, every push to your main branch triggers a rebuild
   - You can configure deploy contexts for branches/pull requests

## Troubleshooting

### Build Fails

**"Cannot find module" errors:**
- Make sure all dependencies are in `package.json`
- Check that `devDependencies` includes Tailwind CSS and PostCSS
- Run `npm install` locally first

**TypeScript errors:**
- Check `tsconfig.json` is present
- Ensure all type definitions are in `devDependencies`

### App Loads but Doesn't Work

**API key not working:**
- Ask users to verify their key is correct
- Check browser console for API errors
- Verify the key has proper permissions in Google AI Studio

**Blank page:**
- Check the browser console for errors
- Verify the build completed successfully
- Check that redirects are configured in `netlify.toml`

### User Questions About API Keys

**"Where do I get an API key?"**
- Direct them to https://aistudio.google.com/app/apikey
- It's free to create a Google AI account
- Keys are generated instantly

**"Is my API key safe?"**
- Yes! Keys are stored only in their browser's localStorage
- Keys never touch your server
- They can clear it anytime

**"Will it cost money?"**
- Google provides free tier API access
- Usage is very minimal (just for mapping fields)
- Each user manages their own quota

### Development vs. Production

**Testing locally before deploying:**
```bash
npm run build
npm run preview
```
This runs a local preview of the production build.

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google AI Studio](https://aistudio.google.com/)

## Support

If you encounter issues:
1. Check the Netlify deploy logs for specific error messages
2. Review the browser console for client-side errors
3. Ensure your Git repository doesn't have uncommitted changes
4. For user API key issues, direct them to Google AI Studio documentation
