import { expect, test } from '../support/fixtures'
import { CustomerFormData } from '../support/actions/checkoutActions'

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
    test('CT05 - deve criar um pedido com pagamento à vista com sucesso', async ({ app }) => {
      // Massa de Testes
      const customer: CustomerFormData = {
        name: 'Fernando',
        surname: 'Papito',
        email: 'fernando.papito@velomotors.com',
        phone: '11999998888',
        cpf: '546.383.850-01',
        store: 'Velô Paulista',
        terms: true,
      }

      // Arrange
      await app.checkout.open()

      // Act
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectPaymentMethod('avista')
      await app.checkout.submitOrder()

      // Assert
      await app.checkout.validateOrderSuccess('Pedido Aprovado!', customer)
    })
  })
})