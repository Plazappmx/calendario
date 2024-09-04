import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Button, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField, Alert } from "@mui/material";
import emailjs from 'emailjs-com';

function AppointmentCalendar() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleDateClick = (date) => {
    setDate(date);
    setOpen(true);
  };

  const handleSave = async () => {
    setError(""); // Reset error message

    if (selectedHour && fullName && email) {
      try {
        // Query Firestore to see if there's an appointment at the selected date and hour
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("date", "==", date.toDateString()), where("hour", "==", selectedHour));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Appointment exists at the selected date and hour
          setError("The selected date and hour are already taken.");
        } else {
          // No appointment exists, proceed to save
          await addDoc(collection(db, "appointments"), {
            date: date.toDateString(),
            hour: selectedHour,
            fullName: fullName,
            email: email,
          });

          // Send email notification using EmailJS
          const templateParams = {
            fullName: fullName,
            email: email,
            date: date.toDateString(),
            hour: selectedHour,
            to_email: "contacto@plazapp.mx"
          };

          emailjs.send('service_kj26lvj', 'template_1ppq7k9', templateParams, 'sB01HblhcBv3cDVTx')
            .then((response) => {
              console.log('Email successfully sent!', response.status, response.text);
            }, (err) => {
              console.error('Failed to send email. Error:', err);
              setError("An error occurred while sending the email.");
            });

          setOpen(false);
          setSelectedHour("");
          setFullName("");
          setEmail("");
        }
      } catch (error) {
        console.error("Error checking or adding document: ", error);
        setError("An error occurred while saving the appointment.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const hours = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Crea tu cita para tu DEMO</h1>
      <Calendar onClickDay={handleDateClick} value={date} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Escoge un dia y una hora:</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            fullWidth
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Correo Electronico"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Selecciona una fecha"
            fullWidth
            variant="outlined"
            value={date.toDateString()}  // Display the selected date
            InputProps={{
              readOnly: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Selecciona una hora</InputLabel>
            <Select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              variant="outlined"
              label="Selecciona una hora"
            >
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AppointmentCalendar;
