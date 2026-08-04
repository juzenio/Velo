import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { OrderLockupPage, OrdeDetails } from '../support/pages/OrderLockupPage'
import { HomePage } from '../support/pages/HomePage'
import { Navbar } from '../support/components/Navbar'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    // Arrange
    await new HomePage(page).goto()
    await new Navbar(page).goToOrderLookup()

    orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const Order: OrdeDetails = {
      Number: 'VLO-5G1210',
      Name: 'JUZENIO SANTOS',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'APROVADO' as const,
      Color: 'Glacier Blue',
      Wheels: 'aero Wheels',
    }

    // Act  
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await orderLockupPage.validateOrderDetails(Order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const Order: OrdeDetails = {
      Number: 'VLO-KAPUFX',
      Name: 'jack sperow',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'REPROVADO' as const,
      Color: 'Midnight Black',
      Wheels: 'sport Wheels',
    }

    // Act  
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await orderLockupPage.validateOrderDetails(Order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const Order: OrdeDetails = {
      Number: 'VLO-IYVSUL',
      Name: 'marcelio alencar',
      Email: 'marcelio.santos01@gmail.com',
      Status: 'EM_ANALISE' as const,
      Color: 'Lunar White',
      Wheels: 'aero Wheels',
    }

    // Act  
    await orderLockupPage.searchOrder(Order.Number)

    // Assert
    await orderLockupPage.validateOrderDetails(Order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(Order.Status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    // Test Data
    const order = generateOrderCode()

    // Act  
    await orderLockupPage.searchOrder(order)

    // Assert
    await orderLockupPage.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o pedido em qualquer fomato nao é encontrado', async ({ page }) => {


    // Act  
    await orderLockupPage.searchOrder('ACV489')

    // Assert
    await orderLockupPage.validateOrderNotFound()

  })

  test('deve exibir mensagem ao consultar pedido com caracteres especiais fora do padrão', async ({ page }) => {

    // Test Data
    const invalidOrderCode = 'VLO-INVALID#999'

    // Act  
    await orderLockupPage.searchOrder(invalidOrderCode)

    // Assert
    await orderLockupPage.validateOrderNotFound()

  })
})