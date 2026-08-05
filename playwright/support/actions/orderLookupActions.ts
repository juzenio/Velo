import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderDetails = {
  Number: string
  Name: string
  Email: string
  Status: OrderStatus
  Color: string
  Wheels: string
}

export type OrdeDetails = OrderDetails

export function createOrderLookupActions(page: Page) {

  const  orderInput = page.getByRole('textbox', { name: 'Número do Pedido' })
  const searchButton = page.getByRole('button', { name: 'Buscar Pedido' })
  
  return {

    elements: {
      orderInput,
      searchButton,
    },

    async open() {
      await page.goto('/')
      const title = page.getByTestId('hero-section').getByRole('heading')
      await expect(title).toContainText('Velô Sprint')
      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

    },

    async searchOrder(code: string) {
      await orderInput.fill(code)
      await searchButton.click()
    },

    async validateStatusBadge(status: OrderStatus) {
      const statusClasses = {
        APROVADO: {
          bacgrougnd: 'bg-green-100',
          text: 'text-green-700',
          icon: 'lucide-circle-check-big',
        },

        REPROVADO: {
          bacgrougnd: 'bg-red-100',
          text: 'text-red-700',
          icon: 'lucide-circle',
        },

        EM_ANALISE: {
          bacgrougnd: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: 'lucide-clock',
        },
      } as const

      const Classes = statusClasses[status]
      const statusBadge = page.getByRole('status').filter({ hasText: status })

      await expect(statusBadge).toHaveClass(new RegExp(Classes.bacgrougnd))
      await expect(statusBadge).toHaveClass(new RegExp(Classes.text))
      await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(Classes.icon))
    },

    async validateOrderDetails(Order: OrderDetails) {
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
        - paragraph: ${Order.Wheels}
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
    },

    async validateOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `)
    },
  }
}
