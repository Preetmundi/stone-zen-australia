import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  table: { display: 'table', width: 'auto', marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  tableCellHeader: { fontWeight: 'bold', padding: 4, borderBottom: '1 solid #000', width: '20%' },
  tableCell: { padding: 4, borderBottom: '1 solid #ccc', width: '20%' },
});

const QuotePDFDocument = ({ quote }: { quote: any }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Quote</Text>
        <Text>Quote Number: {quote.quoteNumber}</Text>
        <Text>Status: {quote.status}</Text>
        <Text>Total: ${quote.total.toLocaleString('en-AU')}</Text>
        <Text>Valid Until: {quote.validUntil.toLocaleDateString('en-AU')}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Items</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Description</Text>
            <Text style={styles.tableCellHeader}>Category</Text>
            <Text style={styles.tableCellHeader}>Quantity</Text>
            <Text style={styles.tableCellHeader}>Unit Price</Text>
            <Text style={styles.tableCellHeader}>Total Price</Text>
          </View>
          {quote.items.map((item: any) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.category}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>${item.unitPrice.toLocaleString('en-AU')}</Text>
              <Text style={styles.tableCell}>${item.totalPrice.toLocaleString('en-AU')}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text>Subtotal: ${quote.subtotal.toLocaleString('en-AU')}</Text>
        <Text>GST: ${quote.gst.toLocaleString('en-AU')}</Text>
        <Text>Total: ${quote.total.toLocaleString('en-AU')}</Text>
      </View>
      <View style={styles.section}>
        <Text>Terms: {quote.terms}</Text>
      </View>
    </Page>
  </Document>
);

export default QuotePDFDocument;
