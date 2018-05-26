import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

const styles = theme => ({
    root: theme.mixins.gutters({
      paddingTop: 16,
      paddingBottom: 16,
      marginTop: theme.spacing.unit * 3,
      margin: theme.spacing.unit,  
    })
});


function InvalidUser(props) {
    const { classes } = props;
    
    return (
    <Paper className={classes.root}>
        <Typography variant="headline" component="h1">
        Invalid user
        </Typography>
        <Typography variant="body1" component="p">
        Please contact Studs Communications for more information.
        </Typography>
    </Paper>
    )
}

export default withStyles(styles)(InvalidUser);