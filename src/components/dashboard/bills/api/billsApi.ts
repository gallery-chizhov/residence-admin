import {baseUrl} from "@/lib/constants";
import {Bill} from "@/types/types";

export async function getBills(token: string) {
  const res = await fetch(`${baseUrl}account/all`, {
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
