export type User = {
  id: string | null
  enabled: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
  login: string | null
  phone: string | null
  email: string | null
  role: Roles | null
  cardNumber: string | null
  resident: Resident | null
}

export type Resident = {
  id: string | null
  enabled: boolean | null
  createdAt: Date | null
  createdBy: Auditor | null
  updatedAt: Date | null
  updatedBy: Auditor | null
  lastName: string | null
  firstName: string | null
  middleName: string | null
  phone: string | null
  email: string | null
}

export type Auditor = {
  id: string | null
  name: string | null
}

export type Apartment = {
  id: string | null
  enabled: boolean | null
  createdAt: Date | null
  createdBy: Auditor | null
  updatedAt: Date | null
  updatedBy: Auditor | null
  name: string | null
  description: string | null
  photo: TFile
  number: number | null
  floor: number | null
  entrance: number | null
  space: number | null
  account: Bill
}

export type Bill = {
  id: string
  number: string
}

type TFile = {
  id: string
  mimeType: string
  path: string
}

enum Roles {
  Customer = 'CUSTOMER',
  Employee = 'EMPLOYEE',
  Admin = 'ADMIN'
}
