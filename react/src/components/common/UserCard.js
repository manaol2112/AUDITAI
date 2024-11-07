import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';


const UserCard = ({ icon, title, to, buttonlabel, email, status }) => {

  const navigate = useNavigate(); // Initialize useHistory

  const handleManageClick = () => {
    navigate(to);
  };

  const card = (
      <React.Fragment>
          <CardContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i style={{ color: 'rgb(37, 150, 190)', fontSize: '35px' }} className="material-icons">
              {icon}
            </i>
            <Typography variant="subtitle1" component="div" sx={{
              marginLeft: '10px',
              fontSize: '16px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {title}
            </Typography>
          </div>
     
          <CardActions>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <EmailIcon style={{ fontSize: '18px', marginRight: '5px', color: 'lightblue' }} /> 
            <Typography variant="body2" component="div" sx={{
              fontSize: '14px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {email}
            </Typography>
          </div>
          </CardActions>
          </CardContent>
          <CardActions>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Typography variant="h7" component="div" sx={{marginLeft: '10px' }}>
                  {status}
              </Typography>

              <Button sx={{ fontSize: '12px', marginLeft: '60px' }} size="small" onClick={handleManageClick}>
                  View {buttonlabel}
              </Button>
            </div>
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

export default UserCard;
