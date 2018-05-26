import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    margin: theme.spacing.unit,
    maxWidth: 800,    
    display: 'flex',
    flexWrap: 'wrap',

  }),
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
  },
  selectField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
    flexBasis: '40%'
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
  },
});


// category
// title
// city
// createdDate
// description
// endDate
// startDate
// location
// {address: "", coordinate: ""}
// price
// signupClosesDate

const requiredFields = [
  'title',
  'description',
  'city',
  'startDate',
  'endDate'
]
const categories = ["food", "drink", "attraction", "other"];
const defaultTimeString = '2018-06-12T10:30';

const dataFields = {
  city: '',
  title: '',
  description: '',
  startDate: defaultTimeString,
  endDate: defaultTimeString,
  price: 0,
  signupClosesDate: defaultTimeString,
  category: categories[0],
  address: '',
};

const initialState = {
  ...dataFields,
  snackbarOpen: false,
  errors: [],
};


class EventForm extends Component {

  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState){
    if(prevState.city === initialState.city && nextProps.cities.length > 0){
      return { city: nextProps.cities[0].name};
    }
    else return null;
  }

  validate = () => {
    const errors = [];
    for(const required of requiredFields) {
      if(this.state[required].length === 0) {
        errors.push(required);
      }
    }
    this.setState({errors});

    return errors.length === 0;
  }

  saveEvent = () => {
    const { db } = this.props;
    const details = {}

    if (!this.validate()) {
      return;
    }

    for (const prop in dataFields) {
      if (prop.includes('Date')) {
        details[prop] = new Date(this.state[prop]);
      } else {
        details[prop] = this.state[prop];
      }
    }

    details['createdDate'] = Date.now();
    details['location'] = {address: this.state['address']}

    this.setState({...initialState});
    this.setState({snackbarOpen: true});

    db.collection('activities').add(details)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((err) => console.error("Failed to save", err));
    
      setTimeout(() => this.setState({snackbarOpen: false}), 3000);
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };
  

  render() {
    const { classes, cities } = this.props;
    const { errors } = this.state;

    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            Add event
          </Typography>
          <TextField
            required
            error={errors.includes('title')}
            id="title"
            label="Event Title"
            placeholder="Title"
            className={classes.textField}
            margin="normal"
            fullWidth
            value={this.state.title}
            onChange={this.handleChange('title')}
          />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            fullWidth
            rowsMax="4"
            value={this.state.description}
            onChange={this.handleChange('description')}
            error={errors.includes('description')}            
            className={classes.textField}
            margin="normal"
          />
          <TextField
            id="select-city"
            required
            error={errors.includes('city')}
            select
            label="Select City"
            className={classes.selectField}
            value={this.state.city || ""}
            onChange={this.handleChange('city')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {cities.map(option => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="select-category"
            
            select
            label="Select Category"
            className={classes.selectField}
            value={this.state.category || ""}
            onChange={this.handleChange('category')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {categories.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={errors.includes('address')}
            id="address"
            label="Address"
            placeholder="Address"
            className={classes.textField}
            margin="normal"
            fullWidth
            value={this.state.address}
            onChange={this.handleChange('address')}
          />
          <TextField
            id="datetime-local"
            label="Start Time"
            type="datetime-local"
            className={classes.textField}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.startDate}
            onChange={this.handleChange('startDate')}
            error={errors.includes('startDate')}
            
          />
          <TextField
            id="datetime-local"
            label="End Time"
            type="datetime-local"
            className={classes.textField}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleChange('endDate')}
            value={this.state.endDate}
            error={errors.includes('endDate')}
          />
          <FormControl fullWidth className={classes.textField}>
            <InputLabel htmlFor="adornment-amount">Price</InputLabel>
            <Input
              id="adornment-amount"
              value={this.state.price}
              type="number"
              onChange={this.handleChange('price')}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
          <TextField
            id="datetime-local"
            label="Signup Deadline"
            type="datetime-local"
            className={classes.textField}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.signupClosesDate}
            onChange={this.handleChange('signupClosesDate')}            
          />
          <Button 
            variant="raised" 
            color="primary" 
            className={classes.button}
            onClick={this.saveEvent}>
            Save
          </Button>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Event Saved</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
              </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(EventForm);
