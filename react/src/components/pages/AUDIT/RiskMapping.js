import React, { useState, useRef, useEffect, Suspense } from 'react';
import IASideBar from './IASideBar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import ReviewsRoundedIcon from '@mui/icons-material/ReviewsRounded';
import auditService from '../../../services/AuditService';
import { useParams } from 'react-router-dom';
import NormalTextField from '../../common/NormalTextField';
import CellTowerRoundedIcon from '@mui/icons-material/CellTowerRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import DataTable from '../../common/DataGrid';
import Tooltip from '@mui/material/Tooltip';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';

import appService from '../../../services/ApplicationService';
import DynamicTabs from '../../common/DynamicTabs';
import LinkIcon from '@mui/icons-material/Link';
import MultipleSelect from '../../common/MultipleSelect';
import Select from 'react-select';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VerticalTabs from '../../common/VerticalTab';
import Divider from '@mui/material/Divider';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AddchartIcon from '@mui/icons-material/Addchart';
import Chip from '@mui/material/Chip';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Alert } from 'bootstrap';
import AddLinkIcon from '@mui/icons-material/AddLink';
import StarIcon from '@mui/icons-material/Star';
import ReportIcon from '@mui/icons-material/Report';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ScaleIcon from '@mui/icons-material/Scale';
import SpeedIcon from '@mui/icons-material/Speed';
import InsightsIcon from '@mui/icons-material/Insights';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Modal from '../../common/Modal';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import companyService from '../../../services/CompanyService';
import GppBadIcon from '@mui/icons-material/GppBad';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';


const RiskMapping = () => {
    const [selectedApp, setSelectedApp] = useState([])
    const [apps, setApps] = useState([])
    const [risks, setRisks] = useState([])
    const [controls, setControls] = useState([])
    const [operatingSystem, setOperatingSystem] = useState([])
    const [database, setDatabase] = useState([])
    const [network, setNetwork] = useState([])
    const [mappedRisk, setMappedRisk] = useState([])
    const [bp_mapping, setBPMapping] = useState([])
    const [bp_risk_list, setBPRiskList] = useState([])
    const [it_risk_list, setITRiskList] = useState([])
    const [operational_risk_list, setOperationalRiskList] = useState([])
    const [entity_risk_list, setEntityRiskList] = useState([])
    const [it_mapping, setITMapping] = useState([])
    const [ops_mapping, setOPSMapping] = useState([])
    const [entity_mapping, setEntityMapping] = useState([])
    const [riskRating, setRiskRating] = useState([])
    const [selectedRating, setSelectedRating] = useState([]);
    const [rating, setRating] = useState([]);
    const [ratingRationale, setRatingRationale] = useState(null);
    const saveTimeout = useRef(null);



    const [openModal, setOpenModal] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState([])
    const [selectedITRisk, setSelectedITRisk] = useState([])
    const [firstRisk, setFirstRisk] = useState([])
    const [selectedCompany, setSelectedCompany] = useState([])
    const [selectedControls, setSelectedControls] = useState([])
    const [mappedControls, setMappedControls] = useState([])
    const { company_id,id } = useParams();

    const [openBPRiskList, setOpenBPRiskList] = useState(true);
    const [openITRiskList, setOpenITRiskList] = useState(true);
    const [openOperationalRiskList, setOpenOperationalRiskList] = useState(true);
    const [openEntityRiskList, setOpenEntityRiskList] = useState(true);

    //BUSINESS
    const [openBPHR, setOpenBPHR] = useState(true);
    const [openBPMR, setOpenBPMR] = useState(true);
    const [openBPLR, setOpenBPLR] = useState(true);

    const [riskmappingBPHR, setRiskMappingBPHR] = useState([])
    const [riskmappingBPMR, setRiskMappingBPMR] = useState([])
    const [riskmappingBPLR, setRiskMappingBPLR] = useState([])

     //IT
    const [openITHR, setOpenITHR] = useState(true);
    const [openITMR, setOpenITMR] = useState(true);
    const [openITLR, setOpenITLR] = useState(true);

    const [riskmappingITHR, setRiskMappingITHR] = useState([])
    const [riskmappingITMR, setRiskMappingITMR] = useState([])
    const [riskmappingITLR, setRiskMappingITLR] = useState([])

    //OPERATIONAL
    const [openOperationalHR, setOpenOperationalHR] = useState(true);
    const [openOperationalMR, setOpenOperationalMR] = useState(true);
    const [openOperationalLR, setOpenOperationalLR] = useState(true);

    const [riskmappingOperationalHR, setRiskMappingOperationalHR] = useState([])
    const [riskmappingOperationalMR, setRiskMappingOperationalMR] = useState([])
    const [riskmappingOperationalLR, setRiskMappingOperationalLR] = useState([])

    //ENTITY
    const [openEntityHR, setOpenEntityHR] = useState(true);
    const [openEntityMR, setOpenEntityMR] = useState(true);
    const [openEntityLR, setOpenEntityLR] = useState(true);

    const [riskmappingEntityHR, setRiskMappingEntityHR] = useState([])
    const [riskmappingEntityMR, setRiskMappingEntityMR] = useState([])
    const [riskmappingEntityLR, setRiskMappingEntityLR] = useState([])


    const [sidebarVisible, setSidebarVisible] = useState(true);


    //RISK LIBRARY
    const bp_risk = risks.filter(risk => risk.RISK_TYPE === 'Business Process');
    const it_risk = risks.filter(risk => risk.RISK_TYPE === 'IT');
    const operational_risk = risks.filter(risk => risk.RISK_TYPE === 'Operational');
    const entity_risk = risks.filter(risk => risk.RISK_TYPE === 'Entity Level');

    useEffect(() => {
        const fetchAppByID = async () => {
            try {

                const appRecord = await appService.fetchAppsById(id)

                if (appRecord) {
                    setSelectedApp(appRecord);

                    const os = await appService.fetchAppsById(appRecord.OS)
                    if (os) {
                        setOperatingSystem(os.APP_NAME)
                    }

                    const db = await appService.fetchAppsById(appRecord.DATABASE)
                    if (db) {
                        setDatabase(db.APP_NAME)
                    }

                    const network = await appService.fetchAppsById(appRecord.NETWORK)
                    if (network) {
                        setNetwork(network.APP_NAME)
                    }

                } else {
                    setSelectedApp([]);
                }

            } catch (fetchError) {
                console.error('Error fetching app record:', fetchError);
                setSelectedApp([])
            }
        }

        const fetchCompany = async () => {
            try {

                const companyRecord = await companyService.fetchCompanyById(company_id)
                setSelectedCompany(companyRecord)

            } catch (fetchError) {
                console.error('Error fetching company record:', fetchError);
                setSelectedApp([])
            }
        }

        const fetchRiskLibrary = async () => {
            try {
                const riskRecord = await auditService.fetchRisk()
                if (riskRecord) {
                    setRisks(riskRecord);

                } else {
                    setRisks([]);
                }

            } catch (fetchError) {
                console.error('Error fetching risk record:', fetchError);
                setRisks([])
            }
        }

        const fetchControlsLibrary = async () => {
            let controlsLibrary;
            try {
                controlsLibrary = await auditService.fetchControls()
            } catch (fetchError) {
                console.error('Error fetching controls record:', fetchError);
                setControls([])
            }

            if (controlsLibrary) {
                setControls(controlsLibrary);
            } else {
                setControls([]);
            }
        }

        fetchCompany()
        fetchAppByID()
        fetchRiskLibrary()
        fetchControlsLibrary()
        fetchRiskMapped()
    }, []);


    const fetchRiskMapped = async () => {

        let riskList;
        try {
            riskList = await auditService.fetchRiskMappingbyApp(id, company_id)

        } catch (fetchError) {
            console.error('Error fetching risk record by app:', fetchError);
            setMappedRisk([])
        }

        let riskData;
        if (riskList) {
            riskData = riskList.risklist_data;
        }

        if (riskData) {
            setMappedRisk(riskData);

            const sortedRiskMapping = riskData.sort((a, b) => {
                if (a.RISK_ID < b.RISK_ID) return -1;
                if (a.RISK_ID > b.RISK_ID) return 1;
                return 0;
            });

            const bp_risk_filtered = sortedRiskMapping.filter(risk => risk.RISK_TYPE === 'Business Process');
            const it_risk_filtered = sortedRiskMapping.filter(risk => risk.RISK_TYPE === 'IT');
            const operational_risk_filtered = sortedRiskMapping.filter(risk => risk.RISK_TYPE === 'Operational');
            const entity_risk_filtered = sortedRiskMapping.filter(risk => risk.RISK_TYPE === 'Entity Level');


            if (bp_risk_filtered) {
                setSelectedRisk(bp_risk_filtered);
                fetchMappedControls(bp_risk_filtered[0].id)
            }


            //BUSINESS

            const bp_risk_filtered_hr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Business Process' && risk.RATING === 'High'
            );
            setRiskMappingBPHR(bp_risk_filtered_hr);    

            const bp_risk_filtered_mr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Business Process' && risk.RATING === 'Medium'
            );
            setRiskMappingBPMR(bp_risk_filtered_mr);

            const bp_risk_filtered_lr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Business Process' && risk.RATING === 'Low'
            );
            setRiskMappingBPLR(bp_risk_filtered_lr)

            //IT
            const it_risk_filtered_hr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'IT' && risk.RATING === 'High'
            );
            setRiskMappingITHR(it_risk_filtered_hr);    

            const it_risk_filtered_mr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'IT' && risk.RATING === 'Medium'
            );
            setRiskMappingITMR(it_risk_filtered_mr);

            const it_risk_filtered_lr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'IT' && risk.RATING === 'Low'
            );
            setRiskMappingITLR(it_risk_filtered_lr)

            //Operational
             const operational_risk_filtered_hr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Operational' && risk.RATING === 'High'
            );
            setRiskMappingOperationalHR(operational_risk_filtered_hr);    

            const operational_risk_filtered_mr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Operational' && risk.RATING === 'Medium'
            );
            setRiskMappingOperationalMR(operational_risk_filtered_mr);

            const operational_risk_filtered_lr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Operational' && risk.RATING === 'Low'
            );
            setRiskMappingOperationalLR(operational_risk_filtered_lr)

             //Entity
             const entity_risk_filtered_hr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Entity Level' && risk.RATING === 'High'
            );
            setRiskMappingEntityHR(entity_risk_filtered_hr);    

            const entity_risk_filtered_mr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Entity Level' && risk.RATING === 'Medium'
            );
            setRiskMappingEntityMR(entity_risk_filtered_mr);

            const entity_risk_filtered_lr = sortedRiskMapping.filter(risk =>
                risk.RISK_TYPE === 'Entity Level' && risk.RATING === 'Low'
            );
            setRiskMappingEntityLR(entity_risk_filtered_lr)


            const formattedRating = (rating) => {
                if (Array.isArray(rating)) {
                    return rating.map(value => ({
                        label: value,
                        value
                    }));
                } else {
                    return [{
                        label: rating,
                        value: rating
                    }];
                }
            };

            const bp_mapping = bp_risk_filtered.map((item) => {

                const formatted = formattedRating(selectedRating[item.RISK_ID] || item.RATING);
                const getIconColor = () => {
                    if (item.RATING === 'High') {
                        return 'error'; // Or use a specific color code if "warning" is not valid
                    } else if (item.RATING === 'Medium') {
                        return 'warning';
                    } else if (item.RATING === 'Low') {
                        return 'success';
                    }
                    return undefined;
                };

                return {
                    key: item.RISK_ID,
                    label: (
                        <React.Fragment>
                            <mui.Box>

                                <mui.Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                    {item.RATING && (
                                        <TurnedInIcon color={getIconColor()} sx={{ fontSize: '18px' }} />
                                    )} {item.RISK_ID}
                                </mui.Typography>
                                <mui.Typography variant="caption">
                                    {item.RISK_DESCRIPTION}
                                </mui.Typography>
                            </mui.Box>
                            <Divider sx={{ width: '100%' }} />
                        </React.Fragment>
                    ),
                    content: (
                        <React.Fragment>
                            <mui.Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', marginTop: '-30px', textAlign: 'center' }}>
                                <Chip
                                    icon={<LinkOffIcon color="success" />}
                                    label={
                                        <mui.Typography variant="caption">
                                            {`Tag `}
                                            <strong>{item.RISK_ID}</strong>
                                            {` as not relevant`}
                                        </mui.Typography>
                                    }
                                    onClick={() => handleNotRelevant(item)}
                                />
                            </mui.Box>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '-20px', fontWeight: 'bold' }}>
                                General Information:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <NormalTextField
                                    label="Risk ID"
                                    value={item.RISK_ID}
                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={item.RISK_NAME}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={item.RISK_DESCRIPTION}
                                />
                            </mui.Paper>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>
                                Risk Rating:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={formatted ? formatted : ''}
                                        selectedOptions={formatted ? formatted : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(item.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={riskRating.RATING_RATIONALE}
                                        onChange={(e) => handleRationaleChange(item.id, e)}
                                        onBlur={(e) => handleRationaleBlur(item.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>


                                </div>
                            </mui.Paper>

                        </React.Fragment>
                    )
                };
            });
            if (bp_mapping) {
                setBPMapping(bp_mapping)
            }
            if (bp_risk_filtered) {
                setBPRiskList(bp_risk_filtered)
            }

            if(it_risk_filtered){
                setITRiskList(it_risk_filtered)
            }

            if(operational_risk_filtered){
                setOperationalRiskList(operational_risk_filtered)
            }

            if(entity_risk_filtered){
                setEntityRiskList(entity_risk_filtered)
            }

            const it_mapping = it_risk_filtered.map((item) => {
                const getIconColor = () => {
                    if (item.RATING === 'High') {
                        return 'error'; // Or use a specific color code if "warning" is not valid
                    } else if (item.RATING === 'Medium') {
                        return 'warning';
                    } else if (item.RATING === 'Low') {
                        return 'success';
                    }
                    return undefined;
                };

                const formatted = formattedRating(selectedRating[item.RISK_ID] || item.RATING);

                return {
                    key: item.RISK_ID,
                    label: (
                        <React.Fragment>
                            <mui.Box>
                                <mui.Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                    {item.RATING && (
                                        <TurnedInIcon color={getIconColor()} sx={{ fontSize: '18px' }} />
                                    )} {item.RISK_ID}
                                </mui.Typography>
                                <mui.Typography variant="caption">
                                    {item.RISK_DESCRIPTION}
                                </mui.Typography>
                            </mui.Box>
                            <Divider sx={{ width: '100%' }} />
                        </React.Fragment>
                    ),
                    content: (
                        <React.Fragment>
                            <mui.Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', marginTop: '-30px', textAlign: 'center' }}>
                                <Chip
                                    icon={<LinkOffIcon color="success" />}
                                    label={
                                        <mui.Typography variant="caption">
                                            {`Tag `}
                                            <strong>{item.RISK_ID}</strong>
                                            {` as not relevant`}
                                        </mui.Typography>
                                    }
                                    onClick={() => handleNotRelevant(item)}
                                />
                            </mui.Box>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '-20px', fontWeight: 'bold' }}>
                                General Information:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <NormalTextField
                                    label="Risk ID"
                                    value={item.RISK_ID}
                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={item.RISK_NAME}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={item.RISK_DESCRIPTION}
                                />
                            </mui.Paper>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>
                                Risk Rating:
                            </mui.Typography>

                            <mui.Paper sx={{ padding: '20px', height: '100%' }}>
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={formatted ? formatted : ''}
                                        selectedOptions={formatted ? formatted : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(item.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={riskRating.RATING_RATIONALE}
                                        onChange={(e) => handleRationaleChange(item.id, e)}
                                        onBlur={(e) => handleRationaleBlur(item.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>
                                </div>
                            </mui.Paper>
                        </React.Fragment>
                    )
                };
            });
            setITMapping(it_mapping)

            const ops_mapping = operational_risk_filtered.map((item) => {

                const formatted = formattedRating(selectedRating[item.RISK_ID] || item.RATING);
                const getIconColor = () => {
                    if (item.RATING === 'High') {
                        return 'error'; // Or use a specific color code if "warning" is not valid
                    } else if (item.RATING === 'Medium') {
                        return 'warning';
                    } else if (item.RATING === 'Low') {
                        return 'success';
                    }
                    return undefined;
                };
                return {
                    key: item.RISK_ID,
                    label: (
                        <React.Fragment>
                            <mui.Box>
                                <mui.Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                    {item.RATING && (
                                        <TurnedInIcon color={getIconColor()} sx={{ fontSize: '18px' }} />
                                    )} {item.RISK_ID}
                                </mui.Typography>
                                <mui.Typography variant="caption">
                                    {item.RISK_DESCRIPTION}
                                </mui.Typography>
                            </mui.Box>
                            <Divider sx={{ width: '100%' }} />
                        </React.Fragment>
                    ),
                    content: (
                        <React.Fragment>
                            <mui.Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', marginTop: '-30px', textAlign: 'center' }}>
                                <Chip
                                    icon={<LinkOffIcon color="success" />}
                                    label={
                                        <mui.Typography variant="caption">
                                            {`Tag `}
                                            <strong>{item.RISK_ID}</strong>
                                            {` as not relevant`}
                                        </mui.Typography>
                                    }
                                    onClick={() => handleNotRelevant(item)}
                                />
                            </mui.Box>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '-20px', fontWeight: 'bold' }}>
                                General Information:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <NormalTextField
                                    label="Risk ID"
                                    value={item.RISK_ID}
                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={item.RISK_NAME}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={item.RISK_DESCRIPTION}
                                />
                            </mui.Paper>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>
                                Risk Rating:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={formatted ? formatted : ''}
                                        selectedOptions={formatted ? formatted : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(item.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={riskRating.RATING_RATIONALE}
                                        onChange={(e) => handleRationaleChange(item.id, e)}
                                        onBlur={(e) => handleRationaleBlur(item.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>
                                </div>
                            </mui.Paper>
                        </React.Fragment>
                    )
                };
            });
            setOPSMapping(ops_mapping)

            const entity_mapping = entity_risk_filtered.map((item) => {

                const formatted = formattedRating(selectedRating[item.RISK_ID] || item.RATING);
                const getIconColor = () => {
                    if (item.RATING === 'High') {
                        return 'error'; // Or use a specific color code if "warning" is not valid
                    } else if (item.RATING === 'Medium') {
                        return 'warning';
                    } else if (item.RATING === 'Low') {
                        return 'success';
                    }
                    return undefined;
                };

                return {
                    key: item.RISK_ID,
                    label: (
                        <React.Fragment>
                            <mui.Box>
                                <mui.Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                    {item.RATING && (
                                        <TurnedInIcon color={getIconColor()} sx={{ fontSize: '18px' }} />
                                    )} {item.RISK_ID}
                                </mui.Typography>
                                <mui.Typography variant="caption">
                                    {item.RISK_DESCRIPTION}
                                </mui.Typography>
                            </mui.Box>
                            <Divider sx={{ width: '100%' }} />
                        </React.Fragment>
                    ),
                    content: (
                        <React.Fragment>
                            <mui.Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', marginTop: '-30px', textAlign: 'center' }}>
                                <Chip
                                    icon={<LinkOffIcon color="success" />}
                                    label={
                                        <mui.Typography variant="caption">
                                            {`Tag `}
                                            <strong>{item.RISK_ID}</strong>
                                            {` as not relevant`}
                                        </mui.Typography>
                                    }
                                    onClick={() => handleNotRelevant(item)}
                                />
                            </mui.Box>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '-20px', fontWeight: 'bold' }}>
                                General Information:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <NormalTextField
                                    label="Risk ID"
                                    value={item.RISK_ID}
                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={item.RISK_NAME}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={item.RISK_DESCRIPTION}
                                />
                            </mui.Paper>

                            <mui.Typography variant="subtitle2" style={{ marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>
                                Risk Rating:
                            </mui.Typography>

                            <mui.Paper sx={{ minWidth: '65vw', padding: '20px', height: '100%' }}>
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={formatted ? formatted : ''}
                                        selectedOptions={formatted ? formatted : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(item.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={riskRating.RATING_RATIONALE}
                                        onChange={(e) => handleRationaleChange(item.id, e)}
                                        onBlur={(e) => handleRationaleBlur(item.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>
                                </div>
                            </mui.Paper>
                        </React.Fragment>
                    )
                };
            });
            setEntityMapping(entity_mapping)

        } else {

            setSelectedRating({});
            setBPMapping([])
            setITMapping([])
            setOPSMapping([])
            setEntityMapping([])
            setMappedRisk([])
            setBPRiskList([])
            setITRiskList([])
            setRiskMappingBPHR([])
        }
    }

    const control_column = [
        { field: 'id', headerName: '#', flex: .2 },
        { field: 'CONTROL_ID', headerName: 'Control Ref', flex: .3 },
        { field: 'CONTROL_TITLE', headerName: 'Control Name', flex: .5 },
        { field: 'CONTROL_DESCRIPTION', headerName: 'Description', flex: 1},
        { field: 'CONTROL_TYPE', headerName: 'Control Type', flex: .3 },
    ];

    const control_rows = controls.map((control, index) => ({
        id: index + 1,
        CONTROL_ID: control.CONTROL_ID || '-',
        CONTROL_TITLE: control.CONTROL_TITLE || '-',
        CONTROL_DESCRIPTION: control.CONTROL_DESCRIPTION || '-',
        CONTROL_TYPE: control.CONTROL_TYPE || '-',
        controlID: control.id
    }));

    const control_rows_mapped = mappedControls.map((control, index) => ({
        id: index + 1,
        CONTROL_ID: control.CONTROL_ID || '-',
        CONTROL_TITLE: control.CONTROL_TITLE || '-',
        CONTROL_DESCRIPTION: control.CONTROL_DESCRIPTION || '-',
        CONTROL_TYPE: control.CONTROL_TYPE || '-',
        controlID: control.id
    }));

    const columns = [
        { field: 'id', headerName: '#', flex: .2 },
        { field: 'RISK_ID', headerName: 'Risk ID', flex: .3 },
        { field: 'RISK_NAME', headerName: 'Risk Name', flex: .5 },
        {
            field: 'RISK_TYPE',
            headerName: 'Risk Type',
            sortable: false,
            flex: .2
        },

        {
            field: 'RISK_DESCRIPTION',
            headerName: 'Description',
            sortable: false,
            flex: 1
        },
    ];

    const rows = bp_risk.map((risk, index) => ({
        id: index + 1,
        RISK_ID: risk.RISK_ID || '-',
        RISK_NAME: risk.RISK_NAME || '-',
        RISK_TYPE: risk.RISK_TYPE || '-',
        RISK_DESCRIPTION: risk.RISK_DESCRIPTION || '-',
        riskID: risk.id
    }));

    const it_rows = it_risk.map((risk, index) => ({
        id: index + 1,
        RISK_ID: risk.RISK_ID || '-',
        RISK_NAME: risk.RISK_NAME || '-',
        RISK_TYPE: risk.RISK_TYPE || '-',
        RISK_DESCRIPTION: risk.RISK_DESCRIPTION || '-',
        riskID: risk.id
    }));

    const operational_rows = operational_risk.map((risk, index) => ({
        id: index + 1,
        RISK_ID: risk.RISK_ID || '-',
        RISK_NAME: risk.RISK_NAME || '-',
        RISK_TYPE: risk.RISK_TYPE || '-',
        RISK_DESCRIPTION: risk.RISK_DESCRIPTION || '-',
        riskID: risk.id
    }));

    const entity_rows = entity_risk.map((risk, index) => ({
        id: index + 1,
        RISK_ID: risk.RISK_ID || '-',
        RISK_NAME: risk.RISK_NAME || '-',
        RISK_TYPE: risk.RISK_TYPE || '-',
        RISK_DESCRIPTION: risk.RISK_DESCRIPTION || '-',
        riskID: risk.id
    }));

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleModalClose = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenModal(true)
        }
        else {
            setOpenModal(false);
        }
    };

    const handleRationaleChange = (risk_id, e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
        const updatedData = {
            ...riskRating,
            [name]: value,
            RISK_ID: risk_id,
            APP_NAME: id,
            COMPANY_ID: company_id
        };

        setRiskRating(updatedData);

        setRatingRationale(updatedData.RATING_RATIONALE)
        // Save changes with the updated state
        saveTimeout.current = setTimeout(() => {
            saveRating(updatedData)
        }, 1000);

    };

    const handleRationaleBlur = (risk_id, e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...riskRating,
            [name]: value,
            RISK_ID: risk_id,
            APP_NAME: id,
            COMPANY_ID: company_id
        };

        setRiskRating(updatedData);
        saveRating(updatedData)
    };


    const handleRiskRatingChange = async (risk_id, selectedType) => {
        const rating = selectedType?.value || selectedType;

        const formatted_rating = {
            label: rating,
            value: rating
        }

        setRating(formatted_rating)

        const updatedData = {
            ...riskRating,
            RATING: rating,
            RISK_ID: risk_id,
            APP_NAME: id,
            COMPANY_ID: company_id
        };

        try {
            await saveRating(updatedData);
            fetchRiskMapped()

        } catch (error) {
            console.error('Error saving rating:', error);
        }

        

    };

    const handleClick = (risk) => {
        const risk_id = risk.riskID
        saveChanges(risk_id)
    };

    const handleUnmapControlClick = (control) => {
        const control_id = control.controlID

        const updatedData = {
            ...riskRating,
            ACTION: 'UNMAP',
            CONTROL_ID: control_id,
            RISK_ID: selectedRisk.id,
            APP_NAME: id,
            COMPANY_ID: company_id
        };

        UnmapControl(updatedData)

    }

    const handleMapControlClick = (control) => {
        const control_id = control.controlID

        const updatedData = {
            ...riskRating,
         
            CONTROL_ID: control_id,
            RISK_ID: selectedRisk.id,
            APP_NAME: id,
            COMPANY_ID: company_id
        };

        saveControl(updatedData)

    }

    const handleBPRiskClick = () => {
        setOpenBPRiskList(!openBPRiskList);
    };

    const handleITRiskClick = () => {
        setOpenITRiskList(!openITRiskList);
    };

    const handleOperationalRiskClick = () => {
        setOpenOperationalRiskList(!openOperationalRiskList);
    };

    const handleEntityRiskClick = () => {
        setOpenEntityRiskList(!openEntityRiskList);
    };

    const handleBPHRClick = () => {
        setOpenBPHR(!openBPHR);
    };

    const handleITHRClick = () => {
        setOpenITHR(!openITHR);
    };

    const handleOperationalHRClick = () => {
        setOpenOperationalHR(!openOperationalHR);
    };

    const handleEntityHRClick = () => {
        setOpenEntityHR(!openEntityHR);
    };

    const handleBPMRClick = () => {
        setOpenBPMR(!openBPMR);
    };

    const handleITMRClick = () => {
        setOpenITMR(!openITMR);
    };

    const handleOperationalMRClick = () => {
        setOpenOperationalMR(!openOperationalMR);
    };

    const handleEntityMRClick = () => {
        setOpenEntityMR(!openEntityMR);
    };

    const handleBPLRClick = () => {
        setOpenBPLR(!openBPLR);
    };

    const handleITLRClick = () => {
        setOpenBPLR(!openBPLR);
    };

    const handleOperationalLRClick = () => {
        setOpenOperationalLR(!openOperationalLR);
    };

    const handleEntityLRClick = () => {
        setOpenEntityLR(!openEntityLR);
    };

    const handleNotRelevant = (item) => {
        unmapRisk(item.id)
    };

    const saveControl = async (updatedData) => {
        if (updatedData) {

            let updated_controlmapping;
            try {
                updated_controlmapping = await auditService.updateRiskMappingbyMapID(updatedData.APP_NAME, updatedData.RISK_ID, company_id, updatedData)
               
            } catch (error) {
                console.error('Error updating record:', error);
            }

            if (updated_controlmapping) {
                setSelectedControls(updated_controlmapping)
            }

            fetchMappedControls(updatedData.RISK_ID)

        }
    }

    const UnmapControl = async (updatedData) => {
        if (updatedData) {

            let updated_controlmapping;
            try {
                updated_controlmapping = await auditService.updateRiskMappingbyMapID(updatedData.APP_NAME, updatedData.RISK_ID, company_id, updatedData)
               
            } catch (error) {
                console.error('Error updating record:', error);
            }

            if (updated_controlmapping) {
                setSelectedControls(updated_controlmapping)
            }

            fetchMappedControls(updatedData.RISK_ID)

        }
    }

    const saveRating = async (updatedData) => {
        if (updatedData) {

            let updated_riskmapping;
            try {
                updated_riskmapping = await auditService.updateRiskMappingbyMapID(updatedData.APP_NAME, updatedData.RISK_ID, company_id, updatedData)

            } catch (error) {
                console.error('Error updating record:', error);
            }

            if (updated_riskmapping) {
                setRiskRating(updated_riskmapping)
            }

        }
    }

    const unmapRisk = async (risk_id) => {

        if (risk_id) {

            let mappingFound;

            try {
                mappingFound = await auditService.deleteRiskMappingbyMapID(id, risk_id, company_id);
            } catch (error) {
                // Handle specific cases or general errors
                if (error.response && error.response.status === 404) {
                    mappingFound = null;
                } else {
                    // Handle other types of errors
                    console.error('Error mapping record:', error);

                }
            }

            if (mappingFound) {
                setMappedRisk(mappingFound)
                fetchRiskMapped()
            }
            else {
                fetchRiskMapped([])
            }

        }

    };

    const saveChanges = async (risk_id) => {

        if (risk_id) {

            let mappingFound;

            const newMapping = {
                RISK_ID: risk_id,
                APP_NAME: selectedApp.id,
                COMPANY_ID: company_id
            }

            try {
                // Attempt to fetch the existing risk mapping
                mappingFound = await auditService.fetchRiskMappingbyId(risk_id);

            } catch (error) {
                // Handle specific cases or general errors
                if (error.response && error.response.status === 404) {
                    mappingFound = null;
                } else {
                    // Handle other types of errors
                    console.error('Error mapping record:', error);
                }
            }

            if (mappingFound) {

            } else {
                const newRecord = await auditService.createRiskMapping(newMapping)
                fetchRiskMapped()
                return newRecord
            }

        }

    };

    const isRiskIDMapped = (riskID, mappedRisks) => {
        return mappedRisks.some(mappedRisk => mappedRisk.id === riskID);
    };

    const renderAuditPrepButton = (params) => {
        const risk = params.row;

        // Check if the riskID is found in mappedRisk
        const isMapped = isRiskIDMapped(risk.riskID, mappedRisk);

        // Define the Tooltip and IconButton for when the risk is mapped
        const mappedTooltip = (
            <Tooltip title="Mapped" arrow>
                <mui.IconButton
                    size="small"
                >
                    <LinkIcon style={{ color: 'gray' }} /> {/* Different icon color for mapped state */}
                </mui.IconButton>
            </Tooltip>
        );

        // Define the Tooltip and IconButton for when the risk is not mapped
        const notMappedTooltip = (
            <Tooltip title="Tag as Relevant" arrow>
                <mui.IconButton
                    size="small"
                    onClick={() => handleClick(risk)}
                >
                    <AddLinkIcon style={{ color: 'green' }} /> {/* Original icon color for unmapped state */}
                </mui.IconButton>
            </Tooltip>
        );

        // Render the appropriate Tooltip and IconButton based on isMapped
        return isMapped ? mappedTooltip : notMappedTooltip;
    };

    const isControlIDMapped = (controlID, mappedControls) => {
        return mappedControls.some(mappedControls => mappedControls.id === controlID);
    };

    const renderMapControlButton = (params) => {
        const control = params.row;

        const isMapped = isControlIDMapped(control.controlID, mappedControls);

        const mappedTooltip = (
            <Tooltip title="Mapped" arrow>
                <mui.IconButton
                    size="small"
                >
                    <LinkIcon style={{ color: 'gray' }} /> {/* Different icon color for mapped state */}
                </mui.IconButton>
            </Tooltip>
        );

        const notMappedTooltip = (
            <Tooltip title="Map Control" arrow>
            <mui.IconButton
                size="small"
                onClick={() => handleMapControlClick(control)}
            >
                <AddCircleRounded style={{ color: 'green' }} /> {/* Different icon color for mapped state */}
            </mui.IconButton>
        </Tooltip>
        );

        return isMapped ? mappedTooltip : notMappedTooltip;
    };

    const renderUnMapControlButton = (params) => {
        const control = params.row;
        return (
            <Tooltip title="Remove Mapping" arrow>
                <mui.IconButton
                    size="small"
                    onClick={() => handleUnmapControlClick(control)}
                >
                    <RemoveCircleIcon style={{ color: 'grey' }} /> {/* Different icon color for mapped state */}
                </mui.IconButton>
            </Tooltip>
        )
    };


    const fetchMappedControls = async (riskid) => {

        let mapped_controls;
            try {
                mapped_controls = await auditService.fetchMappedControls(id, riskid, company_id)
            } catch (fetchError) {
                console.error('Error fetching controls record:', fetchError);
                setMappedControls([])
            }

            if (mapped_controls) {

                 setMappedControls(mapped_controls[0].CONTROL_DETAILS || []);

                 const rating_record = {
                    label: mapped_controls[0].RATING,
                    value: mapped_controls[0].RATING,
                 }

                setRating(rating_record)
                setRatingRationale(mapped_controls[0].RATING_RATIONALE)
                
            }
    }

    useEffect(() => {
        if (bp_risk_list.length > 0) {
            setSelectedRisk(bp_risk_list[0]);
        }
    }, [bp_risk_list]);


    const getRiskDetails = (risk) => {
        setSelectedRisk(risk)

        fetchMappedControls(risk.id)
    }

    const riskLevelOption = [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
    ];


    const columnsWithActions_Control = [
        ...control_column,
        {
            field: 'status',
            headerName: 'Tag Control',
            width: 200,
            sortable: true,
            renderCell: renderMapControlButton,
        },
    ];
    const columnsWithActions_UnMapControl = [
        ...control_column,
        {
            field: 'status',
            headerName: 'Tag Control',
            width: 200,
            sortable: true,
            renderCell: renderUnMapControlButton,
        },
    ];

    const columnsWithActions = [
        ...columns,
        {
            field: 'status',
            headerName: 'Map Risk',
            width: 200,
            sortable: true,
            renderCell: renderAuditPrepButton,
        },
    ];
    
    const tabs_rating = [
        {
            value: '1',
            label: (<div>
                Business Process Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Relevant Risk
                                        </ListSubheader>
                                    }
                                >
                                    {/* High Risk */}
                                    <ListItemButton onClick={handleBPRiskClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={bp_risk_list.length} showZero>
                                                <TurnedInIcon color="grey" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Business Process Risks" />
                                        {openBPRiskList ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openBPRiskList} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {bp_risk_list.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_ID}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                            <mui.Paper sx={{ padding: '20px' }}>

                                <NormalTextField
                                    label="Risk ID"
                                    value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID : ''}
                                    size="small"

                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME : ''}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION : ''}
                                />

                            </mui.Paper>

                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Risk Rating
                                </mui.Typography>

                             
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={rating ? rating : ''}
                                        selectedOptions={rating ? rating : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(selectedRisk.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={ratingRationale ? ratingRationale: ''}
                                        onChange={(e) => handleRationaleChange(selectedRisk.id, e)}
                                        onBlur={(e) => handleRationaleBlur(selectedRisk.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>


                                </div>
                         
                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>
                </div>)
        },
        {
            value: '2',
            label: (<div>
                IT Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Relevant Risk
                                        </ListSubheader>
                                    }
                                >
                             
                                    <ListItemButton onClick={handleITRiskClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={it_risk_list.length} showZero>
                                                <TurnedInIcon color="grey" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="IT Risks" />
                                        {openITRiskList ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openITRiskList} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {it_risk_list.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_ID}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                            <mui.Paper sx={{ padding: '20px' }}>

                                <NormalTextField
                                    label="Risk ID"
                                    value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID : ''}
                                    size="small"

                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME : ''}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION : ''}
                                />

                            </mui.Paper>

                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Risk Rating
                                </mui.Typography>

                             
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={rating ? rating : ''}
                                        selectedOptions={rating ? rating : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(selectedRisk.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={ratingRationale ? ratingRationale:''}
                                        onChange={(e) => handleRationaleChange(selectedRisk.id, e)}
                                        onBlur={(e) => handleRationaleBlur(selectedRisk.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>


                                </div>
                         
                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>

                </div>)
        },
        {
            value: '3',
            label: (<div>
                Operational Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Relevant Risk
                                        </ListSubheader>
                                    }
                                >
                             
                                    <ListItemButton onClick={handleOperationalRiskClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={operational_risk_list.length} showZero>
                                                <TurnedInIcon color="grey" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Operational Risks" />
                                        {openOperationalRiskList ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openOperationalRiskList} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {operational_risk_list.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_ID}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                            <mui.Paper sx={{ padding: '20px' }}>

                                <NormalTextField
                                    label="Risk ID"
                                    value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID : ''}
                                    size="small"

                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME : ''}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION : ''}
                                />

                            </mui.Paper>

                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Risk Rating
                                </mui.Typography>

                             
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={rating ? rating : ''}
                                        selectedOptions={rating ? rating : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(selectedRisk.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={ratingRationale ? ratingRationale:''}
                                        onChange={(e) => handleRationaleChange(selectedRisk.id, e)}
                                        onBlur={(e) => handleRationaleBlur(selectedRisk.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>


                                </div>
                         
                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>

                </div>)
        },
        {
            value: '4',
            label: (<div>
                Entity-Level Risks
            </div>),
            content: (
                <div>
   <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Relevant Risk
                                        </ListSubheader>
                                    }
                                >
                             
                                    <ListItemButton onClick={handleEntityRiskClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={entity_risk_list.length} showZero>
                                                <TurnedInIcon color="grey" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Entity Level Risks" />
                                        {openEntityRiskList ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openEntityRiskList} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {entity_risk_list.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_ID}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                            <mui.Paper sx={{ padding: '20px' }}>

                                <NormalTextField
                                    label="Risk ID"
                                    value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID : ''}
                                    size="small"

                                />
                                <NormalTextField
                                    label="Risk Name"
                                    value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME : ''}
                                />
                                <NormalTextField
                                    isMultiLine={true}
                                    rows="5"
                                    label="Risk Description"
                                    value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION : ''}
                                />

                            </mui.Paper>

                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Risk Rating
                                </mui.Typography>

                             
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <MultipleSelect
                                        isMultiSelect={false}
                                        placeholderText="Select Rating"
                                        selectOptions={riskLevelOption}
                                        defaultvalue={rating ? rating : ''}
                                        selectedOptions={rating ? rating : ''}
                                        handleChange={(selectedType) => handleRiskRatingChange(selectedRisk.id, selectedType)}
                                    />
                                    <NormalTextField
                                        name="RATING_RATIONALE"
                                        label="Risk Rating Rationale"
                                        isMultiLine={true}
                                        rows="5"
                                        value={ratingRationale ? ratingRationale:''}
                                        onChange={(e) => handleRationaleChange(selectedRisk.id, e)}
                                        onBlur={(e) => handleRationaleBlur(selectedRisk.id, e)}
                                    />
                                    <mui.Typography variant="caption" style={{ marginBottom: '10px', color: "grey" }}>
                                        Provide a brief explanation that outlines the basis for the assigned rating
                                    </mui.Typography>


                                </div>
                         
                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>

                </div>)
        },
    ]

    const tabs_control = [
        {
            value: '1',
            label: (<div>
                Business Process Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Risk and Control Mapping
                                        </ListSubheader>
                                    }
                                >
                                    {/* High Risk */}
                                    <ListItemButton onClick={handleBPHRClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={riskmappingBPHR.length} showZero>
                                                <TurnedInIcon color="error" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="High Risk" />
                                        {openBPHR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openBPHR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingBPHR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_NAME}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Medium Risk */}
                                    <ListItemButton onClick={handleBPMRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingBPMR.length} showZero>
                                                <TurnedInIcon color="warning" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Medium Risk" />
                                        {openBPMR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openBPMR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingBPMR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)} >
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Low Risk */}
                                    <ListItemButton onClick={handleBPLRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingBPLR.length} showZero>
                                                <TurnedInIcon color="success" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Low Risk" />
                                        {openBPLR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openBPLR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingBPLR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                                    <mui.Paper sx={{padding: '20px'}}>

                                        <NormalTextField
                                            label="Risk ID"
                                            value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID: ''}
                                            size="small"
                                            
                                        />
                                        <NormalTextField
                                            label="Risk Name"
                                            value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME: ''}
                                        />
                                        <NormalTextField
                                            isMultiLine={true}
                                            rows="5"
                                            label="Risk Description"
                                            value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION: ''}
                                        />

                                    </mui.Paper>
                                   
                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Mapped Controls
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        columns={control_column}
                                        rows={control_rows_mapped}
                                        columnsWithActions={columnsWithActions_UnMapControl}
                                    />
                                </Suspense>
                                </mui.Box>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <LibraryBooksIcon style={{ color: 'grey', fontSize: '18px' }} /> Controls Library
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        rows={control_rows}
                                        columns={control_column}
                                        columnsWithActions={columnsWithActions_Control}
                                    />
                                </Suspense>
                                </mui.Box>


                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>
                </div>)
        },
        {
            value: '2',
            label: (<div>
                IT Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Risk and Control Mapping
                                        </ListSubheader>
                                    }
                                >
                                    {/* High Risk */}
                                    <ListItemButton onClick={handleITHRClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={riskmappingITHR.length} showZero>
                                                <TurnedInIcon color="error" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="High Risk" />
                                        {openITHR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openITHR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingITHR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_NAME}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Medium Risk */}
                                    <ListItemButton onClick={handleITMRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingITMR.length} showZero>
                                                <TurnedInIcon color="warning" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Medium Risk" />
                                        {openITMR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openITMR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingITMR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)} >
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Low Risk */}
                                    <ListItemButton onClick={handleITLRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingITLR.length} showZero>
                                                <TurnedInIcon color="success" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Low Risk" />
                                        {openITLR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openITLR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingITLR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                                    <mui.Paper sx={{padding: '20px'}}>

                                        <NormalTextField
                                            label="Risk ID"
                                            value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID: ''}
                                            size="small"
                                            
                                        />
                                        <NormalTextField
                                            label="Risk Name"
                                            value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME: ''}
                                        />
                                        <NormalTextField
                                            isMultiLine={true}
                                            rows="5"
                                            label="Risk Description"
                                            value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION: ''}
                                        />

                                    </mui.Paper>
                                   
                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Mapped Controls
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        columns={control_column}
                                        rows={control_rows_mapped}
                                        columnsWithActions={columnsWithActions_UnMapControl}
                                    />
                                </Suspense>
                                </mui.Box>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <LibraryBooksIcon style={{ color: 'grey', fontSize: '18px' }} /> Controls Library
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        rows={control_rows}
                                        columns={control_column}
                                        columnsWithActions={columnsWithActions_Control}
                                    />
                                </Suspense>
                                </mui.Box>


                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>
                </div>)
        },
        {
            value: '3',
            label: (<div>
                Operational Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Risk and Control Mapping
                                        </ListSubheader>
                                    }
                                >
                                    {/* High Risk */}
                                    <ListItemButton onClick={handleOperationalHRClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={riskmappingOperationalHR.length} showZero>
                                                <TurnedInIcon color="error" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="High Risk" />
                                        {openOperationalHR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openOperationalHR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingOperationalHR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_NAME}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Medium Risk */}
                                    <ListItemButton onClick={handleOperationalMRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingOperationalMR.length} showZero>
                                                <TurnedInIcon color="warning" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Medium Risk" />
                                        {openOperationalMR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openOperationalMR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingOperationalMR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)} >
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Low Risk */}
                                    <ListItemButton onClick={handleOperationalLRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingOperationalLR.length} showZero>
                                                <TurnedInIcon color="success" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Low Risk" />
                                        {openOperationalLR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openOperationalLR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingOperationalLR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                                    <mui.Paper sx={{padding: '20px'}}>

                                        <NormalTextField
                                            label="Risk ID"
                                            value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID: ''}
                                            size="small"
                                            
                                        />
                                        <NormalTextField
                                            label="Risk Name"
                                            value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME: ''}
                                        />
                                        <NormalTextField
                                            isMultiLine={true}
                                            rows="5"
                                            label="Risk Description"
                                            value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION: ''}
                                        />

                                    </mui.Paper>
                                   
                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Mapped Controls
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        columns={control_column}
                                        rows={control_rows_mapped}
                                        columnsWithActions={columnsWithActions_UnMapControl}
                                    />
                                </Suspense>
                                </mui.Box>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <LibraryBooksIcon style={{ color: 'grey', fontSize: '18px' }} /> Controls Library
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        rows={control_rows}
                                        columns={control_column}
                                        columnsWithActions={columnsWithActions_Control}
                                    />
                                </Suspense>
                                </mui.Box>


                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>
                </div>)
        },
        {
            value: '4',
            label: (<div>
                Entity-Level Risks
            </div>),
            content: (
                <div>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"

                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease',
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
                                
                            }}>
                            <mui.Paper sx={{
                                flex: 1, padding: '16px', height: '100%', overflow: 'auto' // Padding for better spacing
                            }}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Risk and Control Mapping
                                        </ListSubheader>
                                    }
                                >
                                    {/* High Risk */}
                                    <ListItemButton onClick={handleEntityHRClick}>
                                        <ListItemIcon>
                                            <mui.Badge color="primary" badgeContent={riskmappingEntityHR.length} showZero>
                                                <TurnedInIcon color="error" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="High Risk" />
                                        {openEntityHR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openEntityHR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingEntityHR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                     onClick={() => getRiskDetails(risk)}>
                                                         <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <mui.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                primary={risk.RISK_NAME}
                                                                sx={{ fontSize: '14px' }} // Adjust the size as needed
                                                            />
                                                        </mui.Box>
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Medium Risk */}
                                    <ListItemButton onClick={handleEntityMRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingEntityMR.length} showZero>
                                                <TurnedInIcon color="warning" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Medium Risk" />
                                        {openEntityMR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openEntityMR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingEntityMR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton 
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)} >
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                    {/* Low Risk */}
                                    <ListItemButton onClick={handleEntityLRClick}>
                                        <ListItemIcon>
                                        <mui.Badge color="primary" badgeContent={riskmappingEntityLR.length} showZero>
                                                <TurnedInIcon color="success" />
                                            </mui.Badge>
                                        </ListItemIcon>
                                        <ListItemText primary="Low Risk" />
                                        {openEntityLR ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openEntityLR} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {riskmappingEntityLR.map((risk) => (
                                                <React.Fragment key={risk.id}>
                                                    <ListItemButton
                                                    sx={{ 
                                                        pl: 5, 
                                                        backgroundColor: selectedRisk === risk ? 'whitesmoke' : 'transparent',
                                                        // Change the color or style for selected item
                                                    }}
                                                    onClick={() => getRiskDetails(risk)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'grey' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.RISK_NAME} sx={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />

                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >

                                    <mui.Paper sx={{padding: '20px'}}>

                                        <NormalTextField
                                            label="Risk ID"
                                            value={selectedRisk.RISK_ID ? selectedRisk.RISK_ID: ''}
                                            size="small"
                                            
                                        />
                                        <NormalTextField
                                            label="Risk Name"
                                            value={selectedRisk.RISK_NAME ? selectedRisk.RISK_NAME: ''}
                                        />
                                        <NormalTextField
                                            isMultiLine={true}
                                            rows="5"
                                            label="Risk Description"
                                            value={selectedRisk.RISK_DESCRIPTION ? selectedRisk.RISK_DESCRIPTION: ''}
                                        />

                                    </mui.Paper>
                                   
                            <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <SecurityIcon style={{ color: 'grey', fontSize: '18px' }} /> Mapped Controls
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        columns={control_column}
                                        rows={control_rows_mapped}
                                        columnsWithActions={columnsWithActions_UnMapControl}
                                    />
                                </Suspense>
                                </mui.Box>

                                <mui.Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <LibraryBooksIcon style={{ color: 'grey', fontSize: '18px' }} /> Controls Library
                                </mui.Typography>

                                <mui.Box sx={{marginTop: '20px'}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DataTable
                                        rows={control_rows}
                                        columns={control_column}
                                        columnsWithActions={columnsWithActions_Control}
                                    />
                                </Suspense>
                                </mui.Box>


                            </mui.Paper>

                        </mui.Grid>

                    </mui.Grid>

                </div>)
        },
    ]

    const tabs_ra = [
        {
            value: '1',
            label: (<div>
                Business Process Risks Library
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" sx={{ marginBottom: '10px' }}>
                        Click the 'Plus' button below to make the selected risk as relevant to {selectedApp.APP_NAME}
                    </mui.Typography>

                    <mui.Box sx={{ marginTop: '20px' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                    </mui.Box>
                </div>)
        },
        {
            value: '2',
            label: (<div>
                IT Risk Library
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" sx={{ marginBottom: '10px' }}>
                        Click the 'Plus' button below to make the selected risk as relevant to {selectedApp.APP_NAME}
                    </mui.Typography>

                    <mui.Box sx={{ marginTop: '20px' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable

                                rows={it_rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                    </mui.Box>
                </div>)
        },
        {
            value: '3',
            label: (<div>
                Operational Risk Library
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" sx={{ marginBottom: '10px' }}>
                        Click the 'Plus' button below to make the selected risk as relevant to {selectedApp.APP_NAME}
                    </mui.Typography>

                    <mui.Box sx={{ marginTop: '20px' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable

                                rows={operational_rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                    </mui.Box>
                </div>)
        },
        {
            value: '4',
            label: (<div>
                Entity Level Risk Library
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" sx={{ marginBottom: '10px' }}>
                        Click the 'Plus' button below to make the selected risk as relevant to {selectedApp.APP_NAME}
                    </mui.Typography>

                    <mui.Box sx={{ marginTop: '20px' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable

                                rows={entity_rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                    </mui.Box>
                </div>)
        },
    ]

    const tabs = [

        {
            value: '1',
            label: (<div>
                <InsightsIcon /> Application Overview
            </div>),
            content: (
                <div>

                    <mui.Paper sx={{ padding: '20px' }}>

                        <mui.Typography variant="h6" sx={{ marginBottom: '10px' }}>
                            <GridViewRoundedIcon style={{ color: 'grey' }} /> General Information
                        </mui.Typography>

                        <NormalTextField
                            label="Application Name"
                            name="APP_NAME"
                            value={selectedApp.APP_NAME}
                        />

                        <NormalTextField
                            label="Company Name"
                            name="COMPANY_NAME"
                            value={selectedApp.COMPANY_NAME}
                        />

                        <NormalTextField
                            label="Application Description"
                            name="APP_DESCRIPTION"
                            value={selectedApp.APP_DESCRIPTION}
                            isMultiLine={true}
                            rows="8"
                        />

                        <NormalTextField
                            label="Application Type"
                            name="APP_TYPE"
                            value={selectedApp.APP_TYPE}
                        />

                        <NormalTextField
                            label="Hosting"
                            name="HOSTED"
                            value={selectedApp.HOSTED}
                        />

                        <NormalTextField
                            label="Authentication"
                            name="AUTHENTICATION_TYPE"
                            value={selectedApp.AUTHENTICATION_TYPE}
                        />

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                        <mui.Typography variant="h6" sx={{ marginBottom: '10px' }}>
                            <CellTowerRoundedIcon style={{ color: 'grey' }} /> Infrastructure
                        </mui.Typography>

                        <NormalTextField
                            label="Operating System"
                            name="OS"
                            value={operatingSystem ? operatingSystem : ''}
                        />

                        <NormalTextField
                            label="Operating System Version"
                            name="OS_VERSION"
                            value={selectedApp.OS_VERSION ? selectedApp.OS_VERSION : ''}
                        />

                        <NormalTextField
                            label="Database"
                            name="DATABASE"
                            value={database ? database : ''}
                        />

                        <NormalTextField
                            label="Database Version"
                            name="DB_VERSION"
                            value={selectedApp.DB_VERSION ? selectedApp.DB_VERSION : ''}
                        />

                        <NormalTextField
                            label="Network"
                            name="NETWORK"
                            value={network ? network : ''}
                        />

                        <NormalTextField
                            label="Network Version"
                            name="NETWORK_VERSION"
                            value={selectedApp.NETWORK_VERSION ? selectedApp.NETWORK_VERSION : ''}
                        />

                    </mui.Paper>


                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="h6" sx={{ marginBottom: '10px' }}>
                            <LibraryBooksRoundedIcon style={{ color: 'grey' }} /> Accounts
                        </mui.Typography>
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="h6" sx={{ marginBottom: '10px' }}>
                            <AccountTreeRoundedIcon style={{ color: 'grey' }} /> Business Process
                        </mui.Typography>
                    </mui.Paper>

                </div>)
        },
        {
            value: '2',
            label: (<div>
                <BookmarkAddIcon /> Risk Identification

            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" style={{ marginBottom: '20px' }}>
                        Identify and tag which risks listed below are relevant for {selectedApp.APP_NAME}
                    </mui.Typography>

                    <DynamicTabs tabs={tabs_ra} />

                </div>)
        },
        {
            value: '3',
            label: (<div>
                <SpeedIcon /> Risk Assessment
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" style={{ marginBottom: '20px' }}>
                        Assign an appropriate risk rating to each relevant risk and provide a rationale for the assigned rating
                    </mui.Typography>

                    <DynamicTabs tabs={tabs_rating} />
                </div>)
        },
        {
            value: '4',
            label: (<div>
                <AddModeratorIcon />Control Mapping
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2" style={{ marginBottom: '20px' }}>
                        Map the control that will address the risk
                    </mui.Typography>

                    <DynamicTabs tabs={tabs_control} />
                </div>)
        },
    ]

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        My Dashboard
                    </mui.Link>
                    <mui.Typography color="text.primary">{selectedCompany.COMPANY_NAME}</mui.Typography>
                    <mui.Typography color="text.primary">Risk and Control Mapping</mui.Typography>
                    <mui.Typography color="text.primary">{selectedApp.APP_NAME}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={selectedApp.APP_NAME} icon={<ReviewsRoundedIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Map risk to relevant control to address the risk
                </mui.Typography>
                <Separator />

                <mui.Box sx={{ backgroundColor: 'whitesmoke', minHeight: '80vh', padding: '20px' }}>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <mui.Grid item
                            xs={12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >
                            <mui.Paper sx={{ minHeight: '80vh', padding: '20px' }}>
                                <DynamicTabs tabs={tabs} />
                            </mui.Paper>
                        </mui.Grid>

                    </mui.Grid>
                </mui.Box>



            </ResponsiveContainer>
        </div>
    )
    return (

        <Suspense fallback="Loading...">
            <div>
                <IASideBar mainContent={customMainContent} />
            </div>
        </Suspense>

    );
}
export default RiskMapping;