import React , { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
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
    const {
        userAuth: { access_token, scores },
        setUserAuth,
    } = useContext(UserContext);

    const totalNum = scores ? Object.keys(scores[0]['activities']).length : 20;

    const newDataArray = [];
    if(scores) {
        Object.values(scores).forEach(scoreObj => {
            const { teamName, participateNum, totalScore, activities } = scoreObj;
            newDataArray.push(createData(teamName, participateNum, totalScore, activities));
        });
    }else {

    }
    

    const [rows, setRows] = React.useState(newDataArray);

    const [sortByTotalScore, setSortByTotalScore] = React.useState(null);
    const [sortByParticipateNum, setSortByParticipateNum] = React.useState(null);
    const [rankingOrder, setRankingOrder] = React.useState(null);
    const [clicked, setClicked] = React.useState(null);

    const handleSortByTotalScore = () => {
        const sortedRows = [...rows].sort((a, b) => b.totalScore - a.totalScore);
        setRows(sortByTotalScore ? sortedRows.reverse() : sortedRows);
        setSortByTotalScore(!sortByTotalScore);
        setSortByParticipateNum(null);
        setClicked('totalScore');
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
        setClicked('participateNum');
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

    function createData(teamNumber, participateNum, totalScore, activities) {
    return {
        teamNumber,
        participateNum,
        totalScore,
        activities
    };
    }

function Row(props) {
    const { row, index } = props;
    const [open, setOpen] = React.useState(false);
    let ranking;
    let currScore;
    if(clicked === 'totalScore') {
        currScore = rows[index].totalScore;
        if (rankingOrder === false) {
            ranking = index + 1;
            for(let i = index; i > 0; i--) {
                if (currScore === rows[i-1].totalScore) {
                    ranking = i;
                } else {   
                    break;
                }
            }
            if(index === 0) {
                ranking = 1;
            }
        } else if (rankingOrder === true) {
            ranking = rows.length - index;
            for(let i = index; i < rows.length -1; i++) {
                if (currScore === rows[i + 1].totalScore) {
                    ranking = ranking - 1;
                } else {
                    break;
                }
            }
        }
    } else if (clicked === 'participateNum') {
        currScore = rows[index].participateNum;
        if (rankingOrder === false) {
            ranking = index + 1;
            for(let i = index; i > 0; i--) {
                if (currScore === rows[i-1].participateNum) {
                    ranking = i;
                } else {   
                    break;
                }
            }
            if(index === 0) {
                ranking = 1;
            }
        } else if (rankingOrder === true) {
            ranking = rows.length - index;
            for(let i = index; i < rows.length -1; i++) {
                if (currScore === rows[i + 1].participateNum) {
                    ranking = ranking - 1;
                } else {
                    break;
                }
            }
        }
    }
  return (
    <React.Fragment>
        <TableRow style={{
            backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transparent',
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
            {/* {rankingOrder ? (rows.length - index) : (index + 1) }등
             */}
             {ranking}등
        </TableCell>
        <TableCell align="center" >{row.teamNumber}조</TableCell>
        <TableCell align="center" >{row.participateNum} / {totalNum}</TableCell>
        <TableCell align="center" >{row.totalScore}점</TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: index % 2 !== 0 ? '#FFEFEF' : 'transparent' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Typography variant="h6" gutterBottom component="div" className='pt-1'>
                활동별 점수
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                <TableRow className={index % 2 !== 0 ? 'bg-white rounded-lg' : 'bg-orange rounded-lg'}>
                    <TableCell align="center">활동명</TableCell>
                    <TableCell align="center">점수</TableCell>
                    <TableCell align="center">활동명</TableCell>
                    <TableCell align="center">점수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {Object.entries(row.activities).map(([activityName, score], index) => (
                    index % 2 === 0 ? (
                        // 짝수 번째 활동인 경우
                        <TableRow key={index}>
                            <TableCell component="th" scope="row" align="center">
                                {activityName}
                            </TableCell>
                            <TableCell align="center">{score}</TableCell>
                            {/* 다음 홀수 번째 활동이 있는지 확인하고 있으면 렌더링 */}
                            {index + 1 < Object.entries(row.activities).length && (
                                <TableCell component="th" scope="row" align="center">
                                    {Object.entries(row.activities)[index + 1][0]}
                                </TableCell>
                            )}
                            {/* 다음 홀수 번째 활동의 점수가 있는지 확인하고 있으면 렌더링 */}
                            {index + 1 < Object.entries(row.activities).length && (
                                <TableCell align="center">
                                    {Object.entries(row.activities)[index + 1][1]}
                                </TableCell>
                            )}
                        </TableRow>
                    ) : null
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
    totalScore: PropTypes.number.isRequired,
    participateNum: PropTypes.number.isRequired,
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
                <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>순위</TableCell>
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