import React, {useContext,useState} from "react"
import { UserContext } from '../App';
import { lookInSession, storeInSession } from '../common/session';
import { Toaster, toast } from 'react-hot-toast';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { m } from 'framer-motion';

const InsertScores = () => {
    const [score, setScore] = useState('');
    const [activityId, setActivityId] = useState('');
    const [teamId, setTeamId] = useState('');

    const {
        userAuth: { access_token, scores },
        setUserAuth,
      } = useContext(UserContext);

      async function updateScores(newScore, activityId, teamId) {
        try {
            // const payload = { activityId, teamId, newScore };
            // console.log('Sending payload:', payload); // Add this line for debugging

          const response = await fetch('/api/update-score-by-activity', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activityId, teamId, newScore }),
          });
        //   console.log(response);
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          if (response.status === 200) {
            const scoresAndToken = await response.json();
            storeInSession('score', JSON.stringify(scoresAndToken));
            setUserAuth(scoresAndToken);
            toast.success('점수를 추가했습니다', {
              duration: 2000, // 2초 동안 표시
            });
          }
        } catch (error) {
          toast.error('점수를 추가하는데 실패했습니다.', {
            duration: 3000, // 3초 동안 표시
          });
        }
      }
      const handleAddScore = () => {
        if (score.trim() && activityId.trim() && teamId.trim()) {
          updateScores(score, activityId, teamId);
          setScore('');
          setActivityId('');
          setTeamId('');
        } else {
          toast.error('모든 필드를 입력하세요.', {
            duration: 2000, // 2초 동안 표시
          });
        }
      };
      return (
        <>
          {access_token && (
            <MDBContainer className="py-2">
              <MDBRow className="d-flex justify-content-center align-items-center h-100">
                <MDBCol>
                  <MDBCard id="list1" style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }}>
                    <MDBCardBody className="py-2 px-3 px-md-5">
                      <p className="text-center py-2">
                        <u className='font-bold text-3xl no-underline'>점수 관리</u>
                      </p>
                      <div className="pb-1">
                        <MDBCard>
                          <MDBCardBody>
                            <div className="d-flex flex-row align-items-center">
                              <input
                                type="text"
                                className="form-control form-control-lg w-9/12 md:w-11/12"
                                placeholder="팀 ID"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                              />
                            </div>
                            <div className="d-flex flex-row align-items-center mt-2">
                              <input
                                type="text"
                                className="form-control form-control-lg w-9/12 md:w-11/12"
                                placeholder="활동 ID"
                                value={activityId}
                                onChange={(e) => setActivityId(e.target.value)}
                              />
                            </div>
                            <div className="d-flex flex-row align-items-center mt-2">
                              <input
                                type="text"
                                className="form-control form-control-lg w-9/12 md:w-11/12"
                                placeholder="예시) 1조 -> 1"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                              />
                              <button onClick={handleAddScore} className="w-3/12 md:w-1/12 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                                추가
                              </button>
                            </div>
                          </MDBCardBody>
                        </MDBCard>
                      </div>
                      <hr className="my-4" />
                      {/* Existing code for rendering scores */}
                      {/* ... */}
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
export default InsertScores