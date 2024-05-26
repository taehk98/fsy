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
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons';


const InsertScores = () => {
  const [score, setScore] = useState('');
  const [activityId, setActivityId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [currentScore, setCurrentScore] = useState(null);
  const [participateNum, setParticipateNum] = useState(null);
  const [snackData, setSnackData] = useState([]);

  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  async function fetchScoreAndParticipation() {
    try {
      const response = await fetch(`/api/get-score-and-participation?teamName=${teamName}&activityId=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        if(activityId !== '' && activityId !== undefined && activityId !== null) {
            setCurrentScore(data.score);
        }
        setParticipateNum(data.participateNum);
        setSnackData(data.snack);
        console.log(data.snack);
        toast.success('데이터를 가져왔습니다.', { duration: 1000 });
      } else {
        if(activityId !== '' && activityId !== undefined && activityId !== null) {
            toast.error('팀을 확인해주세요.', { duration: 2000 });
        }else {
            toast.error('팀과 활동을 확인해주세요.', { duration: 2000 });
        }
        
      }
    } catch (error) {
      toast.error('데이터를 가져오는데 실패했습니다.', { duration: 2000 });
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
        storeInSession('data', JSON.stringify(scoresAndToken.updatedScores));
        toast.success('점수를 업데이트했습니다.', {
          duration: 1000,
        });
      }
    } catch (error) {
      toast.error('점수 업데이트에 실패했습니다.', {
        duration: 2000,
      });
    }
  }

  const handleAddScore = (e) => {
    e.preventDefault();
    if (score.trim() && activityId && teamName) {
      updateScores(score, activityId, teamName);
      setScore('');
      // setActivityId('');
      // setTeamName('');
    } else {
      toast.error('Please fill in all fields.', {
        duration: 2000,
      });
    }
  };

  const handleSnackButton = async (index) => {
    // 상태를 변경하는 함수를 호출하여 snackData 상태를 업데이트합니다.
    let snack = [];
    setSnackData(prevSnackData => {
      const updatedSnackData = [...prevSnackData];
      updatedSnackData[index] = !updatedSnackData[index];
      snack = updatedSnackData;
      return updatedSnackData;
    });
    try {
        console.log(snack);
        const response = await fetch('/api/update-snack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            snack,
            teamName,
          })
        });
  
        if (response.ok) {
          toast.success('업데이트 되었습니다.', {
            duration: 1000,
          });
        }
      } catch (error) {
        toast.error('업데이트에 실패했습니다.', {
          duration: 2000,
        });
      }

  };

  return (
    <>
      {access_token && (
        <MDBContainer className="py-2 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <MDBRow className="d-flex justify-content-center">
            <MDBCol className="w-full">
              <MDBCard id="list1" style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }} className="w-full">
                <MDBCardBody className="py-2 px-3 px-md-5">
                  <p className="text-center py-2">
                    <u className='font-bold text-3xl no-underline'>점수 관리</u>
                  </p>
                  <div className="pb-1">
                    <MDBCard className="w-full">
                      <MDBCardBody>
                        <div className="d-flex flex-column align-items-center w-full">
                          <Dropdown
                            endpoint="/api/teams"
                            placeholder="조를 선택하세요."
                            onChange={(selectedOption) => setTeamName(selectedOption.value)}
                          />
                        </div>
                        <div className="d-flex flex-column align-items-center mt-2 w-full">
                          <Dropdown
                            endpoint="/api/get-activities"
                            placeholder="활동을 선택하세요."
                            onChange={(selectedOption) => setActivityId(selectedOption.value)}
                          />
                        </div>
                        <div className="flex justify-content-center py-2 pt-3">
                          <button onClick={fetchScoreAndParticipation} className="md:w-48 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                            점수 조회
                          </button>
                        </div>
                        {currentScore !== null && (
                            <div className="text-center w-full">
                                <p className="text-xl font-semibold mb-2 mt-2">현재 점수:</p>
                                <div className="bg-gray-100 rounded-lg p-2 mx-auto w-32">
                                <p className="text-2xl text-pink-500">{currentScore}</p>
                                </div>
                            </div>
                            )}  
                        <div className="border-t border-gray-300 my-4"></div>
                        <div className="d-flex flex-column align-items-center mt-6 md:justify-content-center md:items-center md:flex md:w-full">
                          <form onSubmit={handleAddScore} className="w-3/5 md:w-96">
                            <input
                              type="number"
                              className="form-control form-control-lg w-full border"
                              placeholder="점수를 입력하세요."
                              value={score}
                              onChange={(e) => setScore(e.target.value)}
                            />
                            <div className='flex justify-content-center mt-2'>
                                <button type="submit" className="md:w-48 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 mt-2">
                                    점수 업데이트
                                </button>
                            </div>
                            
                          </form>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow className="d-flex justify-content-center mt-6">
            <MDBCol className="w-full">
              <MDBCard style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }} className="w-full">
                <MDBCardBody className="py-2 px-3 px-md-5">
                  <p className="text-center py-2">
                    <u className='font-bold text-3xl no-underline'>간식</u>
                  </p>
                  <div className="pb-1">
                    <MDBCard className="w-full">
                        <MDBCardBody>
                        <div className="d-flex flex-column align-items-center w-full">
                          <Dropdown
                            endpoint="/api/teams"
                            placeholder="조를 선택하세요."
                            onChange={(selectedOption) => setTeamName(selectedOption.value)}
                          />
                        </div>
                            <div className="flex justify-content-center py-2 pt-3">
                            <button onClick={fetchScoreAndParticipation} className="md:w-48 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                                조회
                            </button>
                            </div>
                            {participateNum !== null && (
                                <div className="text-center w-full">
                                    <p className="text-xl font-semibold mb-2">참여 활동 수:</p>
                                    <div className="bg-gray-100 rounded-lg p-2 mx-auto w-32">
                                    <p className="text-2xl text-pink-500">{participateNum}</p>
                                    </div>
                                </div>
                            )}  
                            <div className='flex items-center justify-center px-6 py-2'>
                                {snackData.map((snack, index) => (
                                <div key={index} className="relative">
                                    <FontAwesomeIcon
                                    icon={snack ? faCircleCheck : faCircle}
                                    className="text-green-500 text-3xl m-2"
                                    onClick={() => handleSnackButton(index)}
                                    />
                                </div>
                                ))}
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
