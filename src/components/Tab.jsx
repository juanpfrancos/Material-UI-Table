import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles(theme => ({
  root: { margin: theme.spacing(1) * 2, textAlign: 'center' },
  card: { margin: theme.spacing(1) * 2, maxWidth: 300 }
}));


function Tab(){

  const [button, setButton]=useState(true); /*Disable Delete Button */
  const [rows, setRows]=useState([]);      /*Rows State*/
  const [selRow, setSelRow]=useState([]);  /*Row Selected State*/
  const [columns, setColumns] = useState([ /*Columns State*/
    { name: 'ID', active: false },
    { name: 'Name', active: false },
    { name: 'Price', active: false, numeric: true },
    { name: 'Reference', active: false },
  ]);

  useEffect(async()=>{
    await peticionGet();
  },[])

  const peticionGet=async()=>{
    await axios.get('http://localhost:8000/Products/')
    .then(response=>{
      setRows(response.data);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete('http://localhost:8000/Products/'+selRow.id+'/')
    .then(response=>{
      setRows(rows.filter(row=>row.id!==selRow.id)) /*Actualiza el state excluyendo el campo eliminado*/
      alert('Producto eliminado')
    })
  }

  const onRowClick = id => () => {
    const newRows = [...rows];
    const index = rows.findIndex(row => row.id === id);
    const row = rows[index]
    setSelRow(rows[index]) /*Añade al estado la fila seleccionada*/

    /*Añade al state el campo selected true a las filas seleccionadas*/
    newRows[index] = { ...row, selected: !row.selected }; 
    setRows(newRows);
    setButton(false) /*Enable Delete Button Only when a row has checked */
  };

  const selections = () => rows.filter(row => row.selected).length; /*Count selections number*/

  const classes = useStyles();
    return (
        <>
      <Paper className={classes.root}>
      <Typography variant="h4" id="tableTitle">
      {`(${selections()}) rows selected`}
      </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.name}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.id}
                onClick={onRowClick(row.id)}
                selected={row.selected}
              >
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" disabled={button} onClick={()=>peticionDelete()}>Eliminar</Button>
      </Paper>
        </>
    )
}

export default Tab