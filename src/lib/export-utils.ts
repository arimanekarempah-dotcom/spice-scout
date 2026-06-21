
import { Business } from './types';

export function exportLeadsToCsv(leads: Business[]) {
  const headers = [
    'Business Name',
    'Address',
    'Phone',
    'Website',
    'Distance (km)',
    'Rating',
    'AI Confidence',
    'AI Type',
    'Search Date'
  ];

  const rows = leads.map(lead => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.address.replace(/"/g, '""')}"`,
    lead.phone || '',
    lead.website || '',
    lead.distance,
    lead.rating,
    `${lead.aiConfidence || 0}%`,
    lead.aiBusinessType || '',
    new Date().toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `spicescout-leads-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
