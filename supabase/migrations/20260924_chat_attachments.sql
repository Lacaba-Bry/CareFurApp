-- CareFur chat attachment storage.
-- Run once in Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do update set public = true;

-- Owners upload only inside their own auth.uid() folder.
drop policy if exists "carefur owners upload chat attachments" on storage.objects;
create policy "carefur owners upload chat attachments"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'chat-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "carefur owners read chat attachments" on storage.objects;
create policy "carefur owners read chat attachments"
on storage.objects for select
to authenticated
using (bucket_id = 'chat-attachments');

-- Public bucket URLs are used in message payloads. If you later make the bucket
-- private, replace getPublicUrl() in ChatScreen with signed URLs.
