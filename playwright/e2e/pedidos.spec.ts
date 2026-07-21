import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'

test.describe('Consultar Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    //Preparar
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading'))
    .toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' })
    .click()

  })

test('Pedido APROVADO', async ({ page }) => {
  //variáveis
  //const Order = 'VLO-5G1210'
  const Order = {
    Number: 'VLO-5G1210',
    Name: 'JUZENIO SANTOS',
    Email: 'juzenio.santos01@gmail.com',
    Status: 'APROVADO',
    Color: 'Glacier Blue',
  }

//AAA - Arrange, Act, Assert

  //Agir
  await page.getByTestId('search-order-id')
  .fill(Order.Number)
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click()

  //Assert
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
    - paragraph: aero Wheels
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

     const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' })
     await expect(statusBadge).toHaveClass(/bg-green-100/)
     await expect(statusBadge).toHaveClass(/text-green-700/)

     const statusIcon = statusBadge.locator('svg')
     await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
})

test('Pedido REPROVADO', async ({ page }) => {
 //variáveis
 //const Order = 'VLO-KAPUFX'
 const Order = {
  Number: 'VLO-KAPUFX',
  Name: 'jack sperow',
  Email: 'juzenio.santos01@gmail.com',
  Status: 'REPROVADO',
  Color: 'Midnight Black',
 }
 
//AAA - Arrange, Act, Assert

 //Agir
 await page.getByTestId('search-order-id')
 .fill(Order.Number)
 await page.getByRole('button', { name: 'Buscar Pedido' })
 .click()

 //Assert
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
   - paragraph: sport Wheels
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
 
   const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO' })
   await expect(statusBadge).toHaveClass(/bg-red-100/)
   await expect(statusBadge).toHaveClass(/text-red-700/)

   const statusIcon = statusBadge.locator('svg')
   await expect(statusIcon).toHaveClass(/lucide-circle/)

})
test('Pedido EM ANALISE', async ({ page }) => {
  //variáveis
  //const Order = 'VLO-KAPUFX'
  const Order = {
   Number: 'VLO-IYVSUL',
   Name: 'marcelio alencar',
   Email: 'marcelio.santos01@gmail.com',
   Status: 'EM_ANALISE',
   Color: 'Lunar White',
  }
  
 //AAA - Arrange, Act, Assert
 
  //Agir
  await page.getByTestId('search-order-id')
  .fill(Order.Number)
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click()
 
  //Assert
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
    - paragraph: aero Wheels
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

     const statusBadge = page.getByRole('status').filter({ hasText: 'EM_ANALISE' })
     await expect(statusBadge).toHaveClass(/bg-yellow-100/)
     await expect(statusBadge).toHaveClass(/text-yellow-700/)

     const statusIcon = statusBadge.locator('svg')
     await expect(statusIcon).toHaveClass(/lucide-clock/)
   
 })
test('Pedido Não Encontrado', async ({ page }) => {

  //variáveis
  const order = generateOrderCode()

 //AAA - Arrange, Act, Assert
 
 //Agir
  await page.getByTestId('search-order-id')
  .fill(order)
  await page.getByRole('button', { name: 'Buscar Pedido' })
  .click()

//Assert
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)
})

})


