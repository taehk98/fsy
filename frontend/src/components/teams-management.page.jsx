import React , { useContext, useState } from 'react';
import { UserContext } from '../App';
import { lookInSession, storeInSession } from '../common/session';
import { Toaster, toast } from 'react-hot-toast';
import './teams-management.css';
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

export function TeamList() {
    const [teamName, setTeamName] = useState('');

    const {
        userAuth: { access_token, scores },
        setUserAuth,
      } = useContext(UserContext);

    // insert a team to scores
    async function insertTeam(newTeam) {
        try {
            const response = await fetch('/api/insert-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeam),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            if (response.status === 200) {
                const scoresAndToken = await response.json();
                storeInSession('user', JSON.stringify(scoresAndToken));
                setUserAuth(scoresAndToken);
                toast.success('조를 추가했습니다.', {
                    duration: 2000, // 2초 동안 표시
                });
            }
        } catch (error) {
            toast.error('조를 추가하는데 실패했습니다.', {
                duration: 3000, // 3초 동안 표시
            });
        }
    }


    const addTeam = ( async () => {
        let duplicatName = false;
        let error = false;

        scores.forEach(team => {
            if(team.teamName == teamName) {
                toast.error('중복된 팀 아이디가 있습니다. \n다른 이름을 사용해주세요', {
                    duration: 3000 // 1초 동안 표시
                });
                duplicatName = true;
                return;
            }
        })

        if (duplicatName) {
            return; // 함수 종료
        }

        let activityList = [];
        let activitiesObject = {};
        await fetch(`/api/get-activityList`)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json(); // JSON 데이터로 변환하여 반환
            })
            .then(data => {
                // 받아온 데이터를 처리
                activityList = data;
            })
            .catch(error => {
                // 오류 처리
                toast.error('활동리스트를 가져오는데 실패했습니다.', {
                    duration: 3000 // 1초 동안 표시
                });
                console.error('There was a problem with the fetch operation:', error);
                error = true;
            });

        if (error) {
            return; // 함수 종료
        }

        activityList[0].activities.forEach(activity => {
            activitiesObject[activity] = 0;
        });
        
        const newTeam = {
            teamName: teamName,
            totalScore: 0,
            paticipateNum: 0,
            activitities: activitiesObject
        }

        await insertTeam(newTeam);
    });

    return (
        <>
        {access_token && (
            <MDBContainer className="py-2 ">
            <MDBRow className="d-flex justify-content-center align-items-center h-100">
                <MDBCol>
                <MDBCard
                    id="list1"
                    style={{ borderRadius: ".75rem", backgroundColor: "#FFE6E6" }}
                >
                    <MDBCardBody className="py-2 px-3 px-md-5">
                    <p className="  text-center py-2 ">
                        <u className='font-bold text-3xl no-underline'>조 관리</u>
                    </p>
                    <div className="pb-1">
                        <MDBCard>
                        <MDBCardBody>
                            <div className="d-flex flex-row align-items-center">
                                <input
                                    type="text"
                                    className="form-control form-control-lg w-9/12 md:w-11/12"
                                    id="exampleFormControlInput1"
                                    placeholder="예시) 1조 -> 1"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                                <button onClick={addTeam} className="w-3/12 md:w-1/12 bg-ppink text-white px-3 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                                    추가
                                </button>
                            </div>
                        </MDBCardBody>
                        </MDBCard>
                    </div>
                    <hr className="my-4" />

                    <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
                        <p className="small mb-0 me-2 text-muted">Filter</p>
                        <MDBTooltip
                        tag="a"
                        wrapperProps={{ href: "#!" }}
                        title="Ascending"
                        >
                        <MDBIcon
                            fas
                            icon="sort-amount-down-alt"
                            className="ms-2"
                            style={{ color: "#23af89" }}
                        />
                        </MDBTooltip>
                    </div>


                    <MDBListGroup horizontal className="rounded-0 bg-transparent">
                        <MDBListGroupItem className="d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                        <MDBCheckbox
                            name="flexCheck"
                            value=""
                            id="flexCheckChecked"
                            defaultChecked
                        />
                        </MDBListGroupItem>
                        <MDBListGroupItem className="px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                        {" "}
                        <p className="lead fw-normal mb-0">
                            1조
                        </p>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                        <div className="d-flex flex-row justify-content-end mb-1 items-center">
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Edit todo"
                            >
                            <MDBIcon
                                fas
                                icon="pencil-alt"
                                className="me-3"
                                color="info"
                            />
                            </MDBTooltip>
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Delete todo"
                            >
                            <MDBIcon fas icon="trash-alt" color="danger" />
                            </MDBTooltip>
                        </div>
                        </MDBListGroupItem>
                    </MDBListGroup>

                    <MDBListGroup horizontal className="rounded-0 bg-transparent">
                        <MDBListGroupItem className="d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                        <MDBCheckbox name="flexCheck" value="" id="flexCheck" />
                        </MDBListGroupItem>
                        <MDBListGroupItem className="px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                        {" "}
                        <p className="lead fw-normal mb-0">2조</p>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="px-3 py-1 d-flex align-items-center border-0 bg-transparent">
                        <div className="px-2 me-2 border-1 border-ppink rounded-3 d-flex align-items-center bg-light">
                            <p className="medium mb-0">
                            <MDBTooltip
                                tag="a"
                                wrapperProps={{ href: "#!" }}
                                title="Due on date"
                            >
                            </MDBTooltip>
                            (1/20)
                            </p>
                        </div>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                        <div className="d-flex flex-row justify-content-end mb-1">
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Edit todo"
                            >
                            <MDBIcon
                                fas
                                icon="pencil-alt"
                                className="me-3"
                                color="info"
                            />
                            </MDBTooltip>
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Delete todo"
                            >
                            <MDBIcon fas icon="trash-alt" color="danger" />
                            </MDBTooltip>
                        </div>
                        </MDBListGroupItem>
                    </MDBListGroup>


                    <MDBListGroup horizontal className="rounded-0 bg-transparent ">
                        <MDBListGroupItem className="d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent ">
                        <MDBCheckbox name="flexCheck" value="" id="flexCheck" />
                        </MDBListGroupItem>
                        <MDBListGroupItem className="px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                        {" "}
                        <p className="lead fw-normal mb-0 w-100 ms-n2 ps-2 py-1 rounded">
                            3조
                        </p>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                        <div className="d-flex flex-row justify-content-end mb-1">
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Edit todo"
                            >
                            <MDBIcon
                                fas
                                icon="pencil-alt"
                                className="me-3"
                                color="info"
                            />
                            </MDBTooltip>
                            <MDBTooltip
                            tag="a"
                            wrapperProps={{ href: "#!" }}
                            title="Delete todo"
                            >
                            <MDBIcon fas icon="trash-alt" color="danger" />
                            </MDBTooltip>
                        </div>
                        </MDBListGroupItem>
                    </MDBListGroup>
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