export function generateOrderCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
    const firstNumber = Math.floor(Math.random() * 10)
    const letter = letters[Math.floor(Math.random() * letters.length)]
    const lastNumbers = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  
    return `VLO-${firstNumber}${letter}${lastNumbers}`
  }