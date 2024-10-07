// /app/api/subscriptions/[id]/route.js
import dbConnect from '@/app/_lib/dbConnect';
import Subscription from '@/models/subscription';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const subscription = await Subscription.findById(id);
        if (!subscription) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    try {
        const subscription = await Subscription.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!subscription) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const subscription = await Subscription.findByIdAndDelete(id);
        if (!subscription) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });

        return NextResponse.json({ message: 'Subscription deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
