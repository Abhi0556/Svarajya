import { NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';

// Supabase Database Webhook handler for auth.users
// Needs to be configured in Supabase Dashboard -> Database -> Webhooks
// Trigger on INSERT and DELETE on auth.users table
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Verify webhook secret if configured
    const authHeader = request.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, record, old_record } = payload;

    if (type === 'INSERT' && record) {
      // Sync new user to Prisma
      const email = record.email;
      const id = record.id;
      const name = record.raw_user_meta_data?.full_name || '';
      
      if (email && id) {
        await userService.syncUserWithSupabase(id, email, name);
      }
    } else if (type === 'DELETE' && old_record) {
      // Delete user from Prisma if deleted from Supabase Auth
      const id = old_record.id;
      try {
        const existing = await userService.findById(id);
        if (existing) {
          // Instead of calling the overridden delete which tries to delete from Supabase again,
          // we should call the base delete or prisma directly
          const { prisma } = require('@/lib/prisma');
          await prisma.user.delete({ where: { id } });
          console.log(`[Webhook] Deleted user ${id} from Prisma`);
        }
      } catch (err) {
        console.error(`[Webhook] Failed to delete user ${id} from Prisma:`, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error processing Supabase webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
