import React , { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Button,Card,CardContent,CardHeader,CardActions, Divider } from '@material-ui/core';
import Select from 'react-select';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import axios from 'axios';
import {PollutantCategory} from '../Dashboard/components'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
 

}));

const Download = (props) => {
  const { className,staticContext, ...rest } = props;
  const classes = useStyles();

  //const [customDownloadData, setCustomisedDownloadData] = useState([]);
 
  const [selectedDate, setSelectedStartDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedStartDate(date);
  };
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const [filterLocations,setFilterLocations] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/v1/dashboard/monitoringsites/locations?organisation_name=KCCA')
      .then(res => res.json())
      .then((filterLocationsData) => {
        setFilterLocations(filterLocationsData.airquality_monitoring_sites)
      })
      .catch(console.log)
  },[]);

  const filterLocationsOptions = filterLocations

  const [values, setReactSelectValue] = useState({ selectedOption: [] });

  const handleMultiChange = selectedOption => {    
    setReactSelectValue({ selectedOption });
  }

  const frequencyOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const [selectedFrequency, setSelectedFrequency] =  useState();

  const handleFrequencyChange = selectedFrequencyOption => {
    setSelectedFrequency(selectedFrequencyOption);
  };

  const pollutantOptions = [
    { value: 'PM 2.5', label: 'PM 2.5' },
    { value: 'PM 10', label: 'PM 10' },
    { value: 'NO2', label: 'NO2' }
  ];

  const [selectedPollutant, setSelectedPollutant] =  useState();

  const handlePollutantChange = selectedPollutantOption => {
    setSelectedPollutant(selectedPollutantOption);
  };


  const typeOptions = [
    { value: 'JSON', label: 'JSON' },
    { value: 'CSV', label: 'CSV'}
  ];

  const [selectedType, setSelectedType] =  useState();

  const handleTypeChange = selectedTypeOption => {
    setSelectedType(selectedTypeOption);
  };

  const degreeOfClean =[
    { value: 'Raw Data', label:'Raw Data'},{value: 'Clean Data', label:'Clean Data'}
  ]

  const [selectedClean,setSelectedClean] =useState()
  const handleCleanessChange = selecteddegreeOfClean => {
    setSelectedClean(selecteddegreeOfClean);
  };

  
  let  handleSubmit = (e) => {
    e.preventDefault();

    let params ={ 
      locations: values.selectedOption,
      startDate:  selectedDate,
      endDate:  selectedEndDate,
      frequency:  selectedFrequency.value,
      pollutant: selectedPollutant.value,
      fileType:selectedType.value,
      degreeOfClean:selectedClean.value,
      organisation_name: 'KCCA'     
    }
    console.log(JSON.stringify(params));
  
   
    axios.post(
      'http://localhost:5000/api/v1/data/download', 
      JSON.stringify(params),
      { headers: { 'Content-Type': 'application/json' } }
    ).then(res => res.data)
      .then((customisedDownloadData) => {
        // setCustomisedDownloadData(customisedDownloadData)    
        //download the returned data
        console.log(customisedDownloadData)

      }).catch(
        console.log
      )  

    
  }  


  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          md={8}
          xs={12}
        >
          <Card
            {...rest}
            className={clsx(classes.root, className)}
          >
            <CardHeader 
              subheader="Customize the data you want to download."
              title="Data Download"
            />

            
            <Divider/>
            <form onSubmit={handleSubmit}>
              <CardContent>                          
                          
                <Grid
                  container
                  spacing={2}
                >             
                
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid 
                        container 
                        spacing={1}
                      >
                        <Grid
                          item
                          lg={3}
                          md={3}
                          sm={6}
                          xl={3}
                          xs={12}
                        >
                          <KeyboardDatePicker                     
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Start Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            required
                          />  
                        </Grid>  
                        <Grid
                          item
                          lg={3}
                          md={3}
                          sm={6}
                          xl={3}
                          xs={12}
                        >            
                          <KeyboardTimePicker                     
                            disableToolbar
                            variant="inline"
                            margin="normal"
                            id="time-picker"
                            label="Start Time "
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change time',
                            }}  
                            required                    
                          />
                        </Grid>

                        <Grid
                          item
                          lg={3}
                          md={3}
                          sm={6}
                          xl={3}
                          xs={12}
                        >
                          <KeyboardDatePicker                      
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="End Date"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change end date',
                            }}
                            required
                          /> 
                        </Grid> 
                        <Grid
                          item
                          lg={3}
                          md={3}
                          sm={6}
                          xl={3}
                          xs={12}
                        >              
                          <KeyboardTimePicker                      
                            disableToolbar
                            variant="inline"
                            margin="normal"
                            id="time-picker"
                            label="End Time "
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change end time',
                            }}
                            required
                          />
                        </Grid>
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </Grid>           
                  
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <Select
                      fullWidth
                      className="reactSelect"
                      name="location"
                      placeholder="Location(s)"
                      value={values.selectedOption}
                      options={filterLocationsOptions}
                      onChange={handleMultiChange}
                      isMulti
                      variant="outlined"
                      margin="dense"
                      required
                    />
                  </Grid>                  
                  
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >     
                    <Select
                      fullWidth
                      label ="Frequency"
                      className=""
                      name="chart-frequency"
                      placeholder="Frequency"
                      value={selectedFrequency}
                      options={frequencyOptions}
                      onChange={handleFrequencyChange}
                      variant="outlined"
                      margin="dense"   
                      required           
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >     
                    <Select
                      fullWidth
                      label="Pollutant"
                      className=""
                      name="pollutant"
                      placeholder="Pollutant"
                      value={selectedPollutant}
                      options={pollutantOptions}
                      onChange={handlePollutantChange}
                      variant="outlined"
                      margin="dense"  
                      required            
                    />
                  </Grid>

                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                
                    <Select
                      fullWidth
                      label="Degree of Cleaning"
                      className="reactSelect"
                      name="file-type"
                      placeholder="Degree of Cleaning"
                      value={selectedClean}
                      options={degreeOfClean}
                      onChange={handleCleanessChange}                     
                      
                      variant="outlined"
                      margin="dense" 
                      required         
                    />
                  </Grid>

                  <Grid
                    item
                    md={6}
                    xs={12}
                  >                
                    <Select
                      fullWidth
                      label="File Type"
                      className="reactSelect"
                      name="file-type"
                      placeholder="File Type"
                                            
                      value={selectedType}
                      options={typeOptions}
                      onChange={handleTypeChange}
                      variant="outlined"
                      margin="dense" 
                      required         
                    />
                  </Grid>


                </Grid>
              

              </CardContent>

              <Divider/>
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                > Download Data
                </Button>
              </CardActions>

            </form>

          </Card>
          
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
        >         
       
          <Card
            {...rest}
            className={clsx(classes.root, className)}
          >
          
            
            <CardHeader
              subheader="Customize the data you want to download."
              title="Data Download"
            />
            <Divider />
            <CardContent>
              {/*<PollutantCategory />*/}
        
            </CardContent>
            
          </Card>

        </Grid>
      </Grid>
    </div>
  );
};

Download.propTypes = {
  className: PropTypes.string
};
export default Download;
