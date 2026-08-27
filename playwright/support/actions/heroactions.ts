import { Page, expect } from "@playwright/test"

export function createHeroActions(page: Page) {
    const configureButton = page.getByRole('link', { name: 'Configure o Seu' })

    return {
        async openFromHome() {
            await page.goto('/')
            await expect(configureButton).toBeVisible()
            await configureButton.click()
            await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
        },
    }
}