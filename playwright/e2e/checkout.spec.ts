import { expect, test } from '../support/fixtures'
import { CustomerFormData } from '../support/actions/checkoutActions'
import { getOrderByCpf, deleteOrderByCode, closeDatabase } from '../support/database/orderSeeder'
import { mockCreditAnalysis } from '../support/mocks/creditAnalysis'
import { beforeEach } from 'node:test'

/// AAA - Arrange, Act, Assert

test.describe('Checkout', () => {

  test.describe('Validações de campos obrigatórios', () => {

    test.beforeEach(async ({ app }) => {
      // Arrange: Navegar para a página de checkout
      await app.checkout.open()
    })

    test('deve validar mensagens de erro de todos os campos obrigatórios ao submeter formulário em branco', async ({ app }) => {
      // Act: Submeter formulário sem preencher nenhum campo
      await app.checkout.submitOrder()

      // Assert: Exibir mensagens de erro para todos os campos obrigatórios
      await app.checkout.validateRequiredErrors()
    })

    test('deve exibir erro ao inserir menos de 2 caracteres no Nome e Sobrenome', async ({ app }) => {
      const customer: CustomerFormData = {
        name: 'a',
        surname: 'b',
        email: 'joao.silva@exemplo.com',
        phone: '11999999999',
        cpf: '12345678901',
        store: 'Velô Paulista',
        paymentMethod: 'avista',
        terms: false,
      }
      // Act: Preencher apenas 1 caractere no Nome e no Sobrenome e submeter
      await app.checkout.fillCustomerData(customer)
      await app.checkout.submitOrder()

      // Assert: Mensagens de erro de tamanho mínimo para Nome e Sobrenome
      await app.checkout.validateErrorMessage('Nome deve ter pelo menos 2 caracteres')
      await app.checkout.validateErrorMessage('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro ao inserir e-mail com formato inválido', async ({ app }) => {
      // Test Data / Arrange
      const customer: CustomerFormData = {
        name: 'João',
        surname: 'Silva',
        email: 'cliente@dominio',
        phone: '11999999999',
        cpf: '12345678901',
        store: 'Velô Paulista',
        paymentMethod: 'avista',
        terms: false,
      }
      await app.checkout.fillCustomerData(customer)
      await app.checkout.submitOrder()

      // Assert: Mensagem de erro de e-mail inválido
      await app.checkout.validateErrorMessage('Email inválido')
    })

    test('deve exibir erro ao inserir CPF incompleto', async ({ app }) => {
      const customer: CustomerFormData = {
        name: 'João',
        surname: 'Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11999999999',
        cpf: '1234567',
        store: 'Velô Paulista',
        paymentMethod: 'avista',
        terms: false,
      }
      // Act: Preencher CPF incompleto e submeter
      await app.checkout.fillCustomerData(customer)
      await app.checkout.submitOrder()

      // Assert: Mensagem de erro de CPF inválido
      await app.checkout.validateErrorMessage('CPF inválido')
    })

    test('deve exibir erro ao não aceitar os termos de uso', async ({ app }) => {
      // Test Data / Arrange
      const customer: CustomerFormData = {
        name: 'João',
        surname: 'Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11999999999',
        cpf: '12345678901',
        store: 'Velô Paulista',
        paymentMethod: 'avista',
        terms: false,
      }

      // Act
      await app.checkout.fillCustomerData(customer)
      await app.checkout.submitOrder()

      // Assert: Mensagem de erro exigindo o aceite dos termos
      await app.checkout.validateErrorMessage('Aceite os termos')
    })
  })

  test.describe('Criação de Pedidos', () => {

    test.beforeEach(async ({ app }) => {
      await app.hero.openFromHome()
    })



    test('deve criar um pedido com pagamento à vista com sucesso', async ({ app, page }) => {
      // Massa de Testes
      const customer: CustomerFormData = {
        name: 'Fernando',
        surname: 'Papito',
        email: 'fernando.papito@velomotors.com',
        phone: '11999998888',
        cpf: '546.383.850-01',
        store: 'Velô Paulista',
        paymentMethod: 'avista',
        terms: true,
      }

      // Arrange: Limpeza prévia buscando o order_number existente no banco pelo CPF
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Fluxo de ponta a ponta iniciando na página principal
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preencher dados e submeter o pedido à vista
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('avista')
      await app.checkout.validateTotaltePrice('R$ 40.000,00')
      await app.checkout.submitOrder()

      // Assert: Validar pedido aprovado e exibido na confirmação
      await app.checkout.validateOrder('Pedido Aprovado!', customer)
    })

    test('deve criar um pedido com status APROVADO quando o score de crédito for acima de 700', async ({ app, page }) => {
      // Massa de Testes
      const customer: CustomerFormData = {
        name: 'Steve',
        surname: 'Jobs',
        email: 'steve.jobs@velomotors.com',
        phone: '11999998888',
        cpf: '643.657.220-18',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
      }

      // Arrange: Limpeza prévia buscando o order_number existente no banco pelo CPF
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: mock da requisição da função de crédito
      await mockCreditAnalysis(page, 710)

      // Arrange: Fluxo de ponta a ponta iniciando na página principal
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preencher dados e submeter o pedido financiado
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.submitOrder()

      // Assert: Validar pedido aprovado e exibido na confirmação
      await app.checkout.validateOrder('Pedido Aprovado!', customer)
    })

    test('deve criar um pedido com status EM ANÁLISE quando o score de crédito for moderado (501 a 700)', async ({ app, page }) => {
      // Arrange: Massa de Testes (Score moderado: 600)
      const customer: CustomerFormData = {
        name: 'Ada',
        surname: 'Lovelace',
        email: 'ada.lovelace@velomotors.com',
        phone: '11999998888',
        cpf: '743.657.220-19',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
      }

      // Arrange: Limpeza prévia no banco de dados para isolamento do teste
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Mock da API de análise de crédito retornando Score 600 (Moderado)
      await mockCreditAnalysis(page, 600)

      // Act: Navegação inicial e configuração do veículo
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preenchimento do checkout e submissão
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.submitOrder()

      // Assert: Redirecionamento e captura do número do pedido
      await app.checkout.validateOrder('Pedido em Análise', customer)

    })
    test('deve reprovar financiamento com score baixo e sem entrada', async ({ app, page }) => {
      // Arrange: Massa de Testes (Score baixo: 500 / Sem entrada)
      const customer: CustomerFormData = {
        name: 'Ada',
        surname: 'Lovelace',
        email: 'ada.lovelace@velomotors.com',
        phone: '11999998888',
        cpf: '529.982.247-25',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
      }

      // Arrange: Limpeza prévia no banco de dados para isolamento do teste
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Mock da API de análise de crédito retornando Score 500 (Baixo)
      await mockCreditAnalysis(page, 500)

      // Act: Navegação inicial e configuração do veículo
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preenchimento do checkout e submissão sem entrada
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.submitOrder()

      // Assert: Redirecionamento e validação da reprovação do pedido
      await app.checkout.validateOrder('Pedido Reprovado!', customer)
    })

    test('deve reprovar financiamento com score baixo e entrada inferior a 50%', async ({ app, page }) => {
      // Arrange: Massa de Testes (Score baixo: 500 / Entrada inferior a 50%)
      const customer: CustomerFormData = {
        name: 'Grace2',
        surname: 'Hopper',
        email: 'grace.hopper@velomotors.com',
        phone: '11999997777',
        cpf: '111.444.777-35',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
        downPayment: '10000'
      }

      // Arrange: Limpeza prévia no banco de dados para isolamento do teste
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Mock da API de análise de crédito retornando Score 500 (Baixo)
      await mockCreditAnalysis(page, 500)

      // Act: Navegação inicial e configuração do veículo
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preenchimento do checkout e configuração da entrada inferior a 50%
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.fillDownPayment(customer.downPayment!)
      await app.checkout.validateTotaltePrice('R$ 30.600,00')
      await app.checkout.submitOrder()

      // Assert: Redirecionamento e validação da reprovação do pedido
      await app.checkout.validateOrder('Pedido Reprovado!', customer)
    })

    test('deve aprovar financiamento com score baixo quando a entrada for igual a 50%', async ({ app, page }) => {
      // Arrange: Massa de Testes (Score baixo: 500 / Entrada de 50%: R$ 20.000,00)
      const customer: CustomerFormData = {
        name: 'Grace3',
        surname: 'Hopper',
        email: 'grace.hopper@velomotors.com',
        phone: '11999997777',
        cpf: '111.444.777-35',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
        downPayment: '20000',
      }

      // Arrange: Limpeza prévia no banco de dados para isolamento do teste
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Mock da API de análise de crédito retornando Score 500 (Baixo)
      await mockCreditAnalysis(page, 500)

      // Act: Navegação inicial e configuração do veículo
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preenchimento do checkout e configuração da entrada igual a 50%
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.fillDownPayment(customer.downPayment!)
      await app.checkout.validateTotaltePrice('R$ 20.400,00')
      await app.checkout.submitOrder()

      // Assert: Redirecionamento e validação da aprovação pela exceção da entrada igual a 50%
      await app.checkout.validateOrder('Pedido Aprovado!', customer)
    })

    test('deve aprovar financiamento com score baixo quando a entrada for superior a 50%', async ({ app, page }) => {
      // Arrange: Massa de Testes (Score baixo: 500 / Entrada superior a 50%: R$ 25.000,00)
      const customer: CustomerFormData = {
        name: 'Grace1',
        surname: 'Hopper',
        email: 'grace.hopper@velomotors.com',
        phone: '11999997777',
        cpf: '111.444.777-35',
        paymentMethod: 'financiamento',
        store: 'Velô Paulista',
        terms: true,
        downPayment: '25000',
      }

      // Arrange: Limpeza prévia no banco de dados para isolamento do teste
      const existing = await getOrderByCpf(customer.cpf)
      if (existing) {
        await deleteOrderByCode(existing.order_number)
      }

      // Arrange: Mock da API de análise de crédito retornando Score 450 (Baixo)
      await mockCreditAnalysis(page, 450)

      // Act: Navegação inicial e configuração do veículo
      await app.configurator.validatePrice('R$ 40.000,00')
      await app.configurator.proceedToCheckout()

      // Act: Preenchimento do checkout e configuração da entrada superior a 50% (R$ 25.000,00)
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('financiamento')
      await app.checkout.validateTotaltePrice('R$ 40.800,00')
      await app.checkout.fillDownPayment(customer.downPayment!)
      await app.checkout.validateTotaltePrice('R$ 15.300,00')
      await app.checkout.submitOrder()

      // Assert: Redirecionamento e validação da aprovação pela exceção da entrada > 50%
      await app.checkout.validateOrder('Pedido Aprovado!', customer)
    })

  })
})

