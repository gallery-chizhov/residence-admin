'use server'

import {baseUrl} from "@/lib/constants";
import {User} from "@/types/types";
import {updateUserValues} from "@/components/dashboard/users/UpdateUserForm";
import {createUserValues} from "@/components/dashboard/users/CreateUserForm";
import {revalidatePath, revalidateTag} from "next/cache";

export async function getUsers(token: string) {
  const res = await fetch(`${baseUrl}user`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    next: {
      tags: ['users']
    }
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export async function getUser(token: string, id: string): Promise<User> {
  const res = await fetch(`${baseUrl}user/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export async function updateUser(token: string, id: string, user: updateUserValues) {
  const body = {
    login: user.login,
    phone: user.phone,
    email: user.email,
    role: user.role,
    cardNumber: user.card,
    residentId: user.resident?.id
  }
  const res = await fetch(`${baseUrl}user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidatePath('/dashboard/users/[id]')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return;
}

export async function updateUserPassword(token: string, id: string, password: string) {
  const body = {
    password: password
  }
  const res = await fetch(`${baseUrl}user/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return;
}

export async function createUser(token: string, user: createUserValues) {
  const body = {
    login: user.login,
    password: user.password,
    phone: user.phone,
    email: user.email,
    role: user.role,
    cardNumber: user.card,
    residentId: user.resident?.id
  }
  const res = await fetch(`${baseUrl}user`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidateTag('users')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

export async function deleteUser(token: string, id: string) {
  const res = await fetch(`${baseUrl}user/${id}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidateTag('users')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return;
}
