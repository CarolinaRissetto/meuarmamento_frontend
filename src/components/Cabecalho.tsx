import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div>
    <Typography variant="h5" component="h2" color={"#1465C0"} align='center' >
      {title}
    </Typography>
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SectionHeader;
