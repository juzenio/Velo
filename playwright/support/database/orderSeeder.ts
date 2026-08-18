import { db, closeDatabase } from './db'
import { OrdersTable } from './schema'

export type OrderInput = Partial<OrdersTable> & {
  order_number: string
  color: string
  wheel_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  payment_method: string
  total_price: string
  status: string
  optionals?: string[]
}

/**
 * Cria ou atualiza um pedido no banco a partir do objeto JSON informado.
 */
export async function createOrder(order: OrderInput) {
  await db
    .insertInto('orders')
    .values({
      id: crypto.randomUUID(),
      order_number: order.order_number,
      color: order.color,
      wheel_type: order.wheel_type,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_cpf: order.customer_cpf,
      payment_method: order.payment_method,
      total_price: order.total_price,
      status: order.status,
      optionals: order.optionals ?? [],
      created_at: order.created_at ?? new Date(),
      updated_at: order.updated_at ?? new Date(),
    })
    .onConflict((oc) =>
      oc.column('order_number').doUpdateSet({
        color: order.color,
        wheel_type: order.wheel_type,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_cpf: order.customer_cpf,
        payment_method: order.payment_method,
        total_price: order.total_price,
        status: order.status,
        optionals: order.optionals ?? [],
        updated_at: new Date(),
      })
    )
    .execute()
}

/**
 * Busca um pedido existente no banco pelo CPF do cliente.
 */
export async function getOrderByCpf(cpf: string) {
  return await db
    .selectFrom('orders')
    .selectAll()
    .where('customer_cpf', '=', cpf)
    .executeTakeFirst()
}

/**
 * Deleta um pedido do banco pelo código (order_number).
 */
export async function deleteOrderByCode(orderNumber: string) {
  await db
    .deleteFrom('orders')
    .where('order_number', '=', orderNumber)
    .execute()
}

export { closeDatabase }
