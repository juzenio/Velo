import { Page, expect } from '@playwright/test'

type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export class OrderLockupPage {
   
    constructor(private page: Page) { }

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
}