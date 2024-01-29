'use server';

import {z} from "zod";
import {sql} from "@vercel/postgres";

export async function createInvoice(formData: FormData) {
    const formDataObj = Object.fromEntries(formData.entries());
    const FormSchema = z.object({
        id: z.string(),
        customerId: z.string(),
        amount: z.coerce.number(),
        status: z.enum(['pending', 'paid']),
        date: z.string(),
    }).omit({id: true, date: true})

    const {customerId, amount, status} = FormSchema.parse(formDataObj)
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}