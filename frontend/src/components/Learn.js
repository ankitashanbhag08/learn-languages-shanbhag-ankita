import  React, {useState, useEffect} from 'react';
import { styled, tableCellClasses } from '@mui/material';
import {Paper,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TablePagination,
        TableRow} from '@mui/material';

const axios = require('axios')

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Learn = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recordSize, setRecordSize] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([])

   async function getData(){
      let hr = await axios.get('http://localhost:8080/teach');
      console.log(hr.data)
      setRecords(hr.data);
      setRecordSize(hr.data.length)
    }  
   useEffect(()=>{  
      getData();
      
  },[])  
  return (
   
    <Paper sx={{ width: '80%', margin: 'auto', marginTop: '25vh' }}>
      <h3>Learn the words for test</h3>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{background:"#063970"}}>            
            <TableRow>
                <StyledTableCell align="center">English Word</StyledTableCell>
                <StyledTableCell align="center">Finnish Word</StyledTableCell>
                <StyledTableCell align="center">Category</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => {
                return (
                  <StyledTableRow key={record.eng_id}>
                        <StyledTableCell align="center">{record.eng_word}</StyledTableCell>
                        <StyledTableCell align="center">{record.fin_word}</StyledTableCell>
                        <StyledTableCell align="center">{record.name}</StyledTableCell>
                    </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5,10,15, { value: -1, label: 'All' }]}
        component="div"
        count={recordSize}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  
  );
}
export default Learn;