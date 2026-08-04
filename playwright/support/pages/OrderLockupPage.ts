import { Page, expect } from '@playwright/test'

type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrdeDetails = {
  Number: string
  Name: string
  Email: string
  Status: OrderStatus
  Color: string
  Wheels: string
}

export class OrderLockupPage {
   
    constructor(private page: Page) { }

    async validatePageLoaded() {
        await expect(this.page.getByRole('heading')).toContainText('Consultar Pedido')
    }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }

    async validateStatusBadge(status: OrderStatus) {

       const statusClasses = {
        APROVADO: {
          bacgrougnd:'bg-green-100', 
          text:'text-green-700',
          icon: 'lucide-circle-check-big'
          },

        REPROVADO:  {
          bacgrougnd:'bg-red-100', 
          text:'text-red-700',
          icon: 'lucide-circle'
          },

        EM_ANALISE:  {
          bacgrougnd:'bg-yellow-100', 
          text:'text-yellow-700',
          icon: 'lucide-clock'
          },
    } as const

        const Classes = statusClasses[status]
        const statusBadge = this.page.getByRole('status').filter({ hasText: status })

        await expect(statusBadge).toHaveClass(new RegExp(Classes.bacgrougnd))
        await expect(statusBadge).toHaveClass(new RegExp(Classes.text))
        await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(Classes.icon))
    }

    async validateOrderDetails(Order: OrdeDetails) {
      await expect(this.page.getByTestId(`order-result-${Order.Number}`)).toMatchAriaSnapshot(`
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
    }

    async validateOrderNotFound() {
      await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
        - img
        - heading "Pedido não encontrado" [level=3]
        - paragraph: Verifique o número do pedido e tente novamente
        `)
}


}