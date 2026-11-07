import { authorizeBooking, cors, json, handleError, AccessError } from '../_shared/bookingAccess.ts';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  // Reject byte values outside a multiple of the alphabet size to avoid modulo bias.
  let result = '';
  while (result.length < 8) {
    const random = crypto.getRandomValues(new Uint8Array(16));
    for (const byte of random) {
      if (byte >= Math.floor(256 / ALPHABET.length) * ALPHABET.length) continue;
      result += ALPHABET[byte % ALPHABET.length];
      if (result.length === 8) break;
    }
  }
  return result;
}


function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char] || char);
}

function formatExpiry(value: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZoneName: 'short',
  }).format(new Date(value));
}

function invitationHtml(target: string, code: string, expires: string, petName: string): string {
  const safeEmail = escapeHtml(target);
  const safeCode = escapeHtml(code);
  const safeExpiry = escapeHtml(expires);
  const safePet = escapeHtml(petName);

  // Table-based layout and inline CSS work in Gmail, Outlook and mobile email clients.
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CareFur Boarding Invitation</title></head>
<body style="margin:0;padding:0;background:#f6f5ef;color:#183e43;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;font-size:1px;line-height:1px;color:#f6f5ef;max-height:0;max-width:0;opacity:0;overflow:hidden;">A trusted pet parent invited you to follow ${safePet}'s CareFur boarding stay.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f5ef;">
    <tr><td align="center" style="padding:36px 14px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:580px;border:1px solid #dbe6e3;border-radius:18px;overflow:hidden;background:#ffffff;">
        <tr><td style="background:#12656b;padding:28px 32px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:bold;letter-spacing:-1px;color:#ffffff;">CareFur</div>
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d6eeeb;margin-top:5px;">Snuggles Premium Pet Hotel</div>
        </td></tr>
        <tr><td style="padding:34px 32px 20px;">
          <div style="font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#14777a;margin-bottom:10px;">Private boarding invitation</div>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:29px;line-height:1.2;color:#183e43;margin:0 0 16px;">You're invited to stay connected.</h1>
          <p style="font-size:15px;line-height:1.8;color:#4d6668;margin:0;">A CareFur pet parent has invited you to follow <strong style="color:#183e43;">${safePet}</strong>'s boarding stay. You can view permitted pet details, feeding updates, and the live camera when access is active.</p>
        </td></tr>
        <tr><td style="padding:8px 32px 18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ecf6f3;border:1px solid #d0e8e1;border-radius:13px;">
            <tr><td style="padding:24px 18px;text-align:center;">
              <div style="font-size:12px;font-weight:bold;letter-spacing:1.1px;text-transform:uppercase;color:#557779;">Your personal boarding access code</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:800;letter-spacing:5px;color:#125a60;margin:14px 0;">${safeCode}</div>
              <div style="font-size:12px;line-height:1.6;color:#557779;">Private to this invitation. Please don't share your code.</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 22px;">
          <div style="font-size:15px;font-weight:bold;color:#183e43;margin-bottom:9px;">How to access</div>
          <p style="font-size:14px;line-height:1.8;color:#4d6668;margin:0;">1. Open the CareFur App and sign in using <strong style="color:#183e43;">${safeEmail}</strong>.<br>2. Select <strong>Enter Boarding Code</strong>.<br>3. Enter your personal code shown above.</p>
          <p style="font-size:13px;line-height:1.7;color:#62797a;margin:16px 0 0;"><strong style="color:#183e43;">Expires:</strong> ${safeExpiry} (Philippine time).</p>
        </td></tr>
        <tr><td style="padding:0 32px 30px;">
          <div style="border-top:1px solid #e3ece9;padding-top:20px;font-size:13px;line-height:1.75;color:#607577;">This is read-only shared access. You cannot edit records, message CareFur staff, manage invitations, or check room availability. Camera access is available only during an authorized active stay.</div>
        </td></tr>
        <tr><td style="background:#f4f8f6;border-top:1px solid #e2ebe8;padding:22px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:bold;color:#183e43;">CareFur &bull; Snuggles Premium Pet Hotel</div>
          <div style="font-size:12px;line-height:1.7;color:#6a8182;margin-top:6px;">Didn't expect this invitation? You can safely ignore this email.<br>This mailbox is not monitored for replies.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => {
      throw new AccessError('Invalid request body', 400);
    });
    const { code, action, email: requestedEmail } = body ?? {};
    const { admin, user, booking, access, email: authenticatedEmail } = await authorizeBooking(req, code);

    // Owner-only. Legacy owner invitations may not have an owner_id or redeemed_at.
    // authorizeBooking already checks the cryptographic code hash, confirmed login email,
    // exact invited email, expiry, revocation and an optional non-null owner_id.
    if ((access.access_type ?? 'owner') !== 'owner') {
      throw new AccessError('Shared viewers cannot manage invitations.', 403);
    }
    if (!user.email_confirmed_at) {
      throw new AccessError('Confirm your email before managing invitations.', 403);
    }

    // Verify REAL pet ownership, independently of the boarding access code.
    const ownerResult = await admin.from('owners')
      .select('id,email')
      .ilike('email', authenticatedEmail)
      .limit(20);
    if (ownerResult.error) throw ownerResult.error;
    const ownerIds = (ownerResult.data ?? [])
      .filter((owner: {id: string; email?: string | null}) =>
        owner.email?.trim().toLowerCase() === authenticatedEmail)
      .map((owner: {id: string}) => owner.id);
    if (!ownerIds.length) {
      throw new AccessError('No CareFur owner record is linked to your confirmed email. Contact CareFur staff.', 403);
    }
    const links = await admin.from('pet_owner_links')
      .select('owner_id')
      .eq('pet_id', booking.pet_id)
      .in('owner_id', ownerIds);
    if (links.error) throw links.error;
    if (!(links.data ?? []).length) {
      throw new AccessError('Your owner email is not linked to the pet in this booking.', 403);
    }

    // Pending bookings can prepare sharing invitations. Viewing a live camera
    // remains restricted by separate active-stay authorization on the gateway.
    const state = String(booking.status ?? '').toLowerCase();
    if (!['pending', 'confirmed', 'checked_in'].includes(state) ||
        booking.actual_check_out_at ||
        !booking.expected_check_out_at ||
        Date.parse(booking.expected_check_out_at) <= Date.now()) {
      throw new AccessError('Sharing is available for pending, confirmed, or active boarding stays only.', 403);
    }

    const all = await admin.from('booking_access')
      .select('id,invited_email,redeemed_at,expires_at,revoked_at,access_type')
      .eq('booking_id', booking.id)
      .eq('access_type', 'shared')
      .order('created_at', { ascending: true });
    if (all.error) throw all.error;
    const live = (all.data ?? []).filter((row: any) =>
      !row.revoked_at && row.expires_at && Date.parse(row.expires_at) > Date.now());

    if (action === 'list') {
      return json({ invites: live.map((row: any) => ({
        id: row.id,
        invited_email: row.invited_email,
        redeemed_at: row.redeemed_at,
        expires_at: row.expires_at,
      })) });
    }

    const target = String(requestedEmail ?? '').trim().toLowerCase();
    if (!EMAIL.test(target) || target.length > 254) {
      throw new AccessError('Enter a valid invitation email address.', 400);
    }

    if (action === 'revoke') {
      const matching = live.find((row: any) => row.invited_email.trim().toLowerCase() === target);
      if (!matching) throw new AccessError('Invitation not found.', 404);
      const result = await admin.from('booking_access')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', matching.id)
        .eq('booking_id', booking.id)
        .eq('access_type', 'shared');
      if (result.error) throw result.error;
      return json({ status: 'revoked' });
    }

    if (action !== 'invite') throw new AccessError('Unsupported action.', 400);
    if (target === authenticatedEmail) throw new AccessError('You cannot invite your own email address.', 400);
    if (live.length >= 5) throw new AccessError('Only five active invitations per boarding are allowed.', 409);
    if (live.some((row: any) => row.invited_email.trim().toLowerCase() === target)) {
      throw new AccessError('That email already has active shared access.', 409);
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('CAREFUR_INVITE_FROM');
    if (!apiKey || !from) {
      throw new AccessError('Email invitations are not configured yet. Ask CareFur staff to configure the sender.', 503);
    }

    const invitationCode = generateCode();
    const expiry = new Date(Math.min(Date.parse(booking.expected_check_out_at), Date.parse(access.expires_at))).toISOString();
    const inserted = await admin.from('booking_access').insert({
      booking_id: booking.id,
      owner_id: null,
      invited_email: target,
      access_code_hash: await sha256(invitationCode),
      expires_at: expiry,
      access_type: 'shared',
    }).select('id').single();
    if (inserted.error) {
      if (inserted.error.code === '23505') throw new AccessError('An active invitation already exists.', 409);
      throw inserted.error;
    }

    // Pet name is presentation-only; authorization remains checked above.
    const petResult = await admin.from('pets').select('name').eq('id', booking.pet_id).maybeSingle();
    const petName = petResult.data?.name || 'your pet';
    const expiryLabel = formatExpiry(expiry);
    const emailText = [
      'CAREFUR | SNUGGLES PREMIUM PET HOTEL',
      '',
      `You've been invited to follow ${petName}'s boarding stay.`,
      '',
      `Sign in using this exact email: ${target}`,
      `Your personal boarding access code: ${invitationCode}`,
      `Expires: ${expiryLabel} (Philippine time)`,
      '',
      'Open the CareFur App, sign in with the invited email, and choose Enter Boarding Code.',
      '',
      'Shared access is read only. You may view permitted pet information, feeding updates, and authorized live camera access. You cannot edit pet or account information, message staff, browse room availability, or manage invitations.',
      '',
      'If you did not expect this invitation, you can safely ignore this email.',
      'CareFur | Snuggles Premium Pet Hotel',
    ].join('\n');

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [target],
          subject: `CareFur Invitation | Follow ${petName}'s Boarding Stay`,
          text: emailText,
          html: invitationHtml(target, invitationCode, expiryLabel, petName),
        }),
      });
      if (!response.ok) {
        const failure = await response.text();
        console.error('Invitation email provider rejected request', response.status, failure.slice(0, 500));
        throw new Error('Invitation email delivery failed');
      }
    } catch (error) {
      // Never leave a valid code in the database if email delivery could not be confirmed.
      const rollback = await admin.from('booking_access').update({ revoked_at: new Date().toISOString() })
        .eq('id', inserted.data.id).eq('access_type', 'shared');
      if (rollback.error) console.error('Could not revoke failed invitation', rollback.error);
      throw new AccessError('Invitation email could not be sent. Check your email provider settings.', 503);
    }

    return json({ status: 'sent' });
  } catch (error) {
    return handleError(error);
  }
});
