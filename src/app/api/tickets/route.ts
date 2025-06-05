// src/app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import { postTicket } from '@/controllers/ticketController';
import { getNextTicketSerial } from '@/lib/serialNumber';

export async function GET(req: NextRequest) {
    await connectDB();
    const url = new URL(req.url);
    const result = await postTicket(url.searchParams);
    return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
    console.log("API ROUTE: POST /api/tickets hit");
    await connectDB();

    let attempts = 0;
    const maxAttempts = 3;
    let newTicket = null;

    try {
        const formData = await req.formData();

        const ticketDataFromForm = {
            serialNumber: await getNextTicketSerial(),
            name: formData.get('name'),
            email: formData.get('email'),
            contactNumber: formData.get('contactNumber'),
            platformName: formData.get('platform'),
            Organization: formData.get('organization'),
            subject: {
                title: formData.get('subject'),
                description: formData.get('description'),
            },
            category: formData.get('category'),
            priority: formData.get('priority') || undefined,
            type: formData.get('type'),
            activityLog: [
                {
                    id: Date.now().toString(),
                    timestamp: new Date(),
                    user: formData.get('email'),
                    action: 'Ticket Created',
                    from: '',
                    to: 'New',
                    details: 'Initial submission via dashboard form.',
                },
            ],
        };

        while (!newTicket && attempts < maxAttempts) {
            try {
                const serialNumber = await getNextTicketSerial();
                const dataWithSerial = { ...ticketDataFromForm, serialNumber };
                newTicket = await postTicket(dataWithSerial);
            } catch (err: any) {
                if (err.code === 11000 && err.message.includes('serialNumber')) {
                    console.warn("Duplicate serial number detected, retrying...");
                    attempts++;
                } else {
                    throw err;
                }
            }
        }

        if (!newTicket) throw new Error("Failed to create ticket after multiple attempts");

        console.log("API ROUTE: Ticket successfully created by controller/service:", newTicket);
        return NextResponse.json({
            success: true,
            ticket: {
                serialNumber: newTicket.serialNumber,
                createdAt: newTicket.createdAt,
                status: newTicket.status,
            }
        }, { status: 201 });

    } catch (err: any) {
        console.error("API ROUTE: Error creating ticket:", err.message, err.stack);
        return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
    }
}
