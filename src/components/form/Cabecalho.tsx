import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@mui/material';
import { styled } from '@mui/system';

const CustomDivider = styled('div')({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '40px 0',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: '1px solid #A8A8A8', // Ajuste a cor e espessura conforme necessário
  },
  '&::before': {
    marginRight: '0.25em',
  },
  '&::after': {
    marginLeft: '0.25em',
  },
});

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div>
    <Typography variant="h5" component="h2">
      <CustomDivider>{title}</CustomDivider>
    </Typography>
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SectionHeader;
