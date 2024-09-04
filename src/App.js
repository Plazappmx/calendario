// src/App.js
import React from 'react';
import AppointmentCalendar from './Calendar';
import {Button, ThemeProvider, createTheme, CssBaseline, Container, Typography } from '@mui/material';

const handleRedirect = () => {
  window.location.href = 'https://www.plazapp.mx';
};

function App() {
  return (
    <div className="App">
       <Button
        variant="contained"
        color="secondary"
        onClick={handleRedirect}
        sx={{ marginTop: 2 }}
      >
        Regresar a Plaza App
      </Button>
      <AppointmentCalendar />
    </div>
  );
}

export default App;

