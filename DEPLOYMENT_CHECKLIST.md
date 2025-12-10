# Pre-Deployment Checklist

Before deploying to Netlify, verify the following:

## Local Testing

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` successfully (no errors)
- [ ] Run `npm run preview` and test the built app locally
- [ ] Verify all features work in the preview build
- [ ] Test the API key settings UI (expand, save, clear)

## Code Quality

- [ ] No hardcoded API keys in source code (good - users provide their own!)
- [ ] All imports use relative paths (no absolute paths to local files)
- [ ] TypeScript compiles without errors
- [ ] All assets are in the public folder or properly imported

## Configuration Files

- [ ] `netlify.toml` exists with correct build settings
- [ ] `package.json` includes all required dependencies
- [ ] `.gitignore` includes `dist`, `node_modules`, and `.netlify`

## Git Repository (if using Git deployment)

- [ ] Code is committed to Git
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] No sensitive files in repository (shouldn't be any now!)

## Netlify Setup

- [ ] Netlify account created
- [ ] Repository connected (if using Git method) OR build uploaded (if using manual)
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: 20
- [ ] ✨ No environment variables needed! (Users provide their own keys)

## Post-Deployment

- [ ] Site deployed successfully
- [ ] Visit the Netlify URL and verify app loads
- [ ] Expand "API Key Settings" section
- [ ] Test entering and saving an API key (check localStorage)
- [ ] Test file upload functionality
- [ ] Test AI mapping feature with a valid API key
- [ ] Test data export
- [ ] Check browser console for errors
- [ ] Test clearing API key works
- [ ] Test on mobile/tablet (optional but recommended)

## User Experience Verification

- [ ] API Key Settings UI is visible and functional
- [ ] Link to Google AI Studio works
- [ ] Privacy notice is clear and visible
- [ ] Save/Clear buttons work correctly
- [ ] Key is hidden by default (password field)
- [ ] Show/hide eye icon works
- [ ] "Configured" badge shows when key is saved
- [ ] Error messages display if AI call fails
- [ ] Settings collapse/expand smoothly

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Netlify)
- [ ] Deploy previews enabled for pull requests
- [ ] Branch deploys configured (if needed)
- [ ] Analytics enabled (Netlify Analytics)

## Documentation to Share with Users

Consider adding to your site:
- [ ] Instructions on getting a Gemini API key
- [ ] Link to Google AI Studio: https://aistudio.google.com/app/apikey
- [ ] Privacy explanation (keys stored locally only)
- [ ] FAQ about API usage costs (free tier available)

## Troubleshooting Resources

If you encounter issues:
1. Check Netlify deploy logs
2. Review browser console
3. Test localStorage is working in browser
4. See NETLIFY_DEPLOYMENT.md for detailed troubleshooting
