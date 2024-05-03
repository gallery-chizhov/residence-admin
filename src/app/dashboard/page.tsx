import * as React from 'react';
import {redirect} from "next/navigation";

export default function Page() {
  redirect('/dashboard/users');
}

