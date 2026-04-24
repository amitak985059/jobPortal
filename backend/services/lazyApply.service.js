const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Attempts to automatically fill out a job application form using Playwright.
 * @param {string} jobUrl - The URL of the job application page.
 * @param {object} userProfile - The user's profile containing their details.
 * @param {object} lazyApplyProfile - The user's lazy apply specific details.
 * @returns {object} - Status of the application (success/failure and message).
 */
const autoApplyToJob = async (jobUrl, userProfile, lazyApplyProfile) => {
    let browser;
    try {
        console.log(`[Lazy Apply] Starting for ${userProfile.name} on ${jobUrl}`);
        
        // Launch a headless browser
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Go to the job URL
        await page.goto(jobUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait for a little bit to ensure any JS rendered forms are loaded
        await page.waitForTimeout(2000);

        // --- SMART SELECTOR HEURISTICS ---
        // We look for common input names/labels used in ATS like Greenhouse, Lever, Workday etc.

        // 1. First Name / Full Name
        const nameInput = await page.$('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]');
        if (nameInput) {
            await nameInput.fill(userProfile.name);
            console.log('[Lazy Apply] Filled Name');
        }

        // 2. Email
        const emailInput = await page.$('input[type="email"], input[name*="email" i], input[id*="email" i]');
        if (emailInput) {
            await emailInput.fill(userProfile.email);
            console.log('[Lazy Apply] Filled Email');
        }

        // 3. Phone
        if (lazyApplyProfile.phone) {
            const phoneInput = await page.$('input[type="tel"], input[name*="phone" i], input[id*="phone" i]');
            if (phoneInput) {
                await phoneInput.fill(lazyApplyProfile.phone);
                console.log('[Lazy Apply] Filled Phone');
            }
        }

        // 4. LinkedIn
        if (lazyApplyProfile.linkedin) {
            const linkedinInput = await page.$('input[name*="linkedin" i], input[id*="linkedin" i], input[placeholder*="linkedin" i]');
            if (linkedinInput) {
                await linkedinInput.fill(lazyApplyProfile.linkedin);
                console.log('[Lazy Apply] Filled LinkedIn');
            }
        }

        // 5. GitHub / Portfolio
        if (lazyApplyProfile.github) {
            const githubInput = await page.$('input[name*="github" i], input[id*="github" i], input[placeholder*="github" i], input[name*="portfolio" i]');
            if (githubInput) {
                await githubInput.fill(lazyApplyProfile.github);
                console.log('[Lazy Apply] Filled GitHub');
            }
        }

        // 6. Resume Upload
        // Playwright handles file uploads easily if we find the input[type="file"]
        if (lazyApplyProfile.resumeUrl) {
            const fileInput = await page.$('input[type="file"]');
            if (fileInput) {
                // If it's a local path (for this PoC, assuming resumeUrl might be a local path or we need to download it first)
                // For a real app, you'd download the S3/Cloudinary URL to a temp file, then upload.
                // Assuming it's a local public/uploads path for now:
                const localResumePath = path.join(__dirname, '..', lazyApplyProfile.resumeUrl);
                if (fs.existsSync(localResumePath)) {
                    await fileInput.setInputFiles(localResumePath);
                    console.log('[Lazy Apply] Uploaded Resume');
                } else {
                    console.log('[Lazy Apply] Resume file not found locally: ' + localResumePath);
                }
            }
        }

        // Take a screenshot of the filled form for proof/debugging
        const screenshotsDir = path.join(__dirname, '../public/screenshots');
        if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
        
        const screenshotFileName = `lazy_apply_${Date.now()}.png`;
        const screenshotPath = path.join(screenshotsDir, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // IMPORTANT: We are NOT clicking submit right now to prevent spamming live companies during development.
        // In a real scenario, you'd find the submit button and click it:
        // const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
        // if (submitBtn) await submitBtn.click();
        
        await browser.close();

        return { 
            success: true, 
            message: 'Application filled successfully! (Submit simulated)',
            screenshotUrl: `/screenshots/${screenshotFileName}`
        };

    } catch (error) {
        if (browser) await browser.close();
        console.error('[Lazy Apply Error]', error);
        return { success: false, message: 'Failed to auto-apply: ' + error.message };
    }
};

module.exports = { autoApplyToJob };
