
import { test, expect } from '@playwright/test'

test('Pedido Aprovado', async ({ page }) => {

  const orderCode =  page.getByTestId('order-result-VLO-5G1210').locator('p.font-mono.font-medium')

  const orderStatus =  page.locator("//div[@data-testid='order-result-VLO-5G1210']//div[normalize-space()='APROVADO']")


  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading'))
  .toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' })
  .click()
  await page.getByTestId('search-order-id')
  .fill('VLO-5G1210')
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click();
  
  await expect(orderCode)
  .toBeVisible()
  await expect(orderCode)
  .toContainText('VLO-5G1210')
  await expect(orderStatus)
  .toBeVisible()
  await expect(orderStatus)
  .toContainText('APROVADO')

})

// test('Pedido Não Reprovado', async ({ page }) => {
//   await page.goto('http://localhost:5173/')
 
 
//   await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
//   await page.getByRole('link', { name: 'Consultar Pedido' }).click()
 
//   await page.getByTestId('search-order-id').fill('123')
//   await page.getByTestId('search-order-button').click()
//   await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
//   await expect(page.locator('#root')).toContainText('Pedido não encontrado')
// })


// test('Pedido Não Encontrado', async ({ page }) => {
//   await page.goto('http://localhost:5173/')
 
 
//   await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
//   await page.getByRole('link', { name: 'Consultar Pedido' }).click()
 
//   await page.getByTestId('search-order-id').fill('123')
//   await page.getByTestId('search-order-button').click()
//   await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
//   await expect(page.locator('#root')).toContainText('Pedido não encontrado')
// })




