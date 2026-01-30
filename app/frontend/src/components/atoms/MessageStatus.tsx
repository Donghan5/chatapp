interface MessageStatusProps {
  status?: 'sent' | 'delivered' | 'read' | 'deleted';
}

export const MessageStatusIcon = ({ status }: MessageStatusProps) => {
  // No icon for deleted messages
  if (!status || status === 'deleted') return null;
  
  // Single checkmark for "sent"
  if (status === 'sent') {
    return (
      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
      </svg>
    );
  }
  // Double checkmark for "delivered" (gray)
  if (status === 'delivered') {
    return (
      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
      </svg>
    );
  }
  // Double checkmark for "read" (blue)
  if (status === 'read') {
    return (
      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
      </svg>
    );
  }
  return null;
}