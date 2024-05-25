import React, { useContext, useState } from "react";
import { UserContext } from '../App';
import { lookInSession, storeInSession } from '../common/session';
import { Toaster, toast } from 'react-hot-toast';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import Dropdown from '../components/dropdown.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'


const InsertScores = () => {
  const [score, setScore] = useState('');
  const [activityId, setActivityId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [currentScore, setCurrentScore] = useState(null);
  const [participateNum, setParticipateNum] = useState(null);

  const {
    userAuth: { access_token, scores },
    setUserAuth,
  } = useContext(UserContext);

  async function fetchScoreAndParticipation() {
    try {
      const response = await fetch(`/api/get-score-and-participation?teamName=${teamName}&activityId=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentScore(data.score);
        setParticipateNum(data.participateNum);
        toast.success('데이터를 가져왔습니다.', { duration: 2000 });
      } else {
        toast.error('데이터를 가져오는데 실패했습니다.', { duration: 3000 });
      }
    } catch (error) {
      toast.error('데이터를 가져오는데 실패했습니다.', { duration: 3000 });
    }
  }

  async function updateScores(newScore, activityId, teamName) {
    try {
      const response = await fetch('/api/update-score-by-activity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId,
          teamName,
          newScore
        })
      });

      if (response.ok) {
        const scoresAndToken = await response.json();
        storeInSession('score', JSON.stringify(scoresAndToken));
        setUserAuth(scoresAndToken);
        toast.success('점수를 추가했습니다.', {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error('점수를 추가하는데 실패했습니다.', {
        duration: 3000,
      });
    }
  }

  const handleAddScore = (e) => {
    e.preventDefault();
    if (score.trim() && activityId && teamName) {
      updateScores(score, activityId, teamName);
      setScore('');
      setActivityId('');
      setTeamName('');
    } else {
      toast.error('Please fill in all fields.', {
        duration: 2000,
      });
    }
  };

  return (
    <>
      {access_token && (
        <MDBContainer className="py-2 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <MDBRow className="d-flex justify-content-center h-full">
            <MDBCol className="w-full">
              <MDBCard id="list1" style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }} className="w-full">
                <MDBCardBody className="py-2 px-3 px-md-5">
                  <p className="text-center py-2">
                    <u className='font-bold text-3xl no-underline'>점수 및 간식 관리</u>
                  </p>
                  <div className="pb-1">
                    <MDBCard className="w-full">
                      <MDBCardBody>
                        <div className="d-flex flex-column align-items-center w-full">
                          <Dropdown
                            endpoint="/api/teams"
                            placeholder="팀을 선택하세요"
                            onChange={(selectedOption) => setTeamName(selectedOption.value)}
                          />
                        </div>
                        <div className="d-flex flex-column align-items-center mt-2 w-full">
                          <Dropdown
                            endpoint="/api/get-activities"
                            placeholder="활동을 선택하세요"
                            onChange={(selectedOption) => setActivityId(selectedOption.value)}
                          />
                        </div>
                        <div className="d-flex flex-column align-items-center mt-2 w-full">
                          <button onClick={fetchScoreAndParticipation} className="w-full bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                            조회
                          </button>
                        </div>
                        {currentScore !== null && (
                          <div className="mt-2 text-center w-full ">
                            <p>현재 점수: {currentScore}</p>
                            <p>참여 활동 수: {participateNum}</p>
                          </div>
                        )}
                        <div className="d-flex flex-column align-items-center mt-2 w-full ">
                          <form onSubmit={handleAddScore} className="w-full ">
                            <input
                              type="number"
                              className="form-control form-control-lg w-full border"
                              placeholder="점수를 입력하세요"
                              value={score}
                              onChange={(e) => setScore(e.target.value)}
                            />
                            <button type="submit" className="w-full bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 mt-2">
                              추가
                            </button>
                          </form>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}
      <Toaster />
    </>
  );
}

export default InsertScores;
