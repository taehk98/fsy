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

const InsertScores = () => {
  const [score, setScore] = useState('');
  const [activityId, setActivityId] = useState('');
  const [teamName, setTeamName] = useState('');

  const {
    userAuth: { access_token, scores },
    setUserAuth,
  } = useContext(UserContext);

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
        toast.success('Score added successfully.', {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error('Failed to add score.', {
        duration: 3000,
      });
    }
  }

  const handleAddScore = () => {
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
        <MDBContainer className="py-2">
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard id="list1" style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }}>
                <MDBCardBody className="py-2 px-3 px-md-5">
                  <p className="text-center py-2">
                    <u className='font-bold text-3xl no-underline'>Score Management</u>
                  </p>
                  <div className="pb-1">
                    <MDBCard>
                      <MDBCardBody>
                        <div className="d-flex flex-row align-items-center">
                          <Dropdown
                            endpoint="/api/teams"
                            placeholder="Select a team"
                            onChange={(selectedOption) => setTeamName(selectedOption.value)}
                          />
                        </div>
                        <div className="d-flex flex-row align-items-center mt-2">
                          <Dropdown
                            endpoint="/api/get-activities"
                            placeholder="Select an activity"
                            onChange={(selectedOption) => setActivityId(selectedOption.value)}
                          />
                        </div>
                        <div className="d-flex flex-row align-items-center mt-2">
                          <input
                            type="text"
                            className="form-control form-control-lg w-9/12 md:w-11/12"
                            placeholder="e.g., Team 1 -> 1"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                          />
                          <button onClick={handleAddScore} className="w-3/12 md:w-1/12 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                            Add
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

export default InsertScores;
