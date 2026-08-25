import { Page, expect } from '@playwright/test'

export type CustomerFormData = {
  name: string
  surname: string
  email: string
  phone: string
  cpf: string
  store: string
  paymentMethod: 'avista' | 'financiamento'
  terms?: boolean
  downPayment?: string
}

export function createCheckoutActions(page: Page) {
  //inputs
  const inputs = {
    nameInput: page.getByTestId('checkout-name'),
    surnameInput: page.getByTestId('checkout-lastname'),
    emailInput: page.getByTestId('checkout-email'),
    phoneInput: page.getByTestId('checkout-phone'),
    cpfInput: page.getByTestId('checkout-documento'),
    storeCombobox: page.getByTestId('checkout-store'),
    termsCheckbox: page.getByTestId('checkout-terms'),
    submitButton: page.getByTestId('checkout-submit'),
  }
  //alerts
  const alerts = {
    nameAlert: page.getByTestId('error-name'),
    surnameAlert: page.getByTestId('error-lastname'),
    emailAlert: page.getByTestId('error-email'),
    phoneAlert: page.getByTestId('error-phone'),
    cpfAlert: page.getByTestId('error-documento'),
    storeAlert: page.getByTestId('error-store'),
    terms: page.getByTestId('error-terms'),
  }

  //payment
  const payment = {
    avistaButton: page.getByTestId('payment-avista'),
    financiamentoButton: page.getByTestId('payment-financiamento'),
    entryValueInput: page.getByTestId('input-entry-value'),
    totalPrice: page.getByTestId('summary-total-price'),
  }

  //success
  const success = {
    statusHeading: page.getByTestId('success-status'),
    orderId: page.getByTestId('order-id'),
  }

  return {
    elements: {
      alerts,
      inputs,
      payment,
      success,
    },

    async open() {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async submitOrder() {
      await expect(inputs.submitButton).toBeVisible()
      await inputs.submitButton.click()
    },

    async selectPaymentMethod(method: 'avista' | 'financiamento') {
      if (method === 'avista') {
        await payment.avistaButton.click()
      } else {
        await payment.financiamentoButton.click()
      }
    },

    async selectStore(storeName: string) {
      await inputs.storeCombobox.click()
      const option = page.getByRole('option', { name: new RegExp(storeName, 'i') })
      await expect(option).toBeVisible()
      await option.click()
    },

    async toggleTerms(check: boolean = true) {
      if (check) {
        await inputs.termsCheckbox.check()
      } else {
        await inputs.termsCheckbox.uncheck()
      }
    },

    async fillCustomerData(data: CustomerFormData) {
      await inputs.nameInput.fill(data.name)
      await inputs.surnameInput.fill(data.surname)
      await inputs.emailInput.fill(data.email)
      await inputs.phoneInput.fill(data.phone)
      await inputs.cpfInput.fill(data.cpf)
      if (data.store) {
        await this.selectStore(data.store)
      }
      if (data.terms !== undefined) {
        await this.toggleTerms(data.terms)
      }
    },

    async fillDownPayment(amount: string) {
      await payment.entryValueInput.clear()
      await payment.entryValueInput.fill(amount)
    },

    async validateTotaltePrice(expectedTotalPrice: string) {
      await expect(payment.totalPrice).toBeVisible()
      await expect(payment.totalPrice).toHaveText(expectedTotalPrice)
    },

    async validateErrorMessage(message: string) {
      const errorElement = page.getByRole('paragraph').filter({ hasText: new RegExp(`^${message}$`) })
      await expect(errorElement).toBeVisible()
    },

    async validateRequiredErrors() {
      await expect(alerts.nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.emailAlert).toHaveText('Email inválido')
      await expect(alerts.phoneAlert).toHaveText('Telefone inválido')
      await expect(alerts.cpfAlert).toHaveText('CPF inválido')
      await expect(alerts.storeAlert).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toContainText('Aceite os termos')
    },

    async validateOrder(expectedTitle: string, customer: CustomerFormData) {
      await expect(page).toHaveURL(/\/success/)
      await expect(success.statusHeading).toHaveText(expectedTitle)
      await expect(success.orderId).toHaveText(/^VLO-[A-Z0-9]+$/)
      await expect(page.getByText(`${customer.name} ${customer.surname}`)).toBeVisible()
      await expect(page.getByText(customer.email)).toBeVisible()
      await expect(page.getByText(customer.store)).toBeVisible()
    },
  }
}
