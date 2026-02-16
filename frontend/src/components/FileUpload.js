import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { importSalesData } from '../store/slices/salesSlice';

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
      <Box sx={{ mb: 2 }}>
        <input
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
          id="file-upload-input"
          type="file"
          onChange={handleFileChange}
          disabled={loading}
        />
        <label htmlFor="file-upload-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          sx={{ ml: 2 }}
        >
          Upload
        </Button>
      </Box>

      {fileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fileError}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Supported formats: CSV, XLS, XLSX (Max size: 10MB)
      </Typography>
    </Box>
  );
};

export default FileUpload;
