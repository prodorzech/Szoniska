import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Get all maintenances
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maintenances = await prisma.systemMaintenance.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Update expired maintenances
    const now = new Date();
    for (const maintenance of maintenances) {
      if (maintenance.isActive && new Date(maintenance.endTime) <= now) {
        await prisma.systemMaintenance.update({
          where: { id: maintenance.id },
          data: { isActive: false },
        });
      }
    }

    // Fetch again after updates
    const updated = await prisma.systemMaintenance.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error fetching maintenances:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenances' }, { status: 500 });
  }
}

// Create new maintenance
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, reason, endTime } = await req.json();

    if (!type || !reason || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const maintenance = await prisma.systemMaintenance.create({
      data: {
        type,
        reason,
        endTime: new Date(endTime),
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error('Error creating maintenance:', error);
    return NextResponse.json({ error: 'Failed to create maintenance' }, { status: 500 });
  }
}
