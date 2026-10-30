# Publishing the Halloween gift with GitHub Pages (Windows)

Nothing in this folder has been published. You will do every step below yourself.

Legend:

- **[PowerShell]** = a command you run in a terminal inside this project folder.
- **[GitHub]** = something you click on github.com in your browser.

You need: Node.js (v20.19+ or v22), Git for Windows, and a GitHub account.
Check them with:

```powershell
node -v
git --version
```

---

## 1. Open the project folder

**[PowerShell]** Open PowerShell, then go to the folder (adjust if you moved it):

```powershell
cd C:\Users\MJ\Desktop\Holloween\ishi-halloween-gift-pages
```

Or: open the folder in File Explorer, click the address bar, type `powershell`, press Enter.

## 2. Inspect the files before publishing

Everything you publish becomes public. Look at what is here:

```powershell
dir -Force
```

You should see only: `.github`, `public`, `src`, `.gitignore`, `GITHUB_PAGES_GUIDE.md`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`.

Read `src\config.js`: it holds the letter text. Make sure you are happy with every word, because anyone with the link can read it.

**Add the music (optional).** Put a song file you have the right to use in `public\audio\` and name it `song.mp3`. If your file has another name, change `musicFile` in `src\config.js`. If no file exists, the music button just stays hidden and the letter still works.

> Anything in `public\audio\` is downloadable by anyone who visits the page. Only use music you are allowed to share publicly.

## 3. Create a new, empty GitHub repository

**[GitHub]**

1. Go to https://github.com/new
2. Repository name: `ishi-halloween-gift-pages` (exactly this, it must match the Vite base path below).
3. Choose **Public** (free GitHub Pages needs a public repo on most free accounts).
4. Do **not** tick "Add a README", ".gitignore" or a license. It must stay empty.
5. Click **Create repository**. Keep the page open; you will need its URL.

## 4. Check the Vite base path

A site on GitHub Pages lives at `/<repository-name>/`, so Vite must know that name.

**[PowerShell]** Open `vite.config.js`. It should contain:

```js
base: '/ishi-halloween-gift-pages/',
```

It is already set for the repository name above. If you use a different repository name, change it here (keep the slashes on both sides).

## 5. Install dependencies and build locally

**[PowerShell]**

```powershell
npm install
npm run build
```

If the build ends with `built in ...` and a `dist` folder appears, it works. To look at it in your browser:

```powershell
npm run preview
```

Open the address it prints, **including** `/ishi-halloween-gift-pages/` at the end. Press `Ctrl + C` to stop.

## 6. Initialize Git

**[PowerShell]**

```powershell
git init -b main
```

If Git asks who you are (first time only):

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 7. Add, commit, and push

**[PowerShell]** Replace `YOUR-USERNAME` with your GitHub username.

```powershell
git add .
git status
git commit -m "Halloween gift for Ishi"
git remote add origin https://github.com/YOUR-USERNAME/ishi-halloween-gift-pages.git
git push -u origin main
```

`git status` lets you double-check which files are about to be published. `node_modules` and `dist` are ignored automatically. GitHub may ask you to sign in in a browser window the first time.

## 8. Turn on GitHub Pages (GitHub Actions)

The file `.github\workflows\deploy.yml` already tells GitHub how to build and publish the site. You only have to enable it.

**[GitHub]**

1. Open your repository on github.com.
2. Click **Settings** > **Pages** (left sidebar).
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Click the **Actions** tab. A run called "Deploy to GitHub Pages" should be running (or click it and use **Run workflow**). Wait for the green check mark (about a minute).

## 9. Find the deployed URL

**[GitHub]** After the run succeeds, go to **Settings** > **Pages**. The address is shown at the top ("Your site is live at ..."). The Actions run also shows it under the **deploy** job.

It will look like this (this is only the *format*, check the real one on GitHub):

```
https://YOUR-USERNAME.github.io/ishi-halloween-gift-pages/
```

Open it on your own phone first before sending it to anyone.

## 10. Troubleshooting

**Blank page / dark empty page**
- Open the browser console (F12). If you see 404 errors for `.js` or `.css`, the base path is wrong. Check `vite.config.js` matches the repository name exactly, then see "Update the website" below.
- Make sure you opened the URL with the repository name at the end, and that Pages **Source** is set to **GitHub Actions**.

**Images, CSS or audio not found (wrong asset paths)**
- Same cause: the `base` in `vite.config.js`. After changing it, run `npm run build` again and push.
- Audio is loaded from `public\audio\`, and the file name must match `musicFile` in `src\config.js` (capitalisation counts online).

**Build fails (locally or in Actions)**
- Locally: delete the `node_modules` folder and run `npm install` again, then `npm run build`. Read the first red error line.
- In Actions: open the failed run on the **Actions** tab and click the failing step to read the message. A common cause is an older Node version; this project expects Node 20.19 or newer.
- Push errors like "remote contains work you do not have": you created the repo with a README. Either recreate it empty, or ask for help before using `--force`.

**The song does not autoplay**
- This is intentional. Browsers block sound until the visitor taps something, so she presses **play a little song ♡** herself. Phones may also stay silent if the device is on silent mode or the volume is low.
- If the button is missing, the audio file was not found or could not be played. Check the file name and that it is a normal `.mp3`, then rebuild and push.

## 11. Update the website after changes

**[PowerShell]** After editing files:

```powershell
npm run build
git add .
git commit -m "Describe your change"
git push
```

Pushing to `main` starts the deploy automatically. Wait for the green check mark in the **Actions** tab, then refresh the site (use `Ctrl + F5` if you still see the old version).
