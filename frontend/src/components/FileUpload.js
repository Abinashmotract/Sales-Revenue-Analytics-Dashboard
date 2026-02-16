import React, { useState } from 'react';
import { Box, Typography, LinearProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { importSalesData } from '../store/slices/salesSlice';
import './FileUpload.css';

const FileUpload = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.sales);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError('');

    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setFileError('Please upload a CSV or Excel file');
      setSelectedFile(null);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setFileError('Please select a file');
      return;
    }

    setFileError('');
    dispatch(importSalesData(selectedFile));
    setSelectedFile(null);
    // Reset file input
    document.getElementById('file-upload-input').value = '';
  };

  return (
    <Box>
      <input
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        id="file-upload-input"
        type="file"
        onChange={handleFileChange}
        disabled={loading}
      />
      <label htmlFor="file-upload-input" className="file-label">
        <i className="fas fa-cloud-upload-alt"></i> import csv / excel
      </label>
      {selectedFile && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#a0c2e8', display: 'inline-block', mr: 2 }}>
            Selected: {selectedFile.name}
          </Typography>
          <button onClick={handleUpload} disabled={loading} className="upload-btn">
            {loading ? <i className="fas fa-sync-alt fa-spin"></i> : <i className="fas fa-upload"></i>} Upload
          </button>
        </Box>
      )}

      {fileError && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2, 
            backgroundColor: 'rgba(238, 102, 102, 0.2)',
            color: '#ffaaaa',
            border: '1px solid #ee6666',
            backdropFilter: 'blur(10px)'
          }}
        >
          {fileError}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              backgroundColor: 'rgba(60, 169, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3ca9ff'
              }
            }} 
          />
        </Box>
      )}

      <Typography variant="body2" sx={{ mt: 1, color: '#9abde0', fontSize: '0.85rem' }}>
        Supported formats: CSV, XLS, XLSX (Max size: 10MB)
      </Typography>
    </Box>
  );
};

export default FileUpload;
