'use server'

import {baseUrl} from "@/lib/constants";
import {revalidateTag} from "next/cache";
import {Apartment} from "@/types/types";

export async function getApartments(token: string) {
  const res = await fetch(`${baseUrl}apartment`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    next: {
      tags: ['apartments']
    }
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export async function createApartment(token: string, data: any) {
  const res = await fetch(`${baseUrl}apartment`, {
    method: 'POST',
    body: data,
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  })
  revalidateTag('apartments')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

export async function deleteApartament(token: string, id: string) {
  const res = await fetch(`${baseUrl}apartment/${id}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  revalidateTag('apartments')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return;
}


export async function getApartment(token: string, id: string): Promise<Apartment> {
  const res = await fetch(`${baseUrl}apartment/${id}`, {
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
