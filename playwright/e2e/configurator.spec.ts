import { expect, test } from '../support/fixtures'

test.describe('Configuração do Veículo - CT02', () => {
  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.configurator.open()
  })

  test('CT02 - deve atualizar a imagem e manter o preço ao trocar a cor do veículo', async ({ app }) => {
    // Arrange: Validação do preço inicial (Preço de venda: R$ 40.000,00)
    await app.configurator.validatePrice('R$ 40.000,00')

    // Act: Selecionar cor exterior "Lunar White"
    await app.configurator.selectColor('Lunar White')

    // Assert: O preview reflete lunar-white e o preço permanece R$ 40.000,00
    await app.configurator.validatePreviewAlt(/lunar-white/i)
    await app.configurator.validatePrice('R$ 40.000,00')
  })

  test('CT02 - deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    // Arrange: Validação do preço inicial (Preço de venda: R$ 40.000,00)
    await app.configurator.validatePrice('R$ 40.000,00')

    // Act 1: Selecionar a opção de roda "Sport Wheels" (+ R$ 2.000,00)
    await app.configurator.selectWheel('Sport Wheels')

    // Assert 1: Preview reflete sport wheels e o preço atualiza para R$ 42.000,00
    await app.configurator.validatePreviewAlt(/sport wheels/i)
    await app.configurator.validatePrice('R$ 42.000,00')

    // Act 2: Selecionar novamente a roda "Aero Wheels"
    await app.configurator.selectWheel('Aero Wheels')

    // Assert 2: Preview reflete aero wheels e o preço retorna para R$ 40.000,00
    await app.configurator.validatePreviewAlt(/aero wheels/i)
    await app.configurator.validatePrice('R$ 40.000,00')
  })

  test('CT03 - deve atualizar o preço dinamicamente ao selecionar e desmarcar opcionais e navegar para o checkout', async ({ app }) => {
    // Arrange: Validação do preço inicial sem opcionais (R$ 40.000,00)
    await app.configurator.validatePrice('R$ 40.000,00')

    // Act 1: Marcar o opcional "Precision Park" (+ R$ 5.500,00)
    await app.configurator.toggleOptional('Precision Park')
    // Assert 1: Preço atualiza para R$ 45.500,00
    await app.configurator.validatePrice('R$ 45.500,00')

    // Act 2: Marcar o opcional "Flux Capacitor" (+ R$ 5.000,00)
    await app.configurator.toggleOptional('Flux Capacitor')
    // Assert 2: Preço atualiza para R$ 50.500,00
    await app.configurator.validatePrice('R$ 50.500,00')

    // Act 3: Desmarcar ambos os opcionais
    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.toggleOptional('Flux Capacitor')
    // Assert 3: Preço retorna para R$ 40.000,00
    await app.configurator.validatePrice('R$ 40.000,00')

    // Act 4 & Assert 4: Clicar em "Monte o Seu" e redirecionar para o Checkout (/order)
    await app.configurator.proceedToCheckout()
  })
})






