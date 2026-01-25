# Trade Adhyayan v3 📈

Professional Trading Journal & Analytics Platform.
Built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**.

## 🚀 Live Demo

**[https://tradeadhyayan.vercel.app](https://tradeadhyayan.vercel.app)**

## 🛠 Project Status

- **Version**: 3.0.0
- **Theme**: Light Mode (Strict Enforcement)
- **Deployment**: Vercel (Auto-sync with GitHub)
- **Repository**: [Ajay-internationals/tradejournall](https://github.com/Ajay-internationals/tradejournall)

## 🔄 How Updates Work

This project is configured with a **Continuous Deployment (CD)** pipeline.

1.  **Code Changes**: Any changes made to the code are committed to the local git repository.
2.  **Sync to GitHub**: Running `git push` sends these changes to the GitHub repository.
3.  **Auto-Deploy**: Vercel detects the new commit on GitHub and automatically builds and deploys the update to the live URL.

### Manual Sync Command
If you make changes and want to deploy them, simply run:
```bash
git add .
git commit -m "Description of changes"
git push
```

## 🏗 Setup & Run Locally

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `/src`
  - `/components`: Reusable UI components
  - `/pages`: Main route pages (Analytics, Strategies, Journal, etc.)
  - `/context`: Global state management
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and static data
