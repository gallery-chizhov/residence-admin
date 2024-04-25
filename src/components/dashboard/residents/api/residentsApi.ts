'use server'

import {baseUrl} from "@/lib/constants";
import {createUserValues} from "@/components/dashboard/users/CreateUserForm";
import {revalidatePath, revalidateTag} from "next/cache";
import {createResidentValues} from "@/components/dashboard/residents/CreateResidentForm";
import {Resident, User} from "@/types/types";

export async function getResidents(token: string) {
  const res = await fetch(`${baseUrl}resident`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    next: {
      tags: ['residents']
    }
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export async function createResident(token: string, data: createResidentValues) {
  const body = {
    lastName: data.lastname,
    firstName: data.firstname,
    middleName: data.middlename,
    email: data.email,
    phone: data.phone
  }
  const res = await fetch(`${baseUrl}resident`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidateTag('residents')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

export async function deleteResident(token: string, id: string) {
  const res = await fetch(`${baseUrl}resident/${id}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidateTag('residents')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return;
}

export async function getResident(token: string, id: string): Promise<Resident> {
  const res = await fetch(`${baseUrl}resident/${id}`, {
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

export async function updateResident(token: string, data: any) {
  const body = {
    lastName: data.lastname,
    firstName: data.firstname,
    middleName: data.middlename,
    email: data.email,
    phone: data.phone
  }
  const res = await fetch(`${baseUrl}resident`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidatePath('/dashboard/residents/[id]')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

