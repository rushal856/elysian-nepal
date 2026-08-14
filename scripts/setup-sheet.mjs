import { google } from 'googleapis';

const sheetId = process.env.GOOGLE_SHEET_ID;
const tabName = process.env.GOOGLE_SHEET_TAB_NAME || 'sheet1';
const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!sheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) throw new Error('Google Sheets environment variables are missing.');

const auth = new google.auth.JWT({ email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: privateKey, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const sheets = google.sheets({ version: 'v4', auth });
const headers = ['Order ID','Date & Time','Customer Name','Phone Number','Email Address','Exact Location','Product Name','Quantity','Price Per Piece','Total Price','Payment Method','Order Status','Notes'];

let meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
let tab = meta.data.sheets?.find((sheet) => sheet.properties?.title === tabName);
if (!tab) {
  await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] } });
  meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  tab = meta.data.sheets?.find((sheet) => sheet.properties?.title === tabName);
}
const sheetIndex = tab?.properties?.sheetId;
if (sheetIndex === undefined) throw new Error('Could not find the selected sheet tab.');

const existing = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: `${tabName}!A1:M1` });
if (!existing.data.values?.[0]?.length) await sheets.spreadsheets.values.update({ spreadsheetId: sheetId, range: `${tabName}!A1:M1`, valueInputOption: 'RAW', requestBody: { values: [headers] } });

const dark = { red: 0.16, green: 0.10, blue: 0.07 };
const gold = { red: 0.70, green: 0.54, blue: 0.30 };
const widths = [145,150,170,140,210,260,160,85,130,125,140,155,210];
const requests = [
  { updateSheetProperties: { properties: { sheetId: sheetIndex, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
  { repeatCell: { range: { sheetId: sheetIndex, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 13 }, cell: { userEnteredFormat: { backgroundColor: dark, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 10 }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } }, fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)' } },
  { updateDimensionProperties: { range: { sheetId: sheetIndex, dimension: 'ROWS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 40 }, fields: 'pixelSize' } },
  { setBasicFilter: { filter: { range: { sheetId: sheetIndex, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: 13 } } } },
  { setDataValidation: { range: { sheetId: sheetIndex, startRowIndex: 1, endRowIndex: 5000, startColumnIndex: 11, endColumnIndex: 12 }, rule: { condition: { type: 'ONE_OF_LIST', values: ['New Order','Order Confirmed','Order Ongoing','Delivered','Cancelled'].map((userEnteredValue) => ({ userEnteredValue })) }, showCustomUi: true, strict: true } } },
  { addConditionalFormatRule: { rule: { ranges: [{ sheetId: sheetIndex, startRowIndex: 1, endRowIndex: 5000, startColumnIndex: 11, endColumnIndex: 12 }], booleanRule: { condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'New Order' }] }, format: { backgroundColor: { red: 1, green: 0.93, blue: 0.78 }, textFormat: { bold: true, foregroundColor: gold } } } }, index: 0 } },
  { addConditionalFormatRule: { rule: { ranges: [{ sheetId: sheetIndex, startRowIndex: 1, endRowIndex: 5000, startColumnIndex: 11, endColumnIndex: 12 }], booleanRule: { condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Delivered' }] }, format: { backgroundColor: { red: 0.86, green: 0.94, blue: 0.84 }, textFormat: { bold: true, foregroundColor: { red: 0.20, green: 0.45, blue: 0.20 } } } } }, index: 1 } },
];
for (let index = 0; index < widths.length; index++) requests.push({ updateDimensionProperties: { range: { sheetId: sheetIndex, dimension: 'COLUMNS', startIndex: index, endIndex: index + 1 }, properties: { pixelSize: widths[index] }, fields: 'pixelSize' } });
await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests } });
console.log(`Configured the ${tabName} tab with premium order headers, filters, widths, and status dropdowns.`);
