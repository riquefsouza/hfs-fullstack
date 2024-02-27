export interface ItypeReport {
  type: string;
  typeContent: string;
  description: string;
}

export interface SelectItemGroup {
  id: number; 
  label: string;
  value?: ItypeReport;
  items?: SelectItemGroup[];
}

export const PDFReport = { type: 'PDF', typeContent: 'application/pdf', description: 'Portable Document Format (.pdf)' };

export class ReportService {

  private typeReport: SelectItemGroup[];

  constructor() {

    this.typeReport = [
      {
        id: 1,
        label: 'Documents',
        items: [
          {
            id: 11,
            label: 'Portable Document Format (.pdf)',
            value: PDFReport
          },
          {
            id: 12,
            label: 'Microsoft Word XML (.docx)',
            value: {
              type: 'DOCX',
              typeContent: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              description: 'Microsoft Word XML (.docx)'
            }
          },
          {
            id: 13,
            label: 'Rich Text Format (.rtf)',
            value: { type: 'RTF', typeContent: 'application/rtf', description: 'Rich Text Format (.rtf)' }
          },
          {
            id: 14,
            label: 'OpenDocument Text (.odt)',
            value: {
              type: 'ODT', typeContent: 'application/vnd.oasis.opendocument.text',
              description: 'OpenDocument Text (.odt)'
            }
          }
        ]
      },
      {
        id: 2,
        label: 'Spreadsheets',
        items: [
          {
            id: 21,
            label: 'Microsoft Excel XML (.xlsx)',
            value: {
              type: 'XLSX', typeContent: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              description: 'Microsoft Excel XML (.xlsx)'
            }
          },
          {
            id: 22,
            label: 'OpenDocument Spreadsheet (.ods)',
            value: {
              type: 'ODS', typeContent: 'application/vnd.oasis.opendocument.spreadsheet',
              description: 'OpenDocument Spreadsheet (.ods)'
            }
          }
        ]
      },
      {
        id: 3,
        label: 'Pure Text',
        items: [
          {
            id: 31,
            label: 'Comma Separated Values (.csv)',
            value: {
              type: 'CSV', typeContent: 'text/plain',
              description: 'Comma Separated Values (.csv)'
            }
          },
          {
            id: 32,
            label: 'Text Only (.txt)',
            value: {
              type: 'TXT', typeContent: 'text/plain',
              description: 'Text Only (.txt)'
            }
          }
        ]
      },
      {        
        id: 4,
        label: 'Others',
        items: [
          {
            id: 41,
            label: 'Microsoft Powerpoint XML (.pptx)',
            value: {
              type: 'PPTX',
              typeContent: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              description: 'Microsoft Powerpoint XML (.pptx)'
            }
          },
          {
            id: 42,
            label: 'Hypertext Markup Language (.html)',
            value: {
              type: 'HTML',
              typeContent: 'application/zip',
              description: 'Hypertext Markup Language (.html)'
            }
          }
        ]
      }
    ];

  }

  public getTypeReport(): SelectItemGroup[] {
    return this.typeReport;
  }
}