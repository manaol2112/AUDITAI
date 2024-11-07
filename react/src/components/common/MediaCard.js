import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const OutlinedCard = ({ icon, title, to, buttonlabel }) => {

  const navigate = useNavigate(); // Initialize useHistory

  const handleManageClick = () => {
    navigate(to);
  };

  const card = (
    <React.Fragment>
      <CardContent>
        <i style={{ color: 'rgb(37, 150, 190)', fontSize: '35px' }}  className="material-icons">{icon}</i>
        <Typography variant="h7" component="div">
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button sx={{ fontSize: '12px' }} size="small"  onClick={handleManageClick}>
        {buttonlabel}
        </Button>
      </CardActions>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 230, maxWidth: 230, }}>
          <Card
              sx={{
                  maxHeight: 180,
                  minHeight: 180,
                  borderRadius: '15px',
                  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                      transform: 'scale(1.02)',
                  },
              }}
              variant="outlined"
          >
              {card}
          </Card>
    </Box>
  );
};

export default OutlinedCard;
