import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE' | string

export type OrderDetails = {
  Number?: string
  Name?: string
  Email?: string
  Status?: string
  Color?: string
  Wheels?: string
  order_number?: string
  customer_name?: string
  customer_email?: string
  status?: string
  display_color?: string
  display_wheels?: string
}

export type OrdeDetails = OrderDetails

export function createOrderLookupActions(page: Page) {

  const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' })
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

    async validateStatusBadge(status: string) {
      const statusClasses: Record<string, { bacgrougnd: string; text: string; icon: string }> = {
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
      }

      const Classes = statusClasses[status]
      const statusBadge = page.getByRole('status').filter({ hasText: status })

      await expect(statusBadge).toHaveClass(new RegExp(Classes.bacgrougnd))
      await expect(statusBadge).toHaveClass(new RegExp(Classes.text))
      await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(Classes.icon))
    },

    async validateOrderDetails(order: OrderDetails) {
      const number = order.Number ?? order.order_number
      const name = order.Name ?? order.customer_name
      const email = order.Email ?? order.customer_email
      const status = order.Status ?? order.status
      const color = order.Color ?? order.display_color
      const wheels = order.Wheels ?? order.display_wheels

      await expect(page.getByTestId(`order-result-${number}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${number}
        - status:
          - img
          - text: ${status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${color}
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: ${wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${name}
        - paragraph: Email
        - paragraph: ${email}
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
