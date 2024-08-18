import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import {MetaDataModel} from '../models/MetaDataModel';
import React from 'react';

export default function WebsiteCard(props: MetaDataModel) {
  return (
    <Card sx={{width: 345, height: 400}}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={props.ogImage} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
