import React from 'react';
import { FileText } from 'lucide-react';
import { Quote } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuotesViewProps {
  quotes: Quote[];
  onCreateQuote: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  quotes,
  onCreateQuote
}) => {
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
              <Button onClick={onCreateQuote}>
                Create Quote
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map(quote => (
                <div key={quote.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground">{quote.quoteNumber}</h4>
                      <p className="text-sm text-muted-foreground">Project: {quote.projectId}</p>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {quote.validUntil.toLocaleDateString('en-AU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${quote.total.toLocaleString('en-AU')}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};