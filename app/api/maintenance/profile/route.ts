import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Check if profile is under maintenance (public endpoint)
export async function GET() {
  try {
    const now = new Date();
    
    const maintenance = await prisma.systemMaintenance.findFirst({
      where: {
        type: 'profile',
        isActive: true,
        endTime: {
          gte: now,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (maintenance) {
      return NextResponse.json({
        isMaintenance: true,
        reason: maintenance.reason,
        endTime: maintenance.endTime,
      });
    }

    return NextResponse.json({ isMaintenance: false });
  } catch (error) {
    console.error('Error checking maintenance:', error);
    return NextResponse.json({ isMaintenance: false });
  }
}
