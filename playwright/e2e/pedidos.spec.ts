import { expect, test } from '../support/fixtures'

import { generateOrderCode } from '../support/helpers'

import { OrderDetails } from '../support/actions/orderLookupActions'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const Order: OrderDetails = {
      Number: 'VLO-5G1210',
      Name: 'JUZENIO SANTOS',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'APROVADO' as const,
      Color: 'Glacier Blue',
      Wheels: 'aero Wheels',
    }

    // Act  
    await app.orderLookup.searchOrder(Order.Number)

    // Assert
    await app.orderLookup.validateOrderDetails(Order)

    // Validação do badge de status encapsulada na Action
    await app.orderLookup.validateStatusBadge(Order.Status)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const Order: OrderDetails = {
      Number: 'VLO-KAPUFX',
      Name: 'jack sperow',
      Email: 'juzenio.santos01@gmail.com',
      Status: 'REPROVADO' as const,
      Color: 'Midnight Black',
      Wheels: 'sport Wheels',
    }

    // Act  
    await app.orderLookup.searchOrder(Order.Number)

    // Assert
    await app.orderLookup.validateOrderDetails(Order)

    // Validação do badge de status encapsulada na Action
    await app.orderLookup.validateStatusBadge(Order.Status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const Order: OrderDetails = {
      Number: 'VLO-IYVSUL',
      Name: 'marcelio alencar',
      Email: 'marcelio.santos01@gmail.com',
      Status: 'EM_ANALISE' as const,
      Color: 'Lunar White',
      Wheels: 'aero Wheels',
    }

    // Act  
    await app.orderLookup.searchOrder(Order.Number)

    // Assert
    await app.orderLookup.validateOrderDetails(Order)

    // Validação do badge de status encapsulada na Action
    await app.orderLookup.validateStatusBadge(Order.Status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    // Test Data
    const order = generateOrderCode()

    // Act  
    await app.orderLookup.searchOrder(order)

    // Assert
    await app.orderLookup.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o pedido em qualquer fomato nao é encontrado', async ({ app }) => {


    // Act  
    await app.orderLookup.searchOrder('ACV489')

    // Assert
    await app.orderLookup.validateOrderNotFound()

  })

  test('deve exibir mensagem ao consultar pedido com caracteres especiais fora do padrão', async ({ app }) => {

    // Test Data
    const invalidOrderCode = 'VLO-INVALID#999'

    // Act  
    await app.orderLookup.searchOrder(invalidOrderCode)

    // Assert
    await app.orderLookup.validateOrderNotFound()

  })

  test('deve manter o campode busca desabilitado com o campo vazio ou apenas espaços', async ({ app,page }) => {

    const button =  app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('  ')
    await expect(button).toBeDisabled()
    
  })
})