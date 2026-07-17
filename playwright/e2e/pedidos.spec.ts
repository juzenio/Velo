import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'

test.describe('Consultar Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    //Preparar
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading'))
    .toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' })
    .click()

  })

test('Pedido Aprovado', async ({ page }) => {
  //variáveis
  const Order = 'VLO-5G1210'
  const orderCode =  page.getByTestId('order-result-VLO-5G1210').locator('p.font-mono.font-medium')
  const orderStatus =  page.locator("//div[@data-testid='order-result-VLO-5G1210']//div[normalize-space()='APROVADO']")

//AAA - Arrange, Act, Assert

  //Agir
  await page.getByTestId('search-order-id')
  .fill(Order)
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click()

  //Assert
  await expect(orderCode)
  .toBeVisible()
  await expect(orderCode)
  .toContainText(Order)
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


test('Pedido Não Encontrado', async ({ page }) => {
  //variáveis
  const order = generateOrderCode()
 
 //AAA - Arrange, Act, Assert

 //Agir
  await page.getByTestId('search-order-id')
  .fill(order)
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click()

//Assert
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)
})

})


