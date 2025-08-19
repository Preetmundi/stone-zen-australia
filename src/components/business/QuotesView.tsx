import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useApi } from '@/lib/api';
import { Quote } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
// Placeholder for QuotePDFDocument (to be implemented)
const QuotePDFDocument = ({ quote }: any) => null;
// Placeholder for EmailModal (to be implemented)
const EmailModal = ({ open, onClose, onSend, quote }: any) => null;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface QuotesViewProps {
  quotes: Quote[];
  onCreateQuote: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  onCreateQuote
}) => {
  const api = useApi();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewQuote, setViewQuote] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailQuote, setEmailQuote] = useState(null);

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/quotes');
      setQuotes(data);
    } catch (err) {
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      const quote = quotes.find((q: any) => q.id === quoteId);
      await api.put(`/api/quotes/${quoteId}`, { ...quote, status: newStatus });
      fetchQuotes();
    } catch {
      setError('Failed to update quote status');
    }
  };
  const handleEmail = (quote: any) => {
    setEmailQuote(quote);
    setEmailModalOpen(true);
  };

  if (loading) return <div>Loading quotes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
        <Button onClick={onCreateQuote} className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Create Quote
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quote Management</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No quotes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first quote to get started</p>
              <Button onClick={onCreateQuote}>Create Quote</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map(quote => (
                <div key={quote.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground cursor-pointer" onClick={() => setViewQuote(quote)}>{quote.quoteNumber}</h4>
                      <p className="text-sm text-muted-foreground">Project: {quote.projectId}</p>
                      <p className="text-sm text-muted-foreground">Valid until: {quote.validUntil.toLocaleDateString('en-AU')}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-foreground">${quote.total.toLocaleString('en-AU')}</p>
                      <select value={quote.status} onChange={e => handleStatusChange(quote.id, e.target.value)} className="border px-2 py-1 rounded">
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                      <div className="flex gap-2 mt-2">
                        <PDFDownloadLink document={<QuotePDFDocument quote={quote} />} fileName={`${quote.quoteNumber}.pdf`}>
                          {({ loading }) => <Button size="sm" variant="outline">{loading ? 'Loading PDF...' : 'Download PDF'}</Button>}
                        </PDFDownloadLink>
                        <Button size="sm" variant="outline" onClick={() => handleEmail(quote)}>Email</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog for Quote Details */}
      <Dialog open={!!viewQuote} onOpenChange={open => !open && setViewQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
          </DialogHeader>
          {viewQuote && (
            <div>
              <p><b>Quote Number:</b> {viewQuote.quoteNumber}</p>
              <p><b>Status:</b> {viewQuote.status}</p>
              <p><b>Total:</b> ${viewQuote.total.toLocaleString('en-AU')}</p>
              <p><b>Valid Until:</b> {viewQuote.validUntil.toLocaleDateString('en-AU')}</p>
              {/* Add more details as needed */}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal for Emailing Quote */}
      <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} onSend={() => setEmailModalOpen(false)} quote={emailQuote} />
    </div>
  );
};