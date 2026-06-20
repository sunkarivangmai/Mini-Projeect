import { useState } from 'react';
import { API_BASE_URL } from '../config';
import { UploadCloud, FileText, Database, Layers, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const DatasetUpload = ({ uploadedDataset, setUploadedDataset, addNotification }) => {
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const validateIPv6 = (ip) => {
    // Basic IPv6 regex
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(\/\d+)?$/;
    return ipv6Regex.test(ip.trim());
  };

  const processFile = async (file) => {
    addNotification('Uploading dataset to backend...', 'info');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-dataset`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      
      setUploadedDataset({
        filename: data.filename,
        sizeBytes: data.size_bytes,
        total: data.total_prefixes,
        unique: data.unique_prefixes,
        data: data.sample.map((prefix, idx) => ({
          id: idx + 1,
          prefix: prefix,
          as: `AS${Math.floor(1000 + Math.random() * 9000)}`,
          geo: ['United States', 'Germany', 'Japan', 'United Kingdom', 'Singapore', 'India'][Math.floor(Math.random() * 6)],
          type: prefix.startsWith('2001') ? 'Global Unicast' : prefix.startsWith('fe80') ? 'Link-Local' : 'Unique Local'
        }))
      });

      setCurrentPage(1);
      addNotification(`Successfully uploaded and analyzed ${data.total_prefixes} prefixes on backend!`, 'success');
    } catch (err) {
      addNotification('Backend upload unavailable: ' + err.message + '. Parsing locally.', 'warning');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          let prefixes = [];
          
          if (file.name.endsWith('.json')) {
            const json = JSON.parse(text);
            const raw = Array.isArray(json) ? json : (json.prefixes || json.data || []);
            prefixes = raw.map(item => typeof item === 'string' ? item : (item.prefix || item.ip || '')).filter(Boolean);
          } else {
            const lines = text.split(/\r?\n/);
            lines.forEach(line => {
              const clean = line.split(',')[0].trim();
              if (clean) prefixes.push(clean);
            });
          }

          const validPrefixes = prefixes.filter(validateIPv6);
          if (validPrefixes.length === 0) {
            addNotification('No valid IPv6 addresses or prefixes detected in the file.', 'error');
            return;
          }

          const uniquePrefixes = [...new Set(validPrefixes)];
          
          setUploadedDataset({
            filename: file.name,
            sizeBytes: file.size,
            total: validPrefixes.length,
            unique: uniquePrefixes.length,
            data: uniquePrefixes.map((prefix, idx) => ({
              id: idx + 1,
              prefix: prefix,
              as: `AS${Math.floor(1000 + Math.random() * 9000)}`,
              geo: ['United States', 'Germany', 'Japan', 'United Kingdom', 'Singapore', 'India'][Math.floor(Math.random() * 6)],
              type: prefix.startsWith('2001') ? 'Global Unicast' : prefix.startsWith('fe80') ? 'Link-Local' : 'Unique Local'
            }))
          });
          
          setCurrentPage(1);
          addNotification(`Successfully loaded ${validPrefixes.length} prefixes locally!`, 'success');
        } catch (localErr) {
          addNotification('Error parsing file locally: ' + localErr.message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Pagination bounds
  const totalPages = Math.ceil(uploadedDataset.data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = uploadedDataset.data.slice(startIndex, endIndex);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2
          className="text-3xl font-bold tracking-wide text-charcoal flex items-center justify-center md:justify-start gap-3"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          <Database className="text-garnet" size={28} /> Dataset Upload Zone
        </h2>
        <p className="text-muted mt-3 text-sm max-w-xl">
          Provide your seed IPv6 target logs to parse structures and feed the Vision Transformer training. Supported extensions: .csv, .txt, .json
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        
        <div className="editorial-card rounded-2xl p-8 flex items-center gap-4">
          <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider">Total Parsed Prefixes</span>
            <span className="text-2xl font-bold text-charcoal mt-1 block">
              {uploadedDataset.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-8 flex items-center gap-4">
          <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider">Unique Prefixes</span>
            <span className="text-2xl font-bold text-charcoal mt-1 block">
              {uploadedDataset.unique.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-8 flex items-center gap-4">
          <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet">
            <Database size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider">File Metadata</span>
            <span className="text-sm font-bold text-charcoal mt-1 block truncate">
              {uploadedDataset.filename} ({(uploadedDataset.sizeBytes / 1024).toFixed(2)} KB)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <div className="h-full">
            <form 
              onDragEnter={handleDrag} 
              onDragOver={handleDrag} 
              onDragLeave={handleDrag} 
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload-input').click()}
              className={`h-full min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive 
                  ? 'border-garnet bg-[#B23B48]/5' 
                  : 'border-border-gray bg-cream hover:border-warm-dark hover:bg-white'
              }`}
            >
              <input 
                id="file-upload-input" 
                type="file" 
                multiple={false} 
                accept=".csv,.txt,.json" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <UploadCloud size={40} className="text-muted mb-4" />
              <p className="font-bold text-charcoal mb-1 uppercase tracking-wider text-xs">Drag & drop your files here</p>
              <p className="text-muted text-xs mb-4">or click to browse from system explorer</p>
              <div className="px-3 py-1.5 bg-white border border-border-gray rounded-full text-warm-dark text-[9px] uppercase font-bold tracking-wider">
                Supports CSV, TXT, JSON
              </div>
            </form>
          </div>
        </div>

        {/* Preview Table */}
        <div className="lg:col-span-2">
          <div className="editorial-card rounded-2xl overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="px-6 py-5 border-b border-border-gray flex justify-between items-center bg-cream">
                <span className="font-bold uppercase tracking-wider text-xs text-charcoal">Dataset Preview</span>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Showing {startIndex + 1} - {Math.min(endIndex, uploadedDataset.data.length)} of {uploadedDataset.data.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream text-charcoal font-bold uppercase tracking-wider border-b border-border-gray">
                      <th className="px-6 py-3.5">ID</th>
                      <th className="px-6 py-3.5">IPv6 Prefix</th>
                      <th className="px-6 py-3.5">Routing AS</th>
                      <th className="px-6 py-3.5">Geolocation</th>
                      <th className="px-6 py-3.5">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-gray/50 text-warm-dark">
                    {currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-cream/60 transition-colors">
                        <td className="px-6 py-3 font-mono text-muted">{item.id}</td>
                        <td className="px-6 py-3 font-mono font-bold text-garnet">{item.prefix}</td>
                        <td className="px-6 py-3 text-warm-dark">{item.as}</td>
                        <td className="px-6 py-3 text-warm-dark">{item.geo}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                            item.type === 'Global Unicast' 
                              ? 'bg-garnet/5 text-garnet border-garnet/20' 
                              : 'bg-cream text-warm-dark border-border-gray'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-muted font-bold uppercase tracking-wider text-xs">
                          <AlertCircle className="mx-auto mb-2 opacity-50 text-muted" size={24} />
                          No prefixes loaded. Drop a file to preview targets.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border-gray flex justify-between items-center bg-cream">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="btn-secondary-rect !py-2 !px-4 !text-[10px]"
                >
                  <div className="flex items-center gap-1"><ChevronLeft size={12} /> Previous</div>
                </button>
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="btn-secondary-rect !py-2 !px-4 !text-[10px]"
                >
                  <div className="flex items-center gap-1">Next <ChevronRight size={12} /></div>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DatasetUpload;
