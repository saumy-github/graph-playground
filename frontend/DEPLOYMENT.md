# 🚀 Deployment Guide - Graph Playground

This guide provides step-by-step instructions for deploying the Graph Playground application to Vercel.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] A GitHub account
- [x] Code pushed to GitHub repository
- [x] A Vercel account (free tier is sufficient)
- [x] Node.js 18+ installed locally (for testing)

---

## 🔧 Pre-Deployment Checklist

### 1. Test Build Locally

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to verify the production build works correctly.

### 2. Verify Configuration Files

Ensure these files exist in the `frontend/` directory:

- ✅ `package.json` - Updated with correct metadata
- ✅ `vercel.json` - Deployment configuration
- ✅ `vite.config.ts` - Build settings
- ✅ `tailwind.config.js` - Styling configuration

### 3. Commit All Changes

```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

---

## 🌐 Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended for First Time)

#### Step 1: Sign Up / Log In

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended for easy integration)
3. Authorize Vercel to access your repositories

#### Step 2: Import Project

1. Click **"Add New"** → **"Project"**
2. Select your GitHub repository: `graph-playground`
3. Vercel will auto-detect the framework (Vite)

#### Step 3: Configure Project

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Step 4: Environment Variables (if any)

For this project, no environment variables are needed. Skip this step.

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://graph-playground-xxxx.vercel.app`

#### Step 6: Custom Domain (Optional)

1. Go to project settings
2. Navigate to **"Domains"**
3. Add custom domain: `graph-playground.vercel.app`
4. Follow DNS configuration instructions

---

### Method 2: Vercel CLI (For Developers)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd frontend
vercel
```

Follow the prompts:

- Link to existing project? **No**
- Project name: **graph-playground**
- Directory: **./frontend**

#### Step 4: Production Deployment

```bash
vercel --prod
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to `main` branch.

### Branch Previews

Every pull request gets a unique preview URL:

- Push to feature branch
- Create PR to main
- Vercel comments with preview link
- Test before merging

### Rollback

If something breaks:

1. Go to Vercel dashboard
2. Navigate to **"Deployments"**
3. Find previous working deployment
4. Click **"..."** → **"Promote to Production"**

---

## 🔍 Post-Deployment Verification

### 1. Test Core Features

- [ ] Canvas loads correctly
- [ ] Can add vertices by clicking
- [ ] Can create edges
- [ ] Adjacency matrix displays
- [ ] Adjacency list displays
- [ ] Import/Export works
- [ ] Undo/Redo functions
- [ ] Keyboard shortcuts work
- [ ] Help modal opens
- [ ] Welcome screen appears on first visit

### 2. Test Different Browsers

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 3. Test Responsive Design

- [ ] Desktop (1920×1080)
- [ ] Laptop (1366×768)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667) - Basic functionality

### 4. Performance Check

Use [PageSpeed Insights](https://pagespeed.web.dev/):

- Target: 90+ performance score
- Target: 95+ accessibility score

---

## 🐛 Troubleshooting

### Build Fails

**Error: TypeScript errors**

```bash
npm run lint
# Fix all errors, then try again
```

**Error: Missing dependencies**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page After Deploy

1. Check browser console for errors
2. Verify `vercel.json` rewrites configuration
3. Check if assets are loading (Network tab)
4. Ensure `vite.config.ts` has correct base path

### CSS Not Loading

1. Verify Tailwind CSS build
2. Check PostCSS configuration
3. Clear browser cache
4. Verify `index.css` import in `main.tsx`

---

## 📊 Monitoring

### Vercel Analytics

1. Enable in project settings
2. View metrics:
   - Page views
   - Unique visitors
   - Performance scores
   - Geographic distribution

### Error Tracking

Vercel automatically logs:

- Build errors
- Runtime errors
- Function timeouts

Access logs in dashboard under **"Logs"** tab.

---

## 🔐 Security

### Headers

Already configured in `vercel.json`:

- Cache-Control for assets
- Immutable static files

### Environment Security

- Never commit API keys
- Use Vercel environment variables for secrets
- Different configs for preview/production

---

## 💰 Cost Considerations

### Free Tier Includes:

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 100 builds/day
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Edge network (CDN)

### This Project Uses:

- ~2MB per page load
- Minimal compute resources
- Static site (no serverless functions)

**Conclusion**: Free tier is more than sufficient for this educational project.

---

## 📝 Deployment Checklist

Before final submission:

- [ ] Production build tested locally
- [ ] All features working
- [ ] No console errors
- [ ] Responsive on multiple devices
- [ ] Performance optimized
- [ ] README updated with live URL
- [ ] Screenshots added to repo
- [ ] Vercel deployment successful
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Project shared with instructor

---

## 🎓 For Academic Submission

### Include in Your Report:

1. **Live Demo Link**: https://graph-playground.vercel.app
2. **GitHub Repository**: https://github.com/saumy-github/graph-playground
3. **Deployment Date**: [Date]
4. **Vercel Dashboard Screenshot**: [Screenshot showing successful deployment]
5. **Performance Metrics**: [PageSpeed Insights results]

---

## 🆘 Support

### Vercel Support:

- [Documentation](https://vercel.com/docs)
- [Community Forum](https://github.com/vercel/vercel/discussions)
- [Status Page](https://www.vercel-status.com/)

### Project Issues:

- GitHub Issues: [Create Issue](https://github.com/saumy-github/graph-playground/issues)

---

## ✅ Success!

Once deployed, share your live demo:

```text
🎉 Graph Playground is live!

🔗 Demo: https://graph-playground.vercel.app
📂 Code: https://github.com/saumy-github/graph-playground
👨‍💻 Author: Saumy Bhargava (2024UCA1877)
```

---

**Happy Deploying! 🚀**
