import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function CollapsibleTable() {

function createData(name, calories, fat, carbs, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow style={{ backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transpent' }} sx={{ '& > *': { borderBottom: 'unset' } }} >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)} 
            
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" >
          {row.name}
        </TableCell>
        <TableCell align="right" >{row.calories}</TableCell>
        <TableCell align="right" >{row.fat}</TableCell>
        <TableCell align="right" >{row.carbs}</TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transparent' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Typography variant="h6" gutterBottom component="div">
                활동별 점수
              </Typography>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                </div>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow, index) => (
                    <TableRow key={historyRow.date} >
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0),
  createData('Ice', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Ginge', 356, 16.0, 49, 3.9),
];


  return (
    <>
        <TableContainer component={Paper} className='bg-bgColor mt-10'>
        <Table aria-label="collapsible table" style={{ maxWidth: 'full' }} sx={{ minWidth: 350}} size="small">
            <TableHead className='bg-ppink'>
            <TableRow 
                sx={{
                    color: 'white',
                }}>
                <TableCell />
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>등수</TableCell>
                <TableCell align="right" style={{ color: 'white', fontWeight: 'bold' }}>조 이름</TableCell>
                <TableCell  style={{ color: 'white', fontWeight: 'bold' }}>참여/총</TableCell>
                <TableCell align="right" style={{ color: 'white', fontWeight: 'bold' }}>총점</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row, index) => (
                <Row key={row.name} row={row} index={index}/>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </>  
  );
}