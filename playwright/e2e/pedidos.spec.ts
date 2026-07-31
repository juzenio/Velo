import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { OrderLockupPage } from '../support/pages/OrderLockupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const Order = {
      Number: 'VLO-5G1210',
      Name: 'JUZENIO SANTOS',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'APROVADO' as const,
      Color: 'Glacier Blue',
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await expect(page.getByTestId(`order-result-${Order.Number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${Order.Number}
      - status:
        - img
        - text: ${Order.Status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${Order.Color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${Order.Name}
      - paragraph: Email
      - paragraph: ${Order.Email}
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const Order = {
      Number: 'VLO-KAPUFX',
      Name: 'jack sperow',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'REPROVADO' as const,
      Color: 'Midnight Black',
     }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await expect(page.getByTestId(`order-result-${Order.Number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${Order.Number}
      - status:
         - img
         - text: ${Order.Status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${Order.Color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: sport Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${Order.Name}
      - paragraph: Email
      - paragraph: ${Order.Email}
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const Order = {
      Number: 'VLO-IYVSUL',
      Name: 'marcelio alencar',
      Email: 'marcelio.santos01@gmail.com',
      Status: 'EM_ANALISE' as const,
      Color: 'Lunar White',
     }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await expect(page.getByTestId(`order-result-${Order.Number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${Order.Number}
      - status:
        - img
        - text: ${Order.Status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${Order.Color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${Order.Name}
      - paragraph: Email
      - paragraph: ${Order.Email}
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)


    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })
})