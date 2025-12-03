import { getTranslations } from 'next-intl/server';

import { ChatInterface } from '@/components/chat/ChatInterface';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Chat',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ChatPage() {
  // Auth handled by middleware - no need to redirect here
  return <ChatInterface />;
}

export const dynamic = 'force-dynamic';
