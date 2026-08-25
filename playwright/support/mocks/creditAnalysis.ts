import { Page } from '@playwright/test'

export interface CreditAnalysisMockOptions {
  score?: number
  status?: string
  httpStatus?: number
}

export async function mockCreditAnalysis(
  page: Page,
  options: CreditAnalysisMockOptions | number = 500
) {
  const score = typeof options === 'number' ? options : (options.score ?? 500)
  const status = typeof options === 'number' ? 'Done' : (options.status ?? 'Done')
  const httpStatus = typeof options === 'number' ? 200 : (options.httpStatus ?? 200)

  await page.route('**/functions/v1/credit-analysis', async route => {
    await route.fulfill({
      status: httpStatus,
      contentType: 'application/json',
      body: JSON.stringify({
        status,
        score,
      }),
    })
  })
}
