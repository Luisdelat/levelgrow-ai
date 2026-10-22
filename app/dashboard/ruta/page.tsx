'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { fetchProgress } from '@/lib/api-client';
import { STAGE_IDS, stageHref } from '@/lib/stages';

/** Sends the user to the next stage they haven't completed. */
function RouteRedirect() {
  const router = useRouter();
  useEffect(() => {
    fetchProgress()
      .then((p) => {
        const next = STAGE_IDS.find((id) => !p.completed.includes(id));
        router.replace(next ? stageHref(next) : '/dashboard/plan');
      })
      .catch(() => router.replace('/dashboard'));
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );
}

export default function RoutePage() {
  return (
    <AppShell>
      <RouteRedirect />
    </AppShell>
  );
}
