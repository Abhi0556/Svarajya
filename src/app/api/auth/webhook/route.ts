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
    } else if (type === 'UPDATE' && record) {
      // Sync updated user to Prisma
      const id = record.id;
      const email = record.email;
      const name = record.raw_user_meta_data?.full_name || '';

      try {
        const existing = await userService.findById(id);
        if (existing) {
          const updateData: any = {};
          if (email && email !== existing.email) {
            updateData.email = email;
          }
          if (name && name !== existing.name) {
            updateData.name = name;
          }
          if (Object.keys(updateData).length > 0) {
            await userService.update(id, updateData);
            console.log(`[Webhook] Updated user ${id} in Prisma`);
          }
        } else {
          // If user doesn't exist in Prisma, create it
          await userService.syncUserWithSupabase(id, email || '', name);
        }
      } catch (err) {
        console.error(`[Webhook] Failed to update user ${id} in Prisma:`, err);
      }
    } else if (type === 'DELETE' && old_record) {
      // Delete user from Prisma if deleted from Supabase Auth
      const id = old_record.id;
      try {
        const existing = await userService.findById(id);
        if (existing) {
          // Use prisma directly to avoid trying to delete from Supabase again
          const { prisma } = await import('@/lib/prisma');
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
