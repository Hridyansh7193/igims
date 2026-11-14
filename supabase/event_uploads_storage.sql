-- Run once in Supabase -> SQL Editor (after event_form_responses.sql).
-- Private bucket for ID proofs / payment screenshots uploaded in event forms.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-uploads', 'event-uploads', false, 5242880,
        array['image/jpeg','image/png','image/webp','image/gif','image/heic','application/pdf'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Each user can upload and read only inside their own folder: <user_id>/...
drop policy if exists "eu_insert_own" on storage.objects;
create policy "eu_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-uploads' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "eu_select_own" on storage.objects;
create policy "eu_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'event-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
