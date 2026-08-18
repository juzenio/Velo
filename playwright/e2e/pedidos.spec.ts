import { expect, test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { createOrder, deleteOrderByCode, closeDatabase } from '../support/database/orderSeeder'
import orders from '../support/fixture/orders.json' with { type: 'json' }

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.afterAll(async () => {
    // fecha a conexão com o banco
    await closeDatabase()
  })

  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const order = orders.APROVADO
    await deleteOrderByCode(order.order_number)
    await createOrder(order)

    // Act  
    await app.orderLookup.searchOrder(order.order_number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order = orders.REPROVADO
    await deleteOrderByCode(order.order_number)
    await createOrder(order)

    // Act  
    await app.orderLookup.searchOrder(order.order_number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const order = orders.EM_ANALISE
    await deleteOrderByCode(order.order_number)
    await createOrder(order)

    // Act  
    await app.orderLookup.searchOrder(order.order_number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

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

  test('deve manter o campode busca desabilitado com o campo vazio ou apenas espaços', async ({ app, page }) => {

    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('  ')
    await expect(button).toBeDisabled()

  })
})