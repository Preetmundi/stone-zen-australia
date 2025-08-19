import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  quote: any;
}

export const EmailModal: React.FC<EmailModalProps> = ({ open, onClose, onSend, quote }) => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTo('');
    setMessage('');
  }, [open, quote]);

  if (!quote) return null;

  const handleSend = () => {
    const subject = encodeURIComponent(`Quote ${quote.quoteNumber}`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease find your quote details below:\n\nQuote Number: ${quote.quoteNumber}\nTotal: $${quote.total.toLocaleString('en-AU')}\nStatus: ${quote.status}\nValid Until: ${quote.validUntil.toLocaleDateString('en-AU')}\n\n${message}`
    );
    window.open(`mailto:${to}?subject=${subject}&body=${body}`);
    onSend();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Quote</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Recipient Email</label>
            <input className="border px-2 py-1 rounded w-full" type="email" value={to} onChange={e => setTo(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea className="border px-2 py-1 rounded w-full" value={message} onChange={e => setMessage(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button type="submit">Send Email</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
