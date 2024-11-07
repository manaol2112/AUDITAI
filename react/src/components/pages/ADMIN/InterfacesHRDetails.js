import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SFTPService from '../../../services/SFTPService';
import axios from 'axios';
import DenseTable from '../../common/Table';
import { format } from 'date-fns'; // Import date-fns for date formatting

const InterfacesHRDetails = () => {
    const [data, setData] = useState([]);

    const fetchHRImportLog = async () => {
        try {
            const response = await SFTPService.fetchHRDataImportLog();
            const formattedData = response.data.map(item => ({
                ...item,
                IMPORT_DATE: format(new Date(item.IMPORT_DATE), 'MM/dd/yyyy'), 
                JOB_COMPLETE: item.JOB_COMPLETE ? 'Complete' : 'Incomplete' 
            }));


             // Calculate file_name counts
        const fileNameCounts = {};
        formattedData.forEach(item => {
            if (fileNameCounts[item.FILE_NAME]) {
                fileNameCounts[item.FILE_NAME]++;
            } else {
                fileNameCounts[item.FILE_NAME] = 1;
            }
        });

        // Add counts to formattedData
        formattedData.forEach(item => {
            item.DESTI_LINE_COUNT = fileNameCounts[item.FILE_NAME];
        });

            formattedData.sort((a, b) => new Date(b.IMPORT_DATE) - new Date(a.IMPORT_DATE));

            setData(formattedData);
    
        } catch (error) {
            console.error('Error fetching hr data log:', error);
        }
    };

    useEffect(() => {
        fetchHRImportLog();
    }, []);

    const columns = [
        { id: 'JOB_NAME', label: 'Job Name', align: 'center' },
        { id: 'IMPORT_DATE', label: 'Import Date (MM/DD/YYYY)', align: 'center' },
        { id: 'FILE_NAME', label: 'File Name', align: 'center' },
        { id: 'SOURCE_LINE_COUNT', label: 'Source File Count', align: 'center' },
        { id: 'DESTI_LINE_COUNT', label: 'System Record Count', align: 'center' },
        { id: 'JOB_COMPLETE', label: 'Import Status', align: 'center' },
        { id: 'UPLOADED_BY', label: 'Created By', align: 'center' },
    ];

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        Dashboard
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        System Settings
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Interfaces">
                        Data Sources
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Interfaces/HR/Home">
                        HR Data
                    </mui.Link>
                    <mui.Typography color="text.primary">HR Data Import Logs</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="HR Data Import Log" icon={<BackupTableIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and download hr data import log
                </mui.Typography>
                <div style={{marginTop: '30px'}}>
                {data.length > 0 ? (
                    <DenseTable columns={columns} rows={data} />
                ) : (
                    <p>Loading HR Data Log...</p>
                )}

                </div>

            </ResponsiveContainer>
        </div>

    )

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
}
export default InterfacesHRDetails;
