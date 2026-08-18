export interface OrdersTable {
  id: string
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
  created_at: Date
  updated_at: Date
  optionals: string[]
}

export interface Database {
  orders: OrdersTable
}
