import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
  const salePrice = page.getByTestId('total-price')
  const vehiclePreview = page.getByRole('img', { name: /Velô Sprint/i })

  return {
    elements: {
      salePrice,
      vehiclePreview,
    },

    async open() {
      await page.goto('/configure')
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },



    async selectColor(colorName: string) {
      const colorButton = page.getByRole('button', { name: colorName })
      await expect(colorButton).toBeVisible()
      await colorButton.click()
    },

    async selectWheel(wheelName: string) {
      const wheelButton = page.getByRole('button', { name: new RegExp(wheelName, 'i') })
      await expect(wheelButton).toBeVisible()
      await wheelButton.click()
    },

    async validatePrice(expectedPrice: string) {
      await expect(page.getByText(expectedPrice)).toBeVisible()
      await expect(salePrice).toHaveText(expectedPrice)
    },

    async validatePreviewAlt(expectedAlt: string | RegExp) {
      await expect(vehiclePreview).toHaveAttribute('alt', expectedAlt)
    },

    async toggleOptional(optionalName: string) {
      const checkbox = page.getByRole('checkbox', { name: new RegExp(optionalName, 'i') })
      await expect(checkbox).toBeVisible()
      await checkbox.click()
    },

    async proceedToCheckout() {
      const checkoutButton = page.getByRole('button', { name: /Monte o Seu/i })
      await expect(checkoutButton).toBeVisible()
      await checkoutButton.click()
      await expect(page).toHaveURL(/\/order$/)
    },
  }
}
