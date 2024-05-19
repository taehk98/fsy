import React, { useState, useEffect } from 'react';
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

    const totalNum = 30;

    const [rows, setRows] = React.useState([
        createData(2, 1, 6.0, 24, 4.0),
        createData(1, 2, 9.0, 37, 4.3),
        createData(3, 3, 16.0, 24, 6.0),
        createData(4, 4, 3.7, 67, 4.3),
        createData(5, 5, 16.0, 49, 3.9),
      ]);

    const [sortByTotalScore, setSortByTotalScore] = React.useState(null);
    const [sortByParticipateNum, setSortByParticipateNum] = React.useState(null);
    const [rankingOrder, setRankingOrder] = React.useState(null);

    const handleSortByTotalScore = () => {
        const sortedRows = [...rows].sort((a, b) => b.totalScore - a.totalScore);
        setRows(sortByTotalScore ? sortedRows.reverse() : sortedRows);
        setSortByTotalScore(!sortByTotalScore);
        setSortByParticipateNum(null);
        if(sortByTotalScore) {
            setRankingOrder(true);
        } else {
            setRankingOrder(false);
        }
    };

    const handleSortByParticipateNum = () => {
        const sortedRows = [...rows].sort((a, b) => (b.participateNum / totalNum) - (a.participateNum / totalNum));
        setRows(sortByParticipateNum ? sortedRows.reverse() : sortedRows);
        setSortByParticipateNum(!sortByParticipateNum);
        setSortByTotalScore(null);
        if(sortByParticipateNum) {
            setRankingOrder(true);
        } else {
            setRankingOrder(false);
        }
    };

    useEffect(() => {
        // Call sorting function when the component mounts
        handleSortByTotalScore();
    }, []);

    function createData(rank, teamNumber, participateNum, totalScore, price) {
    return {
        rank,
        teamNumber,
        participateNum,
        totalScore,
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
//   if(index > 0 && rows[index].totalScore !== rows[index-1].totalScore) {
    //     setRankingOnTotal(index);
    //   }
    //   console.log(rankingOrder);
    //   console.log(index);
    //   console.log(row.totalScore);
    //   console.log(clicked);
    //   let ranking;
    //   if(clicked === 'totalScore') {
    //     if (rankingOrder === false) {
    //         for(let i = index; i > 0; i--) {
    //             if (rows[i].totalScore === rows[i-1].totalScore) {
    //                 ranking = i;
    //             } else {
    //                 if(ranking == index-1) {
    //                     ranking = index;
    //                 }
    //                 break;
    //             }
    //         }
    //         if(index === 0) {
    //             ranking = 1;
    //         }
    //     } else if (rankingOrder === true) {
    //         for(let i = index; i > 0; i--) {
    //             if (rows[i].totalScore === rows[i-1].totalScore) {
    //                 ranking = i;
    //             } else {
    //                 break;
    //             }
    //         }
    //         if(index === 0) {
    //             ranking = rows.length;
    //         }
    //     }
    //   }
  return (
    <React.Fragment>
        <TableRow style={{
            backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transparent',
            borderLeft: index < 5 && !rankingOrder ? '5px solid blue' : '',
            }} sx={{ '& > *': { borderBottom: 'unset' }}} 
        >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)} 
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center" >
            {rankingOrder ? (rows.length - index) : (index + 1) }등
        </TableCell>
        <TableCell align="center" >{row.teamNumber}조</TableCell>
        <TableCell align="center" >{row.participateNum} / {totalNum}</TableCell>
        <TableCell align="center" >{row.totalScore}점</TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transparent' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Typography variant="h6" gutterBottom component="div">
                참여율
              </Typography>
              <div className="progress mb-1" style={{ backgroundColor: index % 2 !== 0 ? 'white' : 'light-gray' }}>
                <div className="progress-bar font-bold" role="progressbar" style={{ width: `${(row.participateNum / totalNum) * 100}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    {((row.participateNum / totalNum) * 100).toFixed(1)}%
                </div>
                </div>
              <Table size="small" aria-label="purchases">
                <TableHead>
                <TableRow className={index % 2 !== 0 ? 'bg-white rounded-lg' : 'bg-lightpink rounded-lg'}>
                    <TableCell align="center">활동명</TableCell>
                    <TableCell align="center">점수</TableCell>
                    <TableCell align="center">활동명</TableCell>
                    <TableCell align="center">점수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow, index) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="center">{historyRow.customerId}</TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                      <TableCell align="center">
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
    teamNumber: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired,
    participateNum: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    rank: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

  return (
    <>
        <div className='text-2xl rounded font-semibold text-center py-2 bg-pink-100 mx-2'>
        실시간 순위표
        </div>
        <div className='mx-2'>
        <TableContainer component={Paper} className='bg-bgColor' sx={{ width: '100%' }} >
        <Table aria-label="collapsible table" style={{ maxWidth: '100%' }} sx={{ minWidth: 350}} size="small">
            <TableHead className='bg-ppink'>
            <TableRow 
                sx={{
                    color: 'white',
                }}>
                <TableCell />
                <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>등수</TableCell>
                <TableCell align="center"style={{ color: 'white', fontWeight: 'bold' }}>조</TableCell>
                <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>
                    <button onClick={handleSortByParticipateNum} style={{ color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        {!sortByParticipateNum ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon/>}
                        참여/총
                    </button>
                </TableCell>
                <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>
                    <button onClick={handleSortByTotalScore} style={{ color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        {!sortByTotalScore ? <KeyboardArrowUpIcon/> :  <KeyboardArrowDownIcon />}
                        총점
                    </button>
                </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row, index) => (
                <Row key={row.teamNumber} row={row} index={index} length={rows.length}/>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        </div>
    </>  
  );
}