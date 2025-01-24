
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function DynamicTabs({ tabs, icon }) {
  const [value, setValue] = React.useState(tabs[0]?.value); // Initialize with the value of the first tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabs.map(tab => (
              <Tab key={tab.value}
              icon={icon}
              label={tab.label}
              value={tab.value}
              sx={{ textTransform: 'none' }}
              />
            ))}
          </TabList>
        </Box>
        {tabs.map(tab => (
          <TabPanel key={tab.value} value={tab.value}>
            {tab.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
