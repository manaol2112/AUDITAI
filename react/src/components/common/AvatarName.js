import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
    const initials = name.split(' ').map(part => part[0]).join('');
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: (
        <span style={{ fontSize: '12px' }}>{initials.toUpperCase()}</span>
      ),
    };
  }
  

export default function DynamicAvatarList({ names }) {
  // Ensure names is always an array
  const namesArray = Array.isArray(names) ? names : [names];

  return (
    <Stack direction="row" spacing={2}>
      {namesArray.map((name, index) => (
        <Avatar key={index} {...stringAvatar(name)} />
      ))}
    </Stack>
  );
}


