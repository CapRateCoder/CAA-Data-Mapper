import React, { useCallback, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataLoaded: (headers: string[], data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse sheet to JSON (header: 1 returns array of arrays)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (jsonData && jsonData.length > 0) {
          // First row is headers
          const headers = jsonData[0] as string[];
          
          // Remaining rows are data
          const rows = jsonData.slice(1).map((row: any) => {
            const rowData: Record<string, any> = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            return rowData;
          });

          // Filter out empty rows if any
          const validRows = rows.filter(row => Object.values(row).some(val => val !== ''));

          onDataLoaded(headers, validRows);
        }
      } catch (error) {
        console.error("Excel Parse Error:", error);
        alert("Error parsing Excel file. Please ensure it is a valid .xlsx or .xls file.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFile = useCallback((file: File) => {
    setIsProcessing(true);

    // CSV / Text Handling
    if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setIsProcessing(false);
          if (results.meta.fields && results.data.length > 0) {
            onDataLoaded(results.meta.fields, results.data);
          }
        },
        error: (error) => {
          setIsProcessing(false);
          console.error("CSV Parse Error:", error);
          alert("Error parsing CSV file.");
        }
      });
    } 
    // Excel Handling
    else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      processExcel(file);
    } 
    else {
      setIsProcessing(false);
      alert("Please upload a .csv, .txt, .xlsx, or .xls file.");
    }
  }, [onDataLoaded]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer shadow-sm
        bg-white dark:bg-slate-900 
        border-slate-300 dark:border-slate-700
        hover:border-blue-500 dark:hover:border-blue-400
        group
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept=".csv,.txt,.xlsx,.xls" 
        onChange={onFileChange} 
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform duration-200">
          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : (
            <div className="relative">
              <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400 absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {isProcessing ? 'Processing File...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Supported formats: CSV, TXT, XLSX, XLS
          </p>
        </div>
      </div>
    </div>
  );
};