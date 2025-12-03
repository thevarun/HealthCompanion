import type { ReactNode } from 'react';

export default function ChatLayout(props: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {props.children}
    </div>
  );
}
