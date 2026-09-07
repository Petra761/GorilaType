export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 50
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export function isValidResetCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

export const authValidationMessages = {
  email: 'Ingresa un correo electrónico válido.',
  username: 'El nombre de usuario debe tener entre 3 y 50 caracteres.',
  password: 'La contraseña debe tener al menos 8 caracteres.',
  resetCode: 'El código debe tener 6 dígitos.',
}
